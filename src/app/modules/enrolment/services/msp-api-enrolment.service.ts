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
 MSPApplicationSchema, EnrolmentApplicationType, AddressType, ResidencyType, CitizenshipType, PersonType, DependentType
} from '../../../modules/msp-core/interfaces/i-api';
import * as moment from 'moment';
import { MspPerson } from '../../../components/msp/model/msp-person.model';
import { StatusInCanada, CanadianStatusReason } from '../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../msp-core/models/relationship.enum';


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
    const suppBenefitRequest = this.prepareEnrolmentApplication(app);

    console.log(suppBenefitRequest);

    return new Promise<ApiResponse>((resolve) => {

      // if no errors, then we'll sendApplication all attachments
      return this.sendAttachments(
        app.authorizationToken,
        app.uuid,
        app.getAllImages()
      )
      .then(attachmentResponse => {
      console.log('sendAttachments response', attachmentResponse);

      return this.sendEnrolmentApplication(
        suppBenefitRequest,
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
  }

  sendEnrolmentApplication(app: MSPApplicationSchema, authToken: string): Observable<any> {
    const url = environment.appConstants['apiBaseUrl'] + '/submit-application/' + app.uuid;
    // Setup headers
    this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Response-Type': 'application/json',
      'X-Authorization': 'Bearer ' + authToken
    });
    return this.post<MspApplication>(url, app);
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
      url += '&dpackage=msp_sb_pkg';

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
      console.error('MSP Enrolment API error: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Msp Enrolment Backend returned error code: ${
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
    const date = moment.utc({
                      year: dt.year,
                      month: dt.month - 1, // moment use 0 index for month :(
                      day: dt.day,
                  }); // use UTC mode to prevent browser timezone shifting
   return  String(date.format(this.ISO8601DateFormat));
  }


  // TODO: need a service that can be extended with common methods
  private convertAddress( from: Address ): AddressType {

    const to: any = {};

    to.addressLine1 = from.addressLine1;
    if ( from.addressLine2 ) {
      to.addressLine2 = from.addressLine2;
    }

    if ( from.addressLine3 ) {
      to.addressLine3 = from.addressLine3;
    }

    to.city = from.city;
    to.provinceOrState = from.province;
    to.country = from.country;
    to.postalCode = from.postal.toUpperCase().replace(' ', '');
    return to;
  }

  // TODO: Make common
  private convertResidency(from: MspPerson): ResidencyType {
    const to: any = {};

    // citizenship
    switch (from.status) {
        case StatusInCanada.CitizenAdult:
            to.citizenshipStatus.citizenshipType = CitizenshipType.CanadianCitizen;
            break;
        case StatusInCanada.PermanentResident:
            to.citizenshipStatus.citizenshipType = CitizenshipType.PermanentResident;
            break;
        case StatusInCanada.TemporaryResident:
            switch (from.currentActivity) {
                case CanadianStatusReason.WorkingInBC:
                    to.citizenshipStatus.citizenshipType = CitizenshipType.WorkPermit;
                    break;
                case CanadianStatusReason.StudyingInBC:
                    to.citizenshipStatus.citizenshipType = CitizenshipType.StudyPermit;
                    break;
                case CanadianStatusReason.Diplomat:
                    to.citizenshipStatus.citizenshipType = CitizenshipType.Diplomat;
                    break;
                case CanadianStatusReason.ReligiousWorker:
                    to.citizenshipStatus.citizenshipType = CitizenshipType.ReligiousWorker;
                    break;
                case CanadianStatusReason.Visiting:
                default:
                    to.citizenshipStatus.citizenshipType = CitizenshipType.VisitorPermit;
                    break;
            }
    }
    to.citizenshipStatus.attachmentUuids = new Array<string>();
    for (const image of from.documents.images) {
        to.citizenshipStatus.attachmentUuids.push(image.uuid);
    }

    to.livedInBC.hasLivedInBC = from.livedInBCSinceBirth === true ? 'Y' : 'N';

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

    // Outside BC
    if (from.beenOutSideOver30Days) {
        to.outsideBC.beenOutsideBCMoreThan = 'Y';
        to.outsideBC.departureDate = this.convertSimpleDate(from.departureDate);
        to.outsideBC.returnDate = this.convertSimpleDate(from.returnDate);
        to.outsideBC.familyMemeberReason = from.departureReason;
        to.outsideBC.destination = from.departureDestination;
    }
    else {
        to.outsideBC.beenOutsideBCMoreThan = 'N';
    }

    if (from.fullTimeStudent) {
        to.willBeAway.isFullTimeStudent = 'Y';
    }
    else {
        to.willBeAway.isFullTimeStudent = 'N';
    }
    if (from.inBCafterStudies) {
        to.willBeAway.isInBCafterStudies = 'Y';
    }
    else {
        to.willBeAway.isInBCafterStudies = 'N';
    }

    if (from.hasDischarge) {
        to.willBeAway.armedDischargeDate = from.dischargeDate.format(this.ISO8601DateFormat);
    }

    to.previousCoverage.hasPreviousCoverage = 'N';  // default N
    if (from.hasPreviousBCPhn) {
        to.previousCoverage.hasPreviousCoverage = 'Y';

        if (from.previous_phn) {
            to.previousCoverage.prevPHN = from.previous_phn.replace(new RegExp('[^0-9]', 'g'), '');
        }
    }

    return to;
  }

  private convertPersonType( person: MspPerson ): PersonType {
    const to: any = {};
    to.name.firstName = person.firstName;
    to.name.middleName = person.middleName;
    to.name.lastName = person.lastName;

    to.gender = person.gender.valueOf();

    to.birthDate = String(person.dob.format(this.ISO8601DateFormat));
    to.attachmentUuid = this.getAttachementUuids( person.documents.images,
                                                  person.nameChangeDocs.images );
    to.residency = this.convertResidency(person);
    return to;
  }

  private convertDependentType( person: MspPerson ): DependentType {
    const to: any = {};
    to.name.firstName = person.firstName;
    to.name.middleName = person.middleName;
    to.name.lastName = person.lastName;

    to.gender = person.gender.valueOf();

    to.birthDate = String(person.dob.format(this.ISO8601DateFormat));
    to.attachmentUuid = this.getAttachementUuids( person.documents.images,
                                                  person.nameChangeDocs.images );
    to.residency = this.convertResidency(person);

    to.schoolName = person.schoolName;
    to.schoolAddress = this.convertAddress( person.schoolAddress );
    to.dateStudiesFinish = this.convertSimpleDate( person.studiesFinishedSimple );
    to.departDateSchoolOutside = this.convertSimpleDate( person.studiesDepartureSimple );

    return to;
  }

  // This method is used to convert the response from user into a JSON object
  private convertMspApplication(from: MspApplication): EnrolmentApplicationType {
    // Instantiate new object from interface
    const to: any = {};

    // UUID
    to.uuid = from.uuid;

    // Applicant section
    to.applicant.name.firstName = from.applicant.firstName;
    to.applicant.name.middleName = from.applicant.middleName;
    to.applicant.name.lastName = from.applicant.lastName;

    to.applicant.gender = from.applicant.gender.valueOf();

    to.applicant.birthDate = String(from.applicant.dob.format(this.ISO8601DateFormat));

    to.applicant.attachmentUuid = this.getAttachementUuids( from.applicant.documents.images,
                                                            from.applicant.nameChangeDocs.images );
    to.applicant.authorizedByApplicant = from.authorizedByApplicant ? 'Y' : 'N';
    to.applicant.authorizedByApplicantDate = moment(from.authorizedByApplicantDate).format(this.ISO8601DateFormat);

    to.applicant.authorizedBySpouse = from.authorizedBySpouse ? 'Y' : 'N';

    if (from.phoneNumber) {
      to.applicant.telephone = Number(from.phoneNumber.replace(new RegExp('[^0-9]', 'g'), ''));
    }

    to.applicant.residenceAddress = this.convertAddress(from.residentialAddress);

    if ( from.mailingAddress ) {
      to.applicant.mailingAddress = this.convertAddress(from.mailingAddress);
    }

    to.applicant.residency = this.convertResidency(from.applicant);

    // Convert spouse
    if (from.spouse) {
      to.spouse = this.convertPersonType( from.spouse );
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
        to.application.enrolmentApplication.children.child = new Array<PersonType>();
        for (const child of children) {
            to.application.enrolmentApplication.children.child.push(this.convertPersonType(child));
        }
      }

      // Dependants
      if (dependants.length > 0) {
        to.application.enrolmentApplication.dependents.dependent = new Array<DependentType>();
        for (const dependant of dependants) {
            to.application.enrolmentApplication.dependents.dependent.push(this.convertDependentType(dependant));
        }
      }
    }

    return to;
  }
}
