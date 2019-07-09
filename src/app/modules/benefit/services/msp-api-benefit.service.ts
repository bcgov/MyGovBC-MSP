import { Injectable } from '@angular/core';
import { MspLogService } from '../../../services/log.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { BenefitApplication } from '../models/benefit-application.model';
import {
  BenefitApplicationTypeFactory,
  BenefitApplicationType
} from '../../enrolment/pages/api-model/benefitTypes';
import { AssistanceApplicationType } from '../../assistance/models/financial-assist-application.model';
import {
  AttachmentType,
  _ApplicationTypeNameSpace
} from '../../enrolment/pages/api-model/applicationTypes';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { AbstractHttpService } from 'moh-common-lib';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { GenderType } from '../../enrolment/pages/api-model/commonTypes';
import { ResponseType } from '../../enrolment/pages/api-model/responseTypes';
import { MspImage } from '../../../models/msp-image';
import { Response } from '@angular/http';
import { MspApiService } from '../../../services/msp-api.service';
import { SuppBenefitApiResponse } from '../models/suppBenefit-response.interface';

@Injectable({
  providedIn: 'root'
})

//TODO - nothing has been done on these service except the skeleton.
// This service should handle the hitting of the middleware
export class MspApiBenefitService extends AbstractHttpService {
  protected _headers: HttpHeaders = new HttpHeaders();
  readonly ISO8601DateFormat = 'YYYY-MM-DD';
  suppBenefitResponse: SuppBenefitApiResponse;

  constructor(protected http: HttpClient, private logService: MspLogService) {
    super(http);
  }

  /**
   * User does NOT specify document type therefore we always say its a supporting document
   * @type {string}
   */
  static readonly AttachmentDocumentType = 'SupportDocument';
  static readonly ApplicationType = 'benefitApplication';

