import { Injectable } from '@angular/core';
import { MspLogService } from '../../../services/log.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { MspApplication } from '../../../modules/enrolment/models/application.model';
import { _ApplicationTypeNameSpace } from '../../../modules/msp-core/api-model/applicationTypes';
import { environment } from '../../../../environments/environment';
import { AbstractHttpService, CommonImage, Address, SimpleDate } from 'moh-common-lib';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Response } from '@angular/http';
import { MspApiService } from '../../../services/msp-api.service';
import { ApiResponse } from '../../../models/api-response.interface';
import {
 MSPApplicationSchema, EnrolmentApplicationType, AddressType, ResidencyType, CitizenshipType, PersonType, DependentType, NameType, EnrolmentApplicantType
} from '../../../modules/msp-core/interfaces/i-api';
import * as moment from 'moment';
import { MspPerson } from '../../../components/msp/model/msp-person.model';
import { StatusInCanada, CanadianStatusReason } from '../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../msp-core/models/relationship.enum';
import { SchemaService } from '../../../services/schema.service';


// TODO - Move file - meant to be generic?
interface AttachmentRequestPartial {
  contentType: 'IMAGE_JPEG';
  // attachmentDocumentType: string; // TODO lock down
  attachmentDocumentType: 'SupportDocument';
  attachmentOrder: string; // String of number! '1', '2', '3'
  description: string;
  attachmentUuid: string;
}


@Injectable({
  providedIn: 'root'
})
export class MspApiEnrolmentService extends AbstractHttpService {

  protected _headers: HttpHeaders = new HttpHeaders();
  readonly ISO8601DateFormat = 'YYYY-MM-DD';
  suppBenefitResponse: ApiResponse;


  constructor(
    protected http: HttpClient,
    private logService: MspLogService,
    private schemaSvc: SchemaService
  ) {
    super(http);
  }

  /**
   * User does NOT specify document type therefore we always say its a supporting document
   * @type {string}
   */
  static readonly AttachmentDocumentType = 'SupportDocument';
  static readonly ApplicationType = 'benefitApplication';

  sendRequest(app: MspApplication): Promise<any> {
    console.log(app.uuid);
    const enrolmentRequest = this.prepareEnrolmentApplication(app);
    console.log(enrolmentRequest);

    return new Promise<ApiResponse>((resolve, reject) => {

      //Validating the response against the schema
      this.schemaSvc.validate(enrolmentRequest).then(res => {
        console.log(res.errors);
        if (res.errors) {
          let errorField;
          let errorMessage;

          // Getting the error field
          for (const err of res.errors) {
            errorField = err.dataPath.substr(34);
            errorMessage = err.message;
          }
          // checking the errors and routing to the correct URL
          if (errorField && errorMessage) {
            this.logService.log(
              {
                text:
                  'Enrolment Application  - API validation against schema failed becuase of ' +
                  errorField +
                  ' field',
                response: errorMessage
              },
              'Enrolment Application -  API validation against schema failed'
            );

            //const mapper = new FieldPageMap();
            //const index = mapper.findStep(errorField);
            //const urls = this.dataSvc.getMspProcess().processSteps;
            //this.router.navigate([urls[index].route]);
            return reject(errorMessage);
          }
        }
      });

      // if no errors, then we'll sendApplication all attachments
      return this.sendAttachments(
        app.authorizationToken,
        app.uuid,
        app.getAllImages()
      )
      .then(attachmentResponse => {
      console.log('sendAttachments response', attachmentResponse);

      return this.sendEnrolmentApplication(
        enrolmentRequest,
        app.authorizationToken
      ).subscribe(response => {
        // Add reference number
        if (response && response.referenceNumber) {
        app.referenceNumber = response.referenceNumber.toString();
        }
        // Let our caller know were done passing back the application
        return resolve(response);
      });
      })
      .catch((err: Response | any) => {
      // TODO - Is this error correct? What if sendApplication() errors, would it be caught in this .catch()?
      console.log('sent all attachments rejected: ', err);
      this.logService.log(
        {
        text: 'Attachment - Send All Rejected ',
        response: err
        },
        'Attachment - Send All Rejected '
      );
      return resolve(err);
      });

    });
  }

