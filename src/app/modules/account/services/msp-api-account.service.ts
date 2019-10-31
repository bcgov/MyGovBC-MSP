import { Injectable } from '@angular/core';
import { MspLogService } from '../../../services/log.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { MspAccountApp } from '../models/account.model';
import { AttachmentType, _ApplicationTypeNameSpace } from '../../msp-core/api-model/applicationTypes';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { AbstractHttpService, CommonImage } from 'moh-common-lib';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Response } from '@angular/http';
import { MspApiService } from '../../../services/msp-api.service';
import { AccountMaintenanceApiResponse } from '../models/account-response.interface';
import { SchemaService } from 'app/services/schema.service';
import { AccountChangeAccountHolderFactory, AccountChangeAccountHolderType, AccountChangeChildType, AccountChangeChildTypeFactory, AccountChangeChildrenFactory, AccountChangeSpouseType, AccountChangeSpouseTypeFactory, AccountChangeSpousesTypeFactory, OperationActionType } from '../../../modules/msp-core/api-model/accountChangeTypes';
import { AccountChangeApplicationType } from '../../msp-core/interfaces/i-api';
import { OperationActionType as OperationActionTypeEnum, MspPerson } from '../../../components/msp/model/msp-person.model';
import { Address } from 'moh-common-lib';
import { AttachmentTypeFactory, AttachmentsType, AttachmentsTypeFactory } from '../../../modules/msp-core/api-model/applicationTypes';
import { AddressType, AddressTypeFactory, CitizenshipType, GenderType, NameType, NameTypeFactory } from '../../../modules/msp-core/api-model/commonTypes';
import { LivedInBCTypeFactory, OutsideBCTypeFactory, WillBeAwayTypeFactory } from '../../../modules/msp-core/api-model/enrolmentTypes';
import {
  MSPApplicationSchema
} from 'app/modules/msp-core/interfaces/i-api';
import { StatusInCanada, CanadianStatusReason } from '../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../models/relationship.enum';
import { ApiResponse } from 'app/models/api-response.interface';
import { format } from 'date-fns';


@Injectable({
  providedIn: 'root'
})

//TODO - nothing has been done on these service except the skeleton.
// This service should handle the hitting of the middleware
export class MspApiAccountService extends AbstractHttpService {

  protected _headers: HttpHeaders = new HttpHeaders();
  readonly ISO8601DateFormat = 'yyyy-MM-dd';
  accountMaintenanceApiResponse: AccountMaintenanceApiResponse;


  constructor(
    protected http: HttpClient,
    private logService: MspLogService,
    private schemaSvc: SchemaService  ) {
    super(http);
  }

  /**
   * User does NOT specify document type therefore we always say its a supporting document
   * @type {string}
   */
  static readonly AttachmentDocumentType = 'SupportDocument';
  static readonly ApplicationType = 'benefitApplication';

  sendRequest(app: MspAccountApp): Promise<any> {

    const suppBenefitRequest = this.prepareAccountApplication(app);
    console.log(suppBenefitRequest);

    return new Promise<ApiResponse>((resolve, reject) => {
      //Validating the response against the schema
      this.schemaSvc.validate(suppBenefitRequest).then(res => {
        console.log(res.errors);
        if (res.errors) {
          let errorField;
          let errorMessage;

          // Getting the error field
          for (const error of res.errors) {
            errorField = error.dataPath.substr(34);
            errorMessage = error.message;
          }

          // checking the errors and routing to the correct URL
          if (errorField && errorMessage) {
            this.logService.log(
              {
                text:
                  'Account Maintenance - API validation against schema failed becuase of ' +
                  errorField +
                  ' field',
                response: errorMessage
              },
              'Account Maintenance -  API validation against schema failed'
            );

           /* const mapper = new FieldPageMap();
            const index = mapper.findStep(errorField);
            const urls = this.dataSvc.getMspProcess().processSteps;
            this.router.navigate([urls[index].route]); */
            return reject(errorMessage);
          }
        }

        // if no errors, then we'll sendApplication all attachments
        return this.sendAttachments(
          app.authorizationToken,
          app.uuid,
          app.getAllImages()
        )
          .then(attachmentResponse => {
            // TODO - Likely have to store all the responses for image uploads, so we can use those UUIDs with our application puload
            // unless we can just use our pre-uploaded ones? though that has potential for missing records.
            // once all attachments are done we can sendApplication in the data
            console.log('sendAttachments response', attachmentResponse);

            return this.sendApplication(
              suppBenefitRequest,
              app.uuid,
              app.authorizationToken
            ).subscribe(response => {
              console.log(response);
              // Add reference number
              if (response && response.op_reference_number) {
                app.referenceNumber = response.op_reference_number.toString();
                console.log(app.referenceNumber);
              }
              // Let our caller know were done passing back the application
              return resolve(response);
            });
          })
          .catch((error: Response | any) => {
            // TODO - Is this error correct? What if sendApplication() errors, would it be caught in this .catch()?
            console.log('sent all attachments rejected: ', error);
            this.logService.log(
              {
                text: 'Attachment - Send All Rejected ',
                response: error
              },
              'Attachment - Send All Rejected '
            );
            return resolve(error);
          });
      });
    });
  }

