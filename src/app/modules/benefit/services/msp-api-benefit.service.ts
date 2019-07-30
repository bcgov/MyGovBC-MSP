import { Injectable } from '@angular/core';
import { MspLogService } from '../../../services/log.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { BenefitApplication } from '../models/benefit-application.model';
import {
  AttachmentType,
  _ApplicationTypeNameSpace
} from '../../enrolment/pages/api-model/applicationTypes';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { AbstractHttpService } from 'moh-common-lib';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { MspImage } from '../../../models/msp-image';
import { Response } from '@angular/http';
import { MspApiService } from '../../../services/msp-api.service';
import { SuppBenefitApiResponse } from '../models/suppBenefit-response.interface';
import { SchemaService } from 'app/services/schema.service';
import { Router } from '@angular/router';
import { MspBenefitDataService } from './msp-benefit-data.service';
import {
  SupplementaryBenefitsApplicationType,
  MSPApplicationSchema
} from 'app/modules/msp-core/interfaces/i-api';
import { FieldPageMap } from '../models/field-page-map';

@Injectable({
  providedIn: 'root'
})

//TODO - nothing has been done on these service except the skeleton.
// This service should handle the hitting of the middleware
export class MspApiBenefitService extends AbstractHttpService {
  protected _headers: HttpHeaders = new HttpHeaders();
  readonly ISO8601DateFormat = 'YYYY-MM-DD';
  suppBenefitResponse: SuppBenefitApiResponse;

  
  constructor(
    protected http: HttpClient,
    private logService: MspLogService,
    private schemaSvc: SchemaService,
    private router: Router,
    private dataSvc: MspBenefitDataService
  ) {
    super(http);
  }

  /**
   * User does NOT specify document type therefore we always say its a supporting document
   * @type {string}
   */
  static readonly AttachmentDocumentType = 'SupportDocument';
  static readonly ApplicationType = 'benefitApplication';

  sendRequest(app: BenefitApplication): Promise<any> {
    const suppBenefitRequest = this.prepareBenefitApplication(app);

    return new Promise<SuppBenefitApiResponse>((resolve, reject) => {
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
                  'Supplementary Benefit - API validation against schema failed becuase of ' +
                  errorField +
                  ' field',
                response: errorMessage
              },
              'Supplementary Benefit -  API validation against schema failed'
            );

            const mapper = new FieldPageMap();
            const index = mapper.findStep(errorField);
            const urls = this.dataSvc.getMspProcess().processSteps;
            this.router.navigate([urls[index].route]);
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
    return this.post<BenefitApplication>(url, app);
  }