  sendEnrolmentApplication(app: MSPApplicationSchema, authToken: string): Observable<any> {
    const _url = environment.appConstants['apiBaseUrl'] + '/submit-application/' + app.uuid;
    // Setup headers
    this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Response-Type': 'application/json',
      'X-Authorization': 'Bearer ' + authToken
    });
    return this.post<MspApplication>(_url, app);
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
          (_error: Response | any) => {
            this.logService.log(
              {
                text: 'Attachments - Send Error ',
                error: _error
              },
              'Attachments - Send Error '
            );
            console.log('error sending attachment: ', _error);
            return reject();
          }
        )
        .catch((_error: Response | any) => {
          this.logService.log(
            {
              text: 'Attachments - Send Error ',
              error: _error
            },
            'Attachments - Send Error '
          );
          console.log('error sending attachment: ', _error);
          return _error;
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
      let _url =
        environment.appConstants['apiBaseUrl'] +
        environment.appConstants['attachment'] +
        applicationUUID +
        '/attachments/' +
        attachment.uuid;

      // programArea
      _url += '?programArea=enrolment';

      // attachmentDocumentType - UI does NOT collect this property
      _url += '&attachmentDocumentType=' + MspApiService.AttachmentDocumentType;

      // contentType
      _url += '&contentType=' + attachment.contentType;

      // imageSize
      _url += '&imageSize=' + attachment.size;

      // Necessary to differentiate between PA and SuppBen
      // TODO - VALIDATE THIS VALUE IS CORRECT, NEEDS TO BE CONFIRMED
      _url += '&dpackage=msp_sb_pkg';

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
        .post(_url, blob, options)
        .toPromise()
        .then(
          response => {
            // this.logService.log({
            //     text: "Send Individual Attachment - Success",
            //     response: response,
            // }, "Send Individual Attachment - Success")
            return resolve(response);
          },
          (_error: Response | any) => {
            console.log('error response in its origin form: ', _error);
            this.logService.log(
              {
                text: 'Attachment - Send Error ',
                response: _error
              },
              'Attachment - Send Error '
            );
            return reject(_error);
          }
        )
        .catch((_error: Response | any) => {
          console.log('Error in sending individual attachment: ', _error);
          this.logService.log(
            {
              text: 'Attachment - Send Error ',
              response: _error
            },
            'Attachment - Send Error '
          );

          reject(_error);
        });
    });
  }

  protected handleError(_error: HttpErrorResponse) {
    // console.log("handleError", JSON.stringify(error));
    if (_error.error instanceof ErrorEvent) {
      //Client-side / network error occured
      console.error('MSP Enrolment API error: ', _error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Msp Enrolment Backend returned error code: ${
          _error.status
        }.  Error body: ${_error.error}`
      );
    }

    this.logService.log(
      {
        text: 'Cannot get Suppbenefit API response',
        response: _error
      },
      'Cannot get Suppbenefit API response'
    );

    // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
    return of(_error);
    // return of([]);
  }


  private prepareEnrolmentApplication(from: MspApplication): MSPApplicationSchema {
    const object = {
      enrolmentApplication: this.convertMspApplication(from),
      attachments: this.convertToAttachment(from.getAllImages()),
      uuid: from.uuid
    };
    return object;
  }

  private convertToAttachment(images: CommonImage[]): AttachmentRequestPartial[] {
    const output = [];
    images.map((image, i) => {
      const partial: AttachmentRequestPartial = {
        contentType: 'IMAGE_JPEG',
        attachmentDocumentType: MspApiEnrolmentService.AttachmentDocumentType,
        attachmentOrder: (i + 1).toString(),
        description: '',
        // TODO - Sure this is the correct UUID here?
        attachmentUuid: image.uuid
      };
      output.push(partial);
    });

    return output;
  }

  private getAttachementUuids( suppDocs: CommonImage[], nameChangeDocs: CommonImage[] ): string[] {
    const suppDocUuids = suppDocs && suppDocs.length > 0 ?
                          suppDocs.map( x => x.uuid ) : [];
    const nameChangeDocUuids = nameChangeDocs && nameChangeDocs.length > 0 ?
                                nameChangeDocs.map( x => x.uuid ) : [];
    return [...suppDocUuids, ...nameChangeDocUuids];
  }

  private convertSimpleDate( dt: SimpleDate ): string {
    console.log( 'convertSimpleDate: ', dt );

    const dtFields = Object.keys(dt).filter( x => dt[x] );
    console.log( 'convertSimpleDate: dtFields ', dtFields );

    if ( dtFields.length === 3 ) {
        const date = moment.utc({
          year: dt.year,
          month: dt.month - 1, // moment use 0 index for month :(
          day: dt.day,
      }); // use UTC mode to prevent browser timezone shifting
      return  String(date.format(this.ISO8601DateFormat));
    }
    return '';
  }

  private convertResidency( from: MspPerson ): ResidencyType {

    let citizenType;
    // citizenship
    switch (from.status) {
      case StatusInCanada.CitizenAdult:
        citizenType = CitizenshipType.CanadianCitizen;
        break;
      case StatusInCanada.PermanentResident:
        citizenType = CitizenshipType.PermanentResident;
      break;
      case StatusInCanada.TemporaryResident:
        switch (from.currentActivity) {
          case CanadianStatusReason.WorkingInBC:
            citizenType = CitizenshipType.WorkPermit;
          break;
        case CanadianStatusReason.StudyingInBC:
          citizenType = CitizenshipType.StudyPermit;
          break;
        case CanadianStatusReason.Diplomat:
          citizenType = CitizenshipType.Diplomat;
          break;
        case CanadianStatusReason.ReligiousWorker:
          citizenType = CitizenshipType.ReligiousWorker;
          break;
        case CanadianStatusReason.Visiting:
        default:
          citizenType = CitizenshipType.VisitorPermit;
          break;
      }
    }

    const attachmentUuids = new Array<string>();
    for (const image of from.documents.images) {
        attachmentUuids.push(image.uuid);
    }

    const to: ResidencyType = {
      citizenshipStatus: {
        citizenshipType: citizenType,
        attachmentUuids: attachmentUuids
      },
      livedInBC: {
        hasLivedInBC: from.livedInBCSinceBirth === true ? 'Y' : 'N',
      },
      outsideBC: {
        beenOutsideBCMoreThan: from.beenOutSideOver30Days ? 'Y' : 'N'
      },
      previousCoverage: {
        hasPreviousCoverage: from.hasPreviousBCPhn ? 'Y' : 'N'
      },
      willBeAway: {
        isFullTimeStudent: from.fullTimeStudent ? 'Y' : 'N'
      }
    };

   // outsideBCinFuture?: OutsideBCType;  - Not sure this is used

    if ( from.madePermanentMoveToBC !== undefined  ) {
      to.livedInBC.isPermanentMove = from.madePermanentMoveToBC === true ? 'Y' : 'N';
    }

    if ( from.hasPreviousBCPhn ) {
      to.livedInBC.prevHealthNumber = from.previous_phn;
    }

    if (from.movedFromProvinceOrCountry) {
        to.livedInBC.prevProvinceOrCountry = from.movedFromProvinceOrCountry;
    }

    // Arrival dates
    if (from.hasArrivalToBC) {
        to.livedInBC.recentBCMoveDate = from.arrivalToBC.format(this.ISO8601DateFormat);
    }
    if (from.hasArrivalToCanada) {
        to.livedInBC.recentCanadaMoveDate = from.arrivalToCanada.format(this.ISO8601DateFormat);
    }

    // Outside BC - optional fields
    if (from.beenOutSideOver30Days) {
      to.outsideBC.departureDate = this.convertSimpleDate(from.departureDate);
      to.outsideBC.returnDate = this.convertSimpleDate(from.returnDate);
      to.outsideBC.familyMemeberReason = from.departureReason;
      to.outsideBC.destination = from.departureDestination;
    }

    if (from.inBCafterStudies !== undefined ) {
      to.willBeAway.isInBCafterStudies = from.inBCafterStudies ? 'Y' : 'N';
    }

    if (from.hasDischarge) {
      to.willBeAway.armedDischargeDate = from.dischargeDate.format(this.ISO8601DateFormat);
    }

    if (from.hasPreviousBCPhn && from.previous_phn) {
      to.previousCoverage.prevPHN = from.previous_phn.replace(new RegExp('[^0-9]', 'g'), '');
    }
    return to;
  }

  private convertAddress( from: Address ): AddressType {
    const addr: AddressType = {
      addressLine1: from.addressLine1,
      city: from.city,
      provinceOrState: from.province,
      country: from.country,
      postalCode: from.postal.toUpperCase().replace(' ', '')
    };

    if ( from.addressLine2 ) {
      addr.addressLine2 = from.addressLine2;
    }

    if ( from.addressLine3 ) {
      addr.addressLine3 = from.addressLine3;
    }
    return addr;
  }

  private convertDependentType( person: MspPerson ): DependentType {
    return {
      name: this.convertName( person ),
      gender: String( person.gender.valueOf() ),
      birthDate: String( person.dob.format( this.ISO8601DateFormat ) ),
      attachmentUuids: this.getAttachementUuids( person.documents.images, person.nameChangeDocs.images ),
      residency: this.convertResidency( person ),
      schoolName: person.schoolName,
      schoolAddress: this.convertAddress( person.schoolAddress ),
      dateStudiesFinish: this.convertSimpleDate( person.studiesFinishedSimple ),
      departDateSchoolOutside: this.convertSimpleDate( person.studiesDepartureSimple ),
    };
  }

  // This method is used to convert the response from user into a JSON object
  private convertMspApplication(from: MspApplication): EnrolmentApplicationType {
    const application: EnrolmentApplicationType = {
      applicant: this.convertEnrolmentApplicantType( from )
    };

    // Convert spouse
    if (from.spouse) {
      application.spouse = this.convertPersonType( from.spouse );
    }

    // Convert children and dependants
    if (from.children &&
        from.children.length > 0) {

      // Filter out children vs dependants
      const children = from.children.filter((child: MspPerson) => {
          return child.relationship === Relationship.ChildUnder19;
      });
      const dependants = from.children.filter((child: MspPerson) => {
          return child.relationship === Relationship.Child19To24;
      });

      // Children
      if (children.length > 0) {
        application.children = new Array<PersonType>();
        for (const child of children) {
          application.children.push( this.convertPersonType( child ) );
        }
      }

      // Dependants
      if (dependants.length > 0) {
        application.dependents = new Array<DependentType>();
        for (const dependant of dependants) {
          application.dependents.push( this.convertDependentType( dependant ) );
        }
      }
    }

    return application;
  }


  private convertName( person: MspPerson ): NameType {
    return {
      firstName: person.firstName,
      lastName: person.lastName,
      secondName: person.middleName
    };
  }

  private convertPersonType( person: MspPerson ): PersonType {
   return {
      name: this.convertName( person ),
      gender: String( person.gender.valueOf() ),
      birthDate: String( person.dob.format( this.ISO8601DateFormat ) ),
      attachmentUuids: this.getAttachementUuids( person.documents.images, person.nameChangeDocs.images ),
      residency: this.convertResidency( person )
    };
  }

  private convertEnrolmentApplicantType( application: MspApplication): EnrolmentApplicantType {
    const applicant: MspPerson = application.applicant;
    console.log( 'applicant gender: ', applicant.gender );
    const enrolee: EnrolmentApplicantType =  {
      name: this.convertName( applicant ),
      gender: String( applicant.gender.valueOf() ),
      birthDate: String( applicant.dob.format( this.ISO8601DateFormat ) ),
      attachmentUuids: this.getAttachementUuids( applicant.documents.images, applicant.nameChangeDocs.images ),
      residency: this.convertResidency( applicant ),
      residenceAddress: this.convertAddress( application.residentialAddress ),
      authorizedByApplicant: application.authorizedByApplicant ? 'Y' : 'N',
      authorizedByApplicantDate: moment(application.authorizedByApplicantDate).format(this.ISO8601DateFormat),
      authorizedBySpouse: application.authorizedBySpouse ? 'Y' : 'N'
    };

    if (application.phoneNumber) {
      enrolee.telephone = application.phoneNumber.replace(/[() +/-]/g, '').substr(1);
    }

    if ( !application.mailingSameAsResidentialAddress ) {
      enrolee.mailingAddress = this.convertAddress( application.mailingAddress );
    }

    return enrolee;
  }
}