  sendRequest(app: BenefitApplication): Promise<any> {
    return new Promise<SuppBenefitApiResponse>((resolve, reject) => {
      console.log(app);

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

          return this.sendApplication(app, app.uuid).subscribe(response => {
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

  sendApplication(app: BenefitApplication, uuid: string): Observable<any> {
    // const suppBenefitRequest = this.convertBenefitApplication(app);
    const suppBenefitRequest = this.prepareBenefitApplication(app);
    const url =
      environment.appConstants.apiBaseUrl +
      environment.appConstants.suppBenefitAPIUrl +
      uuid;

    // Setup headers
    this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Response-Type': 'application/json',
      // TODO: token header
      'X-Authorization': 'Bearer ' + app.authorizationToken
    });
    return this.post<BenefitApplication>(url, suppBenefitRequest);
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
  ): BenefitApplicationType {
    // Init BenefitApplication
    // const to = BenefitApplicationTypeFactory.make();
    const to: any = BenefitApplicationTypeFactory.make();
    to.applicationType = MspApiBenefitService.ApplicationType;
    to.applicationUuid = from.uuid;

    /*
         birthDate: string;
         gender: GenderType;
         name: NameType;
         */
    to.applicantFirstName = from.applicant.firstName;
    to.applicantSecondName = from.applicant.middleName;
    to.applicantLastName = from.applicant.lastName;

    if (from.applicant.hasDob) {
      to.applicantBirthdate = from.applicant.dob.format(this.ISO8601DateFormat);
    }
    if (from.applicant.gender != null) {
      to.applicantGender = <GenderType>from.applicant.gender.toString();
    }

    /*
         financials: FinancialsType;
         mailingAddress?: ct.AddressType;
         phn: number;
         powerOfAttorny: ct.YesOrNoType;
         residenceAddress: ct.AddressType;
         SIN: number;
         telephone: number;
         */

    switch (from.getBenefitApplicationType()) {
      case AssistanceApplicationType.CurrentYear:
        to.assistanceYear = 'CurrentPA';
        break;
      case AssistanceApplicationType.PreviousTwoYears:
        to.assistanceYear = 'PreviousTwo';
        break;
      case AssistanceApplicationType.MultiYear:
        to.assistanceYear = 'MultiYear';
        break;
    }
    to.taxYear = from.getTaxYear();
    to.numberOfTaxYears = from.numberOfTaxYears();
    if (from.eligibility.adjustedNetIncome != null)
      to.adjustedNetIncome = from.eligibility.adjustedNetIncome;
    if (from.eligibility.childDeduction != null)
      to.childDeduction = from.eligibility.childDeduction;
    if (from.eligibility.deductions != null)
      to.deductions = from.eligibility.deductions;
    if (from.disabilityDeduction > 0)
      to.disabilityDeduction = from.disabilityDeduction;
    if (from.eligibility.sixtyFiveDeduction != null)
      to.sixtyFiveDeduction = from.eligibility.sixtyFiveDeduction;
    if (from.eligibility.totalDeductions != null)
      to.totalDeductions = from.eligibility.totalDeductions;
    if (from.eligibility.totalNetIncome != null)
      to.totalNetIncome = from.eligibility.totalNetIncome;
    if (from.claimedChildCareExpense_line214 != null)
      to.childCareExpense = from.claimedChildCareExpense_line214;
    if (from.netIncomelastYear != null)
      to.netIncomeLastYear = from.netIncomelastYear;
    if (from.childrenCount != null && from.childrenCount > 0)
      to.numChildren = from.childrenCount;
    if (from.numDisabled > 0) to.numDisabled = from.numDisabled;
    if (from.spouseIncomeLine236 != null)
      to.spouseIncomeLine236 = from.spouseIncomeLine236;
    if (from.netIncomelastYear != null)
      to.totalNetIncome = from.netIncomelastYear;
    if (from.reportedUCCBenefit_line117 != null)
      to.reportedUCCBenefit = from.reportedUCCBenefit_line117;
    if (from.spouseDSPAmount_line125 != null)
      to.spouseDSPAmount = from.spouseDSPAmount_line125;

    // Capturing Mailing Address
    to.applicantAddressLine1 = from.mailingAddress.addressLine1;
    to.applicantAddressLine2 = from.mailingAddress.addressLine2;
    to.applicantAddressLine3 = from.mailingAddress.addressLine3;
    to.applicantCity = from.mailingAddress.city;
    to.applicantCountry = from.mailingAddress.country;
    if (from.mailingAddress.postal) {
      to.applicantPostalCode = from.mailingAddress.postal
        .toUpperCase()
        .replace(' ', '');
    }
    to.applicantProvinceOrState = from.mailingAddress.province;

    // Capturing Previous pHn , Power of attorney, SIn and Phone number
    if (from.applicant.previous_phn) {
      to.applicantPHN = Number(
        from.applicant.previous_phn.replace(new RegExp('[^0-9]', 'g'), '')
      );
    }
    if (from.hasPowerOfAttorney) to.powerOfAttorney = 'Y';
    else {
      to.powerOfAttorney = 'N';
    }

    if (from.applicant.sin) {
      to.applicantSIN = Number(
        from.applicant.sin.replace(new RegExp('[^0-9]', 'g'), '')
      );
    }
    if (from.phoneNumber) {
      to.applicantTelephone = Number(
        from.phoneNumber.replace(new RegExp('[^0-9]', 'g'), '')
      );
    }

    // Capturing AuthorizedbyapplicantDate, Autorizedby Spouse, AuthorizedbyApplicant
    to.authorizedByApplicantDate = moment(
      from.authorizedByApplicantDate
    ).format(this.ISO8601DateFormat);
    if (from.authorizedByApplicant) {
      to.authorizedByApplicant = 'Y';
    } else {
      to.authorizedByApplicant = 'N';
    }
    if (from.authorizedBySpouse) {
      to.authorizedBySpouse = 'Y';
    } else {
      to.authorizedBySpouse = 'N';
    }

    if (from.hasSpouseOrCommonLaw) {
      /*  name: ct.NameType;
                birthDate?: string;
                phn?: number;
                SIN?: number;
                spouseDeduction?: number;
                spouseSixtyFiveDeduction?: number;
            */
      to.spouseFirstName = from.spouse.firstName;
      to.spouseSecondName = from.spouse.middleName;
      to.spouseLastName = from.spouse.lastName;

      if (from.spouse.hasDob) {
        to.spouseBirthdate = from.spouse.dob.format(this.ISO8601DateFormat);
      }
      if (from.spouse.previous_phn) {
        to.spousePHN = Number(
          from.spouse.previous_phn.replace(new RegExp('[^0-9]', 'g'), '')
        );
      }
      if (from.spouse.sin) {
        to.spouseSIN = Number(
          from.spouse.sin.replace(new RegExp('[^0-9]', 'g'), '')
        );
      }

      /*
                spouseDeduction?: number;
                spouseSixtyFiveDeduction?: number;
            */
      if (from.eligibility.spouseDeduction != null) {
        to.spouseDeduction = from.eligibility.spouseDeduction;
      }
      if (from.eligibility.spouseSixtyFiveDeduction != null) {
        to.spouseSixtyFiveDeduction = from.eligibility.spouseSixtyFiveDeduction;
      }
    }

    // Capturing Attachments
    to.attachments = new Array<AttachmentType>();

    // assemble all attachments
    const attachments = from.getAllImages();

    // If no attachments just return
    if (!attachments || attachments.length < 1) {
      return null;
    }

    // Convert each one
    for (const attachment of attachments) {
      // Init new attachment with defaults
      const toAttachment = <AttachmentType>{};
      toAttachment.attachmentDocumentType =
        MspApiBenefitService.AttachmentDocumentType;

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

      // Add to array
      to.attachments.push(toAttachment);
    }

    console.log('convertBenefitApplication', {
      orig: to,
      new: this.prepareBenefitApplication(from),
      from
    });
    return to;
  }

  // TODO - IN PROGRESS REFACTORING OF ABOVE
  // private prepareBenefitApplication(from: BenefitApplication): BenefitApplicationType {
  private prepareBenefitApplication(from: BenefitApplication): any {
    console.log('prepareBenefitApplicatoin', {
      from,
      imageUUIDs: from.getAllImages().map(x => x.uuid)
    });
    const output = {
      supplementaryBenefitsApplication: {
        applicantFirstName: 'Smith',
        applicantLastName: 'Lord',
        applicantBirthdate: '03-18-1982',
        applicantPHN: '9876458907',
        applicantSIN: '789065345',
        applicantAddressLine1: '702 Yates Street',
        applicantCity: 'Victoria',
        applicantProvinceOrState: 'BC',
        applicantCountry: 'Canada',
        applicantPostalCode: 'V8T0A3',
        applicantTelephone: '2509870876',
        authorizedByApplicant: 'Y',
        authorizedByApplicantDate: '09-10-2018',
        powerOfAttorney: 'Y',
        assistanceYear: '2019',
        taxYear: '2017',
        numberOfTaxYears: 0,
        adjustedNetIncome: 78000,
        childDeduction: 0,
        deductions: 2000,
        disabilityDeduction: 0,
        sixtyFiveDeduction: 0,
        totalDeductions: 2000,
        totalNetIncome: 76000,
        childCareExpense: 0,
        netIncomeLastYear: 70000,
        numChildren: 0,
        numDisabled: 0,
        spouseIncomeLine236: 0,
        reportedUCCBenefit: 0,
        spouseDSPAmount: 0,
        spouseDeduction: 0
      }
      // 'uuid' : '2345678-a89b-52d3-a456-526655441250',
      // 'attachments' : [ {
      //   'contentType' : 'IMAGE_JPEG',
      //   'attachmentDocumentType' : 'ImmigrationDocuments',
      //   'attachmentUuid' : '4345678-f89c-52d3-a456-626655441236',
      //   'attachmentOrder' : '1',
      //   'description' : 'Foreign Birth Certificate'
      // } ]
    };

    // create Attachment from Images
    output['attachments'] = this.convertToAttachment(from.getAllImages());
    output['uuid'] = from.uuid;

    return output;
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

// Remove? Make use of applicationTypes.ts?
// TODO - Replace the "Y/N" ones with a new type
class BenefitApplicationRequest {
  supplementaryBenefitsApplication: {
    applicantFirstName: string;
    applicantLastName: string;
    applicantBirthdate: string;
    applicantPHN: string;
    applicantSIN: string;
    applicantAddressLine1: string;
    applicantCity: string;
    applicantProvinceOrState: string;
    applicantCountry: string;
    applicantPostalCode: string;
    applicantTelephone: string;
    authorizedByApplicant: string;
    authorizedByApplicantDate: string; //'09-10-2018',
    powerOfAttorney: string;
    assistanceYear: string;
    taxYear: string;
    numberOfTaxYears: number;
    adjustedNetIncome: number;
    childDeduction: number;
    deductions: number;
    disabilityDeduction: number;
    sixtyFiveDeduction: number;
    totalDeductions: number;
    totalNetIncome: number;
    childCareExpense: number;
    netIncomeLastYear: number;
    numChildren: number;
    numDisabled: number;
    spouseIncomeLine236: number;
    reportedUCCBenefit: number;
    spouseDSPAmount: number;
    spouseDeduction: number;
  };
  //   TODO - make  everything below this generic for all requests

  'uuid': string;
  attachments: AttachmentType[];

  //   'attachments': [ {
  //     'contentType': 'IMAGE_JPEG',
  //     'attachmentDocumentType': 'ImmigrationDocuments',
  //     'attachmentUuid': '4345678-f89c-52d3-a456-626655441236',
  //     'attachmentOrder': '1',
  //     'description': 'Foreign Birth Certificate'
  //   } ]
}