  public sendAttachments(
    token: string,
    applicationUUID: string,
    attachments: MspImage[]
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
    attachment: MspImage
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

  // This method is used to convert the response from user into a JSON object
  private convertBenefitApplication(
    from: BenefitApplication
  ): SupplementaryBenefitsApplicationType {
    const to: any = {};

    // Capturing Personal Info page response
    to.applicantFirstName = from.applicant.firstName;
    to.applicantSecondName = from.applicant.middleName;
    to.applicantLastName = from.applicant.lastName;
    if (from.applicant.hasDob) {
      /* Below date can be used if ISO8601DateFormat is outdated or doesn't work
            let day = from.applicant.dobSimple.day < 10 ? `0${from.applicant.dobSimple.day}` : from.applicant.dobSimple.day;
            let birthMonth = from.applicant.dobSimple.month < 10
                                ? `0${from.applicant.dobSimple.month.toString()}`
                                : from.applicant.dobSimple.month.toString();


            const birthDate = `${birthMonth}-${day}-${from.applicant.dobSimple.year.toString()}`;*/
      to.applicantBirthdate = String(
        from.applicant.dob.format(this.ISO8601DateFormat)
      );
    }
    to.applicantPHN = from.applicant.previous_phn
      ? from.applicant.previous_phn.replace(new RegExp('[^0-9]', 'g'), '')
      : '';
    to.applicantSIN = from.applicant.sin
      ? from.applicant.sin.replace(new RegExp('[^0-9]', 'g'), '')
      : '';

    /* Capturing Spouse Info page response */
    if (from.hasSpouseOrCommonLaw) {
      to.spouseFirstName = from.spouse.firstName;
      to.spouseSecondName = from.spouse.middleName;
      to.spouseLastName = from.spouse.lastName;
      if (from.spouse.hasDob) {
        /* Below date can be used if ISO8601DateFormat is outdated or doesn't work
                let spouseBirthMonth = from.spouse.dobSimple.month < 10
                                ? `0${from.spouse.dobSimple.month.toString()}`
                                : from.spouse.dobSimple.month.toString();

                const spouseBirthDate = `${spouseBirthMonth}-${from.spouse.dobSimple.day.toString()}-${from.spouse.dobSimple.year.toString()}`;*/
        to.spouseBirthdate = String(
          from.spouse.dob.format(this.ISO8601DateFormat)
        );
      }
      to.spousePHN = from.spouse.previous_phn
        ? String(
            from.spouse.previous_phn.replace(new RegExp('[^0-9]', 'g'), '')
          )
        : '';
      to.spouseSIN = from.spouse.sin
        ? String(from.spouse.sin.replace(new RegExp('[^0-9]', 'g'), ''))
        : '';
      to.spouseSixtyFiveDeduction = from.eligibility.spouseSixtyFiveDeduction
        ? from.eligibility.spouseSixtyFiveDeduction
        : 0;
    }

    // Capturing Financial-info page response
    to.assistanceYear = String(from.getTaxYear());
    to.taxYear = String(from.getTaxYear());
    to.numberOfTaxYears = from.numberOfTaxYears();
    to.adjustedNetIncome =
      from.eligibility.adjustedNetIncome != null
        ? from.eligibility.adjustedNetIncome
        : 0;
    to.childDeduction =
      from.eligibility.childDeduction != null
        ? from.eligibility.childDeduction
        : 0;
    to.deductions =
      from.eligibility.deductions != null ? from.eligibility.deductions : 0;
    to.disabilityDeduction =
      from.disabilityDeduction != null ? from.disabilityDeduction : 0;
    to.sixtyFiveDeduction =
      from.eligibility.sixtyFiveDeduction != null
        ? from.eligibility.sixtyFiveDeduction
        : 0;
    to.totalDeductions =
      from.eligibility.totalDeductions != null
        ? from.eligibility.totalDeductions
        : 0;
    to.totalNetIncome =
      from.eligibility.totalNetIncome != null
        ? from.eligibility.totalNetIncome
        : 0;
    if (from.claimedChildCareExpense_line214 != null) {
      to.childCareExpense = from.claimedChildCareExpense_line214;
    } else to.childCareExpense = 0;
    to.netIncomeLastYear = Number(from.netIncomelastYear);
    to.numChildren = from.childrenCount > 0 ? Number(from.childrenCount) : 0;
    to.numDisabled = from.numDisabled;
    to.spouseIncomeLine236 =
      from.spouseIncomeLine236 != null ? Number(from.spouseIncomeLine236) : 0;
    to.reportedUCCBenefit = from.reportedUCCBenefit_line117;
    to.spouseDSPAmount = from.spouseDSPAmount_line125;
    to.spouseDeduction = from.eligibility.spouseDeduction;

    // Capturing Address page response
    to.applicantAddressLine1 = from.mailingAddress.addressLine1;
    to.applicantAddressLine2 = from.mailingAddress.addressLine2;
    to.applicantAddressLine3 = from.mailingAddress.addressLine3;
    to.applicantCity = from.mailingAddress.city;
    to.applicantCountry = from.mailingAddress.country;
    to.applicantPostalCode = from.mailingAddress.postal
      ? from.mailingAddress.postal.toUpperCase().replace(' ', '')
      : '';
    to.applicantProvinceOrState = from.mailingAddress.province;

    if (from.phoneNumber) {
      to.applicantTelephone = from.phoneNumber
        .replace(/[() +/-]/g, '')
        .substr(1);
    }

    // Capturing Authorization page response
    const date = from.authorizedByApplicantDate;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month =
      date.getMonth() < 10
        ? `0${(date.getMonth() + 1).toString()}`
        : (date.getMonth() + 1).toString();
    const year = date.getFullYear();
    const authorizedByApplicantDate = `${year}-${month}-${day}`;
    to.authorizedByApplicantDate = authorizedByApplicantDate;
    to.authorizedByApplicant = from.authorizedByApplicant ? 'Y' : 'N';
    to.authorizedBySpouse = from.authorizedBySpouse ? 'Y' : 'N';
    to.powerOfAttorney = from.hasPowerOfAttorney ? 'Y' : 'N';

    // returning the suppbenefitresponse object
    return to;
  }

  private prepareBenefitApplication(
    from: BenefitApplication
  ): MSPApplicationSchema {
    const object = {
      supplementaryBenefitsApplication: this.convertBenefitApplication(from),
      attachments: this.convertToAttachment(from.getAllImages()),
      uuid: from.uuid
    };
    return object;
  }

  private convertToAttachment(images: MspImage[]): AttachmentRequestPartial[] {
    const output = [];
    images.map((image, i) => {
      const partial: AttachmentRequestPartial = {
        contentType: 'IMAGE_JPEG',
        attachmentDocumentType: MspApiBenefitService.AttachmentDocumentType,
        attachmentOrder: (i + 1).toString(),
        description: '',
        // TODO - Sure this is the correct UUID here?
        attachmentUuid: image.uuid
      };
      output.push(partial);
    });

    return output;
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