  sendApplication(
    app: MSPApplicationSchema,
    uuid: string,
    authToken: string
  ): Observable<any> {
    const url =
      environment.appConstants.apiBaseUrl +
      environment.appConstants.suppBenefitAPIUrl +
      uuid;

    // Setup headers
    this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Response-Type': 'application/json',
      'X-Authorization': 'Bearer ' + authToken
    });
    return this.post<MspAccountApp>(url, app);
  }


  public sendAttachments(
    token: string,
    applicationUUID: string,
    attachments: CommonImage[]
  ): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      // Instantly resolve if no attachments
      if (!attachments || attachments.length < 1) {
        resolve();
      }

      // Make a list of promises for each attachment
      const attachmentPromises = new Array<Promise<string>>();
      for (const attachment of attachments) {
        attachmentPromises.push(
          this.sendAttachment(token, applicationUUID, attachment)
        );
      }
      // this.logService.log({
      //    text: "Send All Attachments - Before Sending",
      //     numberOfAttachments: attachmentPromises.length
      // }, "Send Attachments - Before Sending")

      // Execute all promises are waiting for results
      return Promise.all(attachmentPromises)
        .then(
          (responses: string[]) => {
            // this.logService.log({
            //     text: "Send All Attachments - Success",
            //     response: responses,
            // }, "Send All Attachments - Success")
            console.log('resolving responess', responses);
            return resolve(responses);
          },
          (error: Response | any) => {
            this.logService.log(
              {
                text: 'Attachments - Send Error ',
                error: error
              },
              'Attachments - Send Error '
            );
            console.log('error sending attachment: ', error);
            return reject();
          }
        )
        .catch((error: Response | any) => {
          this.logService.log(
            {
              text: 'Attachments - Send Error ',
              error: error
            },
            'Attachments - Send Error '
          );
          console.log('error sending attachment: ', error);
          return error;
        });
    });
  }

  private sendAttachment(
    token: string,
    applicationUUID: string,
    attachment: CommonImage
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      /*
             Create URL
             /{applicationUUID}/attachment/{attachmentUUID}
             */
      let url =
        environment.appConstants['apiBaseUrl'] +
        environment.appConstants['attachment'] +
        applicationUUID +
        '/attachments/' +
        attachment.uuid;

      // programArea
      url += '?programArea=enrolment';

      // attachmentDocumentType - UI does NOT collect this property
      url += '&attachmentDocumentType=' + MspApiService.AttachmentDocumentType;

      // contentType
      url += '&contentType=' + attachment.contentType;

      // imageSize
      url += '&imageSize=' + attachment.size;

      // Necessary to differentiate between PA and SuppBen
      // TODO - VALIDATE THIS VALUE IS CORRECT, NEEDS TO BE CONFIRMED
      url += '&dpackage=msp_account_change_pkg';

      // Setup headers
      const headers = new HttpHeaders({
        'Content-Type': attachment.contentType,
        'Access-Control-Allow-Origin': '*',
        'X-Authorization': 'Bearer ' + token
      });
      const options = { headers: headers, responseType: 'text' as 'text' };

      const binary = atob(attachment.fileContent.split(',')[1]);
      const array = <any>[];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(array)], {
        type: attachment.contentType
      });

      return this.http
        .post(url, blob, options)
        .toPromise()
        .then(
          response => {
            // this.logService.log({
            //     text: "Send Individual Attachment - Success",
            //     response: response,
            // }, "Send Individual Attachment - Success")
            return resolve(response);
          },
          (error: Response | any) => {
            console.log('error response in its origin form: ', error);
            this.logService.log(
              {
                text: 'Attachment - Send Error ',
                response: error
              },
              'Attachment - Send Error '
            );
            return reject(error);
          }
        )
        .catch((error: Response | any) => {
          console.log('Error in sending individual attachment: ', error);
          this.logService.log(
            {
              text: 'Attachment - Send Error ',
              response: error
            },
            'Attachment - Send Error '
          );

          reject(error);
        });
    });
  }

  protected handleError(error: HttpErrorResponse) {
    // console.log("handleError", JSON.stringify(error));
    if (error.error instanceof ErrorEvent) {
      //Client-side / network error occured
      console.error('MSP Supp Benefit API error: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Msp Supp Benefit Backend returned error code: ${
          error.status
        }.  Error body: ${error.error}`
      );
    }

    this.logService.log(
      {
        text: 'Cannot get Suppbenefit API response',
        response: error
      },
      'Cannot get Suppbenefit API response'
    );

    // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
    return of(error);
    // return of([]);
  }

  convertSampleResponse(): AccountChangeApplicationType {
    const toa: any = {
      'accountHolder': {
        'name': {
          'firstName': 'Accountholder',
          'lastName': 'AccountholderLastname',
          'secondName': 'AccountholderMiddleName'
        },
        'gender': 'F',
        'birthDate': '1990-01-03',
        'phn': '9214213255',
        'residenceAddress': {
          'addressLine1': 'ABCDEFGHIJKLM',
          'city': 'ABCDEFGHIJ',
          'postalCode': 'ABCDEFGHIJKLMNOPQRSTU',
          'provinceOrState': 'ABCDEFGHIJKLMNOPQ',
          'country': 'ABCDEFGHIJKLMN',
          'addressLine2': 'ABCDEFGHIJKLMNOPQRSTUVWX',
          'addressLine3': 'ABCDEFGHIJKLMNOPQRST'
        },
        'authorizedByApplicant': 'N',
        'authorizedByApplicantDate': '2019-01-03',
        'selectedAddressChange': 'Y',
        'selectedPersonalInfoChange': 'Y',
        'selectedAddRemove': 'Y',
        'selectedStatusChange': 'N',
        'attachmentUuids': [
          'ABCDEFGHIJKLMNOPQRSTUVWXYZABC'
        ],
        'telephone': '8902205701',
        'mailingAddress': {
          'addressLine1': 'ABCDEFGHIJ',
          'city': 'ABCDEFGHIJKLMNOPQRSTU',
          'postalCode': 'ABCDEFGHIJKLMNOPQR',
          'provinceOrState': 'ABCD',
          'country': 'ABCDEFGHIJKLMNOPQRSTUV',
          'addressLine2': 'ABCDEFGHI',
          'addressLine3': 'ABCDEFGHIJKLMNOPQRS'
        },
        'citizenship': 'WorkPermit',
        'authorizedBySpouse': 'Y'
      },
      'spouses': {
        'removedSpouse': {
          'name': {
            'firstName': 'ABCD',
            'lastName': 'ABCDEF',
            'secondName': 'ABCDEFGHIJK'
          },
          'birthDate': '1990-01-03',
          'gender': 'F',
          'phn': '9214213255',
          'attachmentUuids': [
            'ABCDEFGHIJKLMNOPQRS'
          ],
          'citizenship': 'ReligiousWorker',
          'previousCoverage': {
            'hasPreviousCoverage': 'Y',
            'prevPHN': '7179189832'
          },
          'livedInBC': {
            'hasLivedInBC': 'Y',
            'recentBCMoveDate': '1992-01-03',
            'recentCanadaMoveDate': '1990-01-03',
            'isPermanentMove': 'N',
            'prevProvinceOrCountry': 'ABCDEFGHIJKLMNOPQRST',
            'prevHealthNumber': 'ABCDEFGHIJKLMNOPQ'
          },
          'outsideBC': {
            'beenOutsideBCMoreThan': 'Y',
            'departureDate': '1992-01-03',
            'returnDate': '1993-01-03',
            'familyMemberReason': 'ABCDE',
            'destination': 'ABCDEFGHIJKLM'
          },
          'outsideBCinFuture': {
            'beenOutsideBCMoreThan': 'N',
            'departureDate': '1994-01-03',
            'returnDate': '1995-01-03',
            'familyMemberReason': 'ABCDEFGHIJKLMNOPQRSTUVWXYZA',
            'destination': 'ABCDEFGHIJKLMNO'
          },
          'willBeAway': {
            'isFullTimeStudent': 'N',
            'isInBCafterStudies': 'N',
            'armedDischargeDate': '2018-01-03',
            'armedForceInstitutionName': 'ABCDEFGHIJK'
          },
          'previousLastName': 'ABCDEFGHIJKLMNOPQ',
          'mailingAddress': {
            'addressLine1': 'ABCDEFGHI',
            'city': 'ABCDEFGHIJKLMNOPQR',
            'postalCode': 'ABCDEFGHIJKL',
            'provinceOrState': 'ABCDEFGHI',
            'country': 'ABCDEFGHIJ',
            'addressLine2': 'ABCDEFGH',
            'addressLine3': 'ABCDEFGHIJKLMNOPQRSTU'
          },
          'marriageDate': '2016-01-03',
          'cancellationReason': 'ABCDEFGHIJKLMNOP',
          'cancellationDate': '2017-01-03'
        },
        'addedSpouse': {
          'name': {
            'firstName': 'ABCD',
            'lastName': 'ABCDEFGH',
            'secondName': 'ABCDEF'
          },
          'birthDate': '1990-01-03',
          'gender': 'F',
          'phn': '9214213255',
          'attachmentUuids': [
            'ABCDEFGHIJKLMNOPQRSTUVWXYZABC'
          ],
          'citizenship': 'CanadianCitizen',
          'previousCoverage': {
            'hasPreviousCoverage': 'Y',
            'prevPHN': '9214213255'
          },
          'livedInBC': {
            'hasLivedInBC': 'Y',
            'recentBCMoveDate': '2681-16-95',
            'recentCanadaMoveDate': '1624-03-75',
            'isPermanentMove': 'N',
            'prevProvinceOrCountry': 'ABCDEFGH',
            'prevHealthNumber': 'ABCDEFGHIJKLMNO'
          },
          'outsideBC': {
            'beenOutsideBCMoreThan': 'Y',
            'departureDate': '2067-02-29',
            'returnDate': '2909-03-62',
            'familyMemberReason': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'destination': 'ABCDE'
          },
          'outsideBCinFuture': {
            'beenOutsideBCMoreThan': 'Y',
            'departureDate': '1364-08-55',
            'returnDate': '2554-05-99',
            'familyMemberReason': 'ABCDEFGHIJKLMNOPQRSTUV',
            'destination': 'ABCDEFGHIJKLMN'
          },
          'willBeAway': {
            'isFullTimeStudent': 'Y',
            'isInBCafterStudies': 'Y',
            'armedDischargeDate': '1998-01-03',
            'armedForceInstitutionName': 'ABCDE'
          },
          'previousLastName': 'ABCDEFGHIJKLMNOPQ',
          'mailingAddress': {
            'addressLine1': 'ABCD',
            'city': 'ABCDEFGHIJKLMNOPQRSTUVW',
            'postalCode': 'ABCDEFGHIJKLMNO',
            'provinceOrState': 'ABCDEFGHIJKLMNOPQRST',
            'country': 'ABCDEFGHIJ',
            'addressLine2': 'ABCDEFGHIJKL',
            'addressLine3': 'ABCDEFGH'
          },
          'marriageDate': '1990-01-03',
          'cancellationReason': 'ABCDEFGHIJKLMNOPQRST',
          'cancellationDate': '1990-01-03'
        }
      }
  };

    return toa;
  }

  // This method is used to convert the response from user into a JSON object
  convertMspAccountApp(from: MspAccountApp): AccountChangeApplicationType  {

   // const accountHardcodeRes = ;


   const to: any = {};


    // UUID
    // UUID
    to.application.uuid = from.uuid;

   // to.application.accountChangeApplication = AccountChangeApplicationTypeFactory.make();


    to.application.accountChangeApplication.accountHolder = this.convertAccountHolderFromAccountChange(from);

    //spouses
    to.application.accountChangeApplication.spouses = AccountChangeSpousesTypeFactory.make();

    /** the account change option check is added so that only data belonging to current selection is sent..
     *  this avoids uncleared data being sent
     *  so only if PI or Update status is selected ; send updated spouse and children
     *  send add/remove only if depdent option is selected
     *
     *  The same login shhould in be in review screen as well
     */
    if ((from.accountChangeOptions.statusUpdate || from.accountChangeOptions.personInfoUpdate) && from.updatedSpouse) {
        to.application.accountChangeApplication.spouses.updatedSpouse = this.convertSpouseFromAccountChange(from.updatedSpouse);

    }
    if (from.accountChangeOptions.dependentChange && from.removedSpouse) {
        to.application.accountChangeApplication.spouses.removedSpouse = this.convertSpouseFromAccountChange(from.removedSpouse);
    }
    if (from.accountChangeOptions.dependentChange && from.addedSpouse) {
        to.application.accountChangeApplication.spouses.addedSpouse = this.convertSpouseFromAccountChange(from.addedSpouse);
    }

    // Convert children and dependants
    if (from.getAllChildren() && from.getAllChildren().length > 0) {
        to.application.accountChangeApplication.children = AccountChangeChildrenFactory.make();
        to.application.accountChangeApplication.children.child = new Array<AccountChangeChildType>();
        for (const child of from.getAllChildren()) {
            if (child && child.firstName && child.lastName && child.gender) {
                to.application.accountChangeApplication.children.child.push(this.convertChildFromAccountChange(child));
            }
        }

    }

    if (from.getAllImages() && from.getAllImages().length > 0){
        to.application.attachments = this.convertAttachments(from.getAllImages());
    }

    return to;
}

private convertSpouseFromAccountChange(from: MspPerson): AccountChangeSpouseType {
  const to = AccountChangeSpouseTypeFactory.make();
  to.name = this.convertName(from);

  if (from.hasDob) {
      to.birthDate = format( from.dob, this.ISO8601DateFormat);
  }
  if (from.gender != null) {
      to.gender = <GenderType> from.gender.toString();
  }

  if (from.previous_phn) {
      to.phn = Number(from.previous_phn.replace(new RegExp('[^0-9]', 'g'), ''));
  }


  //TODO //FIXME once data model is implemented , verify this..Also might need another convertResidency for DEAM
  if (from.status != null) {
      to.citizenship = this.findCitizenShip(from.status, from.currentActivity);

  }

  if (from.prevLastName) {
      to.previousLastName = from.prevLastName;
  }

  if (from.marriageDate) {
      to.marriageDate = format( from.marriageDate, this.ISO8601DateFormat );
  }
  if (from.isExistingBeneficiary != null) {
      to.isExistingBeneficiary = from.isExistingBeneficiary === true ? 'Y' : 'N';
  }

  if (from.isExistingBeneficiary === false) {
      this.populateNewBeneficiaryDetailsForSpouse(from, to);
  }


  // Removing Spouse

  if (from.reasonForCancellation && from.reasonForCancellation !== 'pleaseSelect' ) {
      to.cancellationReason = from.reasonForCancellation;
      if (from.cancellationDate) {
      to.cancellationDate = format( from.cancellationDate, this.ISO8601DateFormat);
      }
  }
  if (from.knownMailingAddress === true ) {
      to.mailingAddress = this.convertAddress(from.mailingAddress);
  } else if (from.knownMailingAddress === false) {
      to.mailingAddress = this.unknownAddress();
  }

  return to;

}

private unknownAddress(): AddressType {
  const to = AddressTypeFactory.make();
  to.addressLine1 = 'UNKNOWN';
  to.addressLine2 = '';
  to.addressLine3 = '';
  to.city = '';
  to.provinceOrState = '';
  to.postalCode = '';

  return to;
}

private convertAddress(from: Address): AddressType {
  // Instantiate new object from interface
  const to = AddressTypeFactory.make();

  /*
   addressLine1: string;
   addressLine2?: string;
   addressLine3?: string;
   city?: string;
   country?: string;
   postalCode?: string;
   provinceOrState?: string;
   */

  to.addressLine1 = from.addressLine1;
  to.addressLine2 = from.addressLine2;
  to.addressLine3 = from.addressLine3;
  to.city = from.city;
  to.country = from.country;
  if (from.postal) {
      to.postalCode = from.postal.toUpperCase().replace(' ', '');
  }
  to.provinceOrState = from.province;

  return to;
}

private convertChildFromAccountChange(from: MspPerson): AccountChangeChildType {
  const to = AccountChangeChildTypeFactory.make();

  to.operationAction = <OperationActionType> OperationActionTypeEnum[from.operationActionType];

  to.name = this.convertName(from);
  if (from.hasDob) {
      to.birthDate = format( from.dob, this.ISO8601DateFormat);
  }
  if (from.gender != null) {
      to.gender = <GenderType> from.gender.toString();
  }

  if (from.previous_phn) {
      to.phn = Number(from.previous_phn.replace(new RegExp('[^0-9]', 'g'), ''));
  }

  //TODO //FIXME once data model is implemented , verify this..Also might need another convertResidency for DEAM
  if (from.status != null) {
      to.citizenship = this.findCitizenShip(from.status, from.currentActivity);

  }
  if (from.isExistingBeneficiary != null) {
      to.isExistingBeneficiary = from.isExistingBeneficiary === true ? 'Y' : 'N';
  }
  // only for new beneficiaries ; these fields are used
  if (from.isExistingBeneficiary === false) {
      this.populateNewBeneficiaryDetailsForChild(from, to);
  }
  // Child 19-24
  if (from.relationship === Relationship.Child19To24) {
      if (from.schoolName) {
          to.schoolName = from.schoolName;
      }


      if (from.hasStudiesDeparture) {
          to.departDateSchoolOutside =  format( from.studiesDepartureDate, this.ISO8601DateFormat);
      }

      if (from.hasStudiesFinished) {
          to.dateStudiesFinish = format( from.studiesFinishedDate, this.ISO8601DateFormat);
      }

      if (from.hasStudiesBegin) {
          to.dateStudiesBegin = format( from.studiesBeginDate, this.ISO8601DateFormat);
      }

      //  Departure date if school is outszide BC //TODO
      /*   to.departDateSchoolOutside = from.departDateSchoolOutside.format(this.ISO8601DateFormat);*/

      // Assemble address string
      to.schoolAddress = this.convertAddress(from.schoolAddress);

  }


  if (from.reasonForCancellation && from.reasonForCancellation !== 'pleaseSelect') {
      to.cancellationReason = from.reasonForCancellation;
      if (from.cancellationDate) {
          to.cancellationDate = format( from.cancellationDate, this.ISO8601DateFormat);
      }
  }

  if (from.knownMailingAddress === true ) {
      to.mailingAddress = this.convertAddress(from.mailingAddress);
  } else if (from.knownMailingAddress === false) {
      to.mailingAddress = this.unknownAddress();
  }

  return to;
}

/**
     * Creates the array of attachments from applicant, spouse and all children
     * used with both assistance and DEAM
     * @param {CommonImage[]} from
     * @returns {AttachmentsType}
     */
    private convertAttachments(from: CommonImage[]): AttachmentsType {

      const to = AttachmentsTypeFactory.make();
      to.attachment = new Array<AttachmentType>();

      // assemble all attachments
      const attachments: CommonImage[] = from;

      // If no attachments just return
      if (!attachments || attachments.length < 1) {
          // console.log("no attachments");
          return null;
      }

      // Convert each one
      for (const attachment of attachments) {
          if (attachment && attachment.uuid) {
              // Init new attachment with defaults
              const toAttachment = AttachmentTypeFactory.make();
              toAttachment.attachmentDocumentType = MspApiService.AttachmentDocumentType;

              // Content type
              switch (attachment.contentType) {
                  case 'image/jpeg':
                      toAttachment.contentType = 'image/jpeg';
                      break;
                  case 'application/pdf':
                      toAttachment.contentType = 'application/pdf';
                      break;
                  default:
                  //TODO: throw error on bad content type
              }

              // uuid
              toAttachment.attachmentUuid = attachment.uuid;
              toAttachment.attachmentOrder = String(attachment.attachmentOrder);
              // user does NOT provide description so it's left blank for now, may be used in future

              // Add to array
              to.attachment.push(toAttachment);
          }
      }

      return to;
  }

  private prepareAccountApplication(
    from: MspAccountApp
  ): MSPApplicationSchema {
    const object = {
      accountChangeApplication: this.convertSampleResponse(),
      attachments: this.convertToAttachment(from.getAllImages()),
      uuid: from.uuid
    };
    return object;
  }

  /*
    common method for spouse and child
     */
    private populateNewBeneficiaryDetailsForChild(from: MspPerson, to: AccountChangeChildType) {
      //Has person lived in B.C. since birth?
      if (from.livedInBCSinceBirth != null) {
          to.livedInBC = LivedInBCTypeFactory.make();
          if (from.livedInBCSinceBirth === true) {
              to.livedInBC.hasLivedInBC = 'Y';
          }
          else {
              to.livedInBC.hasLivedInBC = 'N';
          }

          if (from.livedInBCSinceBirth === false) {

              to.livedInBC.isPermanentMove = from.madePermanentMoveToBC === true ? 'Y' : 'N';
              if (from.healthNumberFromOtherProvince) {
                  to.livedInBC.prevHealthNumber = from.healthNumberFromOtherProvince; // out of province health numbers
              }

              if (from.movedFromProvinceOrCountry) {
                  to.livedInBC.prevProvinceOrCountry = from.movedFromProvinceOrCountry;
              }

              // Arrival dates
              if (from.hasArrivalToBC) {
                  to.livedInBC.recentBCMoveDate = format( from.arrivalToBCDate, this.ISO8601DateFormat);
              }
          }

      }
      //Is this child newly adopted?
      if (from.newlyAdopted) {
          to.adoptionDate = format(from.adoptedDate, this.ISO8601DateFormat);
      }


      // Has this family member been outside of BC for more than a total of 30 days during the past 12 months?
      if (from.declarationForOutsideOver30Days != null) {
          to.outsideBC = OutsideBCTypeFactory.make();
          to.outsideBC.beenOutsideBCMoreThan = from.declarationForOutsideOver30Days === true ? 'Y' : 'N';
          if (from.declarationForOutsideOver30Days) {
              if (from.outOfBCRecord.hasDeparture) {
                  to.outsideBC.departureDate = format( from.outOfBCRecord.departureDate, this.ISO8601DateFormat);
              }
              if (from.outOfBCRecord.hasReturn) {
                  to.outsideBC.returnDate = format(from.outOfBCRecord.returnDate, this.ISO8601DateFormat);
              }
              to.outsideBC.familyMemberReason = from.outOfBCRecord.reason;
              to.outsideBC.destination = from.outOfBCRecord.location;
          }
      }

      //  Will this family member be outside of BC for more than a total of 30 days during the next 6 months?

      if (from.plannedAbsence != null) {
          to.outsideBCinFuture = OutsideBCTypeFactory.make();
          to.outsideBCinFuture.beenOutsideBCMoreThan = from.plannedAbsence === true ? 'Y' : 'N';
          if (from.plannedAbsence) {
              if (from.planOnBeingOutOfBCRecord.hasDeparture) {
                  to.outsideBCinFuture.departureDate = format( from.planOnBeingOutOfBCRecord.departureDate, this.ISO8601DateFormat);
              }
              if (from.planOnBeingOutOfBCRecord.hasReturn) {
                  to.outsideBCinFuture.returnDate = format(from.planOnBeingOutOfBCRecord.returnDate, this.ISO8601DateFormat);
              }
              to.outsideBCinFuture.familyMemberReason = from.planOnBeingOutOfBCRecord.reason;
              to.outsideBCinFuture.destination = from.planOnBeingOutOfBCRecord.location;
          }
      }


      // Have they been released from the Canadian Armed Forces or an Institution?
      if (from.hasDischarge) {
          to.willBeAway = WillBeAwayTypeFactory.make();
          to.willBeAway.armedDischargeDate = format(from.dischargeDate, this.ISO8601DateFormat);
          to.willBeAway.armedForceInstitutionName = from.nameOfInstitute;
          to.willBeAway.isFullTimeStudent = 'N';
      }
  }

  private populateNewBeneficiaryDetailsForSpouse(from: MspPerson, to: AccountChangeSpouseType) {
    //Has person lived in B.C. since birth?
    if (from.livedInBCSinceBirth != null) {
        to.livedInBC = LivedInBCTypeFactory.make();
        if (from.livedInBCSinceBirth === true) {
            to.livedInBC.hasLivedInBC = 'Y';
        }
        else {
            to.livedInBC.hasLivedInBC = 'N';
        }

        if (from.livedInBCSinceBirth === false) {

            to.livedInBC.isPermanentMove = from.madePermanentMoveToBC === true ? 'Y' : 'N';
            if (from.healthNumberFromOtherProvince) {
                to.livedInBC.prevHealthNumber = from.healthNumberFromOtherProvince; // out of province health numbers
            }

            if (from.movedFromProvinceOrCountry) {
                to.livedInBC.prevProvinceOrCountry = from.movedFromProvinceOrCountry;
            }

            // Arrival dates
            if (from.hasArrivalToBC) {
                to.livedInBC.recentBCMoveDate = format( from.arrivalToBCDate, this.ISO8601DateFormat);
            }
        }

    }


    // Has this family member been outside of BC for more than a total of 30 days during the past 12 months?
    if (from.declarationForOutsideOver30Days != null) {
        to.outsideBC = OutsideBCTypeFactory.make();
        to.outsideBC.beenOutsideBCMoreThan = from.declarationForOutsideOver30Days === true ? 'Y' : 'N';
        if (from.declarationForOutsideOver30Days) {
            if (from.outOfBCRecord.hasDeparture) {
                to.outsideBC.departureDate = format( from.outOfBCRecord.departureDate, this.ISO8601DateFormat);
            }
            if (from.outOfBCRecord.hasReturn) {
                to.outsideBC.returnDate = format( from.outOfBCRecord.returnDate, this.ISO8601DateFormat);
            }
            to.outsideBC.familyMemberReason = from.outOfBCRecord.reason;
            to.outsideBC.destination = from.outOfBCRecord.location;
        }
    }

    //  Will this family member be outside of BC for more than a total of 30 days during the next 6 months?

    if (from.plannedAbsence != null) {
        to.outsideBCinFuture = OutsideBCTypeFactory.make();
        to.outsideBCinFuture.beenOutsideBCMoreThan = from.plannedAbsence === true ? 'Y' : 'N';
        if (from.plannedAbsence) {
            if (from.planOnBeingOutOfBCRecord.hasDeparture) {
                to.outsideBCinFuture.departureDate = format(from.planOnBeingOutOfBCRecord.departureDate, this.ISO8601DateFormat);
            }
            if (from.planOnBeingOutOfBCRecord.hasReturn) {
                to.outsideBCinFuture.returnDate = format(from.planOnBeingOutOfBCRecord.returnDate, this.ISO8601DateFormat);
            }
            to.outsideBCinFuture.familyMemberReason = from.planOnBeingOutOfBCRecord.reason;
            to.outsideBCinFuture.destination = from.planOnBeingOutOfBCRecord.location;
        }
    }


    // Have they been released from the Canadian Armed Forces or an Institution?
    if (from.hasDischarge) {
        to.willBeAway = WillBeAwayTypeFactory.make();
        to.willBeAway.armedDischargeDate = format(from.dischargeDate, this.ISO8601DateFormat);
        to.willBeAway.armedForceInstitutionName = from.nameOfInstitute;
        to.willBeAway.isFullTimeStudent = 'N';
    }
}

  private convertToAttachment(images: CommonImage[]): AttachmentRequestPartial[] {
    const output = [];
    images.map((image, i) => {
      const partial: AttachmentRequestPartial = {
        contentType: 'IMAGE_JPEG',
        attachmentDocumentType: MspApiAccountService.AttachmentDocumentType,
        attachmentOrder: (i + 1).toString(),
        description: '',
        // TODO - Sure this is the correct UUID here?
        attachmentUuid: image.uuid
      };
      output.push(partial);
    });

    return output;
  }

  private convertName(from: MspPerson): NameType {
    const to = NameTypeFactory.make();

    /*
     firstName: string;
     lastName: string;
     secondName?: string;
     */
    to.firstName = from.firstName;
    to.secondName = from.middleName;
    to.lastName = from.lastName;

    return to;
  }


  findCitizenShip(statusInCanada: StatusInCanada, currentActivity: CanadianStatusReason): CitizenshipType {
      let citizen: CitizenshipType;
      switch (statusInCanada) {
          case StatusInCanada.CitizenAdult:
              citizen = 'CanadianCitizen';
              break;
          case StatusInCanada.PermanentResident:
              citizen = 'PermanentResident';
              break;
          case StatusInCanada.TemporaryResident:
              switch (currentActivity) {
                  case CanadianStatusReason.WorkingInBC:
                      citizen = 'WorkPermit';
                      break;
                  case CanadianStatusReason.StudyingInBC:
                      citizen = 'StudyPermit';
                      break;
                  case CanadianStatusReason.Diplomat:
                      citizen = 'Diplomat';
                      break;
                  case CanadianStatusReason.ReligiousWorker:
                      citizen = 'ReligiousWorker';
                      break;
                  case CanadianStatusReason.Visiting:
                  default:
                      citizen = 'VisitorPermit';
                      break;
              }
      }
      return citizen;
  }

  private convertAccountHolderFromAccountChange(from: MspAccountApp): AccountChangeAccountHolderType {

        const accountHolder: AccountChangeAccountHolderType = AccountChangeAccountHolderFactory.make();

        accountHolder.selectedAddRemove = from.accountChangeOptions.dependentChange ? 'Y' : 'N';

        accountHolder.selectedAddressChange = from.accountChangeOptions.addressUpdate ? 'Y' : 'N';
        accountHolder.selectedPersonalInfoChange = from.accountChangeOptions.personInfoUpdate ? 'Y' : 'N';
        accountHolder.selectedStatusChange = from.accountChangeOptions.statusUpdate ? 'Y' : 'N';

        accountHolder.name = this.convertName(from.applicant);


        if (from.applicant.hasDob) {
            accountHolder.birthDate = format(from.applicant.dob, this.ISO8601DateFormat);
        }
        if (from.applicant.gender != null) {
            accountHolder.gender = <GenderType>{};
            accountHolder.gender = <GenderType> from.applicant.gender.toString();
        }
        if (from.authorizedByApplicant != null) {
            accountHolder.authorizedByApplicant = from.authorizedByApplicant ? 'Y' : 'N';
            accountHolder.authorizedByApplicantDate = moment(from.authorizedByApplicantDate)
                .format(this.ISO8601DateFormat);
        }

        if (from.authorizedBySpouse != null) {
            accountHolder.authorizedBySpouse = from.authorizedBySpouse ? 'Y' : 'N';
        }

        if (!from.applicant.mailingSameAsResidentialAddress) {
            accountHolder.mailingAddress = this.convertAddress(from.applicant.mailingAddress);
        }

        if (from.applicant.residentialAddress && from.applicant.residentialAddress.isValid) {
            accountHolder.residenceAddress = this.convertAddress(from.applicant.residentialAddress);
        } else {
            accountHolder.residenceAddress = this.unknownAddress();
        }

        if (from.applicant.phoneNumber) {
            accountHolder.telephone = Number(from.applicant.phoneNumber.replace(new RegExp('[^0-9]', 'g'), ''));
        }
        if (from.applicant.previous_phn) {
            accountHolder.phn = Number(from.applicant.previous_phn.replace(new RegExp('[^0-9]', 'g'), ''));
        }

        if (from.applicant.status != null) {
            accountHolder.citizenship = this.findCitizenShip(from.applicant.status, from.applicant.currentActivity);

        }


        return accountHolder;

    }

}




// TODO - Move file - meant to be generic?
interface AttachmentRequestPartial {
  contentType: 'IMAGE_JPEG';
  // attachmentDocumentType: string; // TODO lock down
  attachmentDocumentType: 'SupportDocument';
  attachmentOrder: string; // String of number! '1', '2', '3'
  description: string;
  attachmentUuid: string;
}

// interface

/*
// Remove? Make use of applicationTypes.ts?
// TODO - Replace the "Y/N" ones with a new type
class BenefitApplicationRequest {
    supplementaryBenefitsApplication: {
        'applicantFirstName': string
        'applicantLastName': string
        'applicantBirthdate': string
        'applicantPHN': string
        'applicantSIN': string
        'applicantAddressLine1': string
        'applicantCity': string
        'applicantProvinceOrState': string
        'applicantCountry': string
        'applicantPostalCode': string
        'applicantTelephone': string
        'authorizedByApplicant': string
        'authorizedByApplicantDate': string //'09-10-2018',
        'powerOfAttorney': string,
        'assistanceYear': string
        'taxYear': string
        'numberOfTaxYears': number
        'adjustedNetIncome': number
        'childDeduction': number
        'deductions': number
        'disabilityDeduction': number
        'sixtyFiveDeduction': number
        'totalDeductions': number
        'totalNetIncome': number
        'childCareExpense': number
        'netIncomeLastYear': number
        'numChildren': number
        'numDisabled': number
        'spouseIncomeLine236': number
        'reportedUCCBenefit': number
        'spouseDSPAmount': number
        'spouseDeduction': number
      };
      //   TODO - make  everything below this generic for all requests

      'uuid': string;
      attachments: AttachmentType[]

    //   'attachments': [ {
    //     'contentType': 'IMAGE_JPEG',
    //     'attachmentDocumentType': 'ImmigrationDocuments',
    //     'attachmentUuid': '4345678-f89c-52d3-a456-626655441236',
    //     'attachmentOrder': '1',
    //     'description': 'Foreign Birth Certificate'
    //   } ]
} */
