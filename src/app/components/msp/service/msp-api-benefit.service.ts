import { Injectable } from '@angular/core';
import { MspLogService } from './log.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BenefitApplication } from '../model/benefit-application.model';
import { BenefitApplicationTypeFactory,BenefitApplicationType  } from '../api-model/benefitTypes';
import { AssistanceApplicationType } from '../model/financial-assist-application.model';
import { ApplicationType, AttachmentType, _ApplicationTypeNameSpace, document } from '../api-model/applicationTypes';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { AbstractHttpService } from './abstract-api.service';
import { Observable, from } from 'rxjs';
import { of, zip } from 'rxjs';
import { AddressType, AddressTypeFactory, AttachmentUuidsType, AttachmentUuidsTypeFactory, BasicCitizenshipTypeFactory, CitizenshipType, GenderType, NameType, NameTypeFactory } from '../api-model/commonTypes';
import { ResponseType } from '../api-model/responseTypes';
import { MspImage } from '../model/msp-image';
import { Http, Response } from '@angular/http';
import {MspApiService} from '../../msp/service/msp-api.service';
import {debounceTime, distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {SuppBenefitApiResponse} from '../model/suppBenefit-response.interface'

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
            console.log('Start sending...');

			// if no errors, then we'll sendApplication all attachments
			return this.sendAttachments(app.authorizationToken, app.uuid, app.getAllImages()).then(() => {
                // once all attachments are done we can sendApplication in the data
                return this.sendApplication(app, app.uuid).subscribe( response  => {
                    // Add reference number
                    if(response && response.referenceNumber) {
                        app.referenceNumber = response.referenceNumber.toString();
                    }     
                    // Let our caller know were done passing back the application
                    return resolve(response);       
                });
			}).catch((error: Response | any) => {
					console.log('sent all attachments rejected: ', error);
					this.logService.log({
						text: 'Attachment - Send All Rejected ',
						response: error,
					}, 'Attachment - Send All Rejected ');
					return resolve(error);
			});
           
        });
    }

    
    sendApplication(app: BenefitApplication, uuid: string): Observable<any>{
        
        const suppBenefitResponse = this.convertBenefitApplication(app);
        const url =  environment.appConstants.apiBaseUrl + environment.appConstants.suppBenefitAPIUrl + uuid ;
        
        // Setup headers
        this._headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Response-Type': 'application/json',
            'X-Authorization': 'Bearer ' +app.authorizationToken,
        });
        return this.post<BenefitApplication>(url, suppBenefitResponse);
    }

    public sendAttachments(token: string, applicationUUID: string, attachments: MspImage[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            // Instantly resolve if no attachments
            if (!attachments || attachments.length < 1) {
                resolve();
            }

            // Make a list of promises for each attachment
            const attachmentPromises = new Array<Promise<ResponseType>>();
            for (const attachment of attachments) {
                attachmentPromises.push(this.sendAttachment(token, applicationUUID, attachment));
            }
            // this.logService.log({
            //    text: "Send All Attachments - Before Sending",
            //     numberOfAttachments: attachmentPromises.length
            // }, "Send Attachments - Before Sending")

            // Execute all promises are waiting for results
            return Promise.all(attachmentPromises).then(
                (responses: ResponseType[]) => {
                    // this.logService.log({
                    //     text: "Send All Attachments - Success",
                    //     response: responses,
                    // }, "Send All Attachments - Success")
                    return resolve();
                },
                (error: Response | any) => {
                    this.logService.log({
                        text: 'Attachments - Send Error ',
                        error: error,
                    }, 'Attachments - Send Error ');
                    console.log('error sending attachment: ', error);
                    return reject();
                }
            ).catch((error: Response | any) => {
                    this.logService.log({
                        text: 'Attachments - Send Error ',
                        error: error,
                    }, 'Attachments - Send Error ');
                    console.log('error sending attachment: ', error);
                    return error;
                });
        });
    }

    private sendAttachment(token: string, applicationUUID: string, attachment: MspImage): Promise<ResponseType> {
        return new Promise<ResponseType>((resolve, reject) => {

            /*
             Create URL
             /{applicationUUID}/attachment/{attachmentUUID}
             */
            let url = environment.appConstants['apiBaseUrl']
                + '/MSPDESubmitAttachment/' + applicationUUID
                + '/attachment/' + attachment.uuid;

            // programArea
            url += '?programArea=enrolment';

            // attachmentDocumentType - UI does NOT collect this property
            url += '&attachmentDocumentType=' + MspApiService.AttachmentDocumentType;

            // contentType
            url += '&contentType=' + attachment.contentType;

            // imageSize
            url += '&imageSize=' + attachment.size;

            // description - UI does NOT collect this property

            // Setup headers
            const headers = new HttpHeaders({
                'Content-Type': attachment.contentType,
                'Access-Control-Allow-Origin': '*',
                'X-Authorization': 'Bearer ' + token
            });
            const options = {headers: headers, responseType: 'text' as 'text'};

            const binary = atob(attachment.fileContent.split(',')[1]);
            const array = <any>[];
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            const blob = new Blob([new Uint8Array(array)], {type: attachment.contentType});

            return this.http
                .post(url, blob, options)
                .toPromise()
                .then((response) => {
                        // this.logService.log({
                        //     text: "Send Individual Attachment - Success",
                        //     response: response,
                        // }, "Send Individual Attachment - Success")
                        return resolve();
                    },
                    (error: Response | any) => {
                        console.log('error response in its origin form: ', error);
                        this.logService.log({
                            text: 'Attachment - Send Error ',
                            response: error,
                        }, 'Attachment - Send Error ');
                        return reject(error);
                    }
                )
                .catch((error: Response | any) => {
                    console.log('Error in sending individual attachment: ', error);
                    this.logService.log({
                        text: 'Attachment - Send Error ',
                        response: error,
                    }, 'Attachment - Send Error ');
                  
                    reject(error);
                });
        });
    }


    protected handleError(error: HttpErrorResponse) {
     // console.log("handleError", JSON.stringify(error));
      if (error.error instanceof ErrorEvent) {
          //Client-side / network error occured
          console.error('MSP Supp Benefit API error: ', error.error.message);
      }
      else {
          // The backend returned an unsuccessful response code
          console.error(`Msp Supp Benefit Backend returned error code: ${error.status}.  Error body: ${error.error}`);
      }

      this.logService.log({
        text: 'Cannot get Suppbenefit API response',
        response: error,
        }, 'Cannot get Suppbenefit API response');
    
      // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
      return of(error);
     // return of([]);
    }



    // This method is used to convert the response from user into a JSON object
    private convertBenefitApplication(from: BenefitApplication): BenefitApplicationType {
        
        // Init BenefitApplication
        const to = BenefitApplicationTypeFactory.make();
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
            to.applicantGender = <GenderType> from.applicant.gender.toString();
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
        if (from.eligibility.adjustedNetIncome != null) to.adjustedNetIncome = from.eligibility.adjustedNetIncome;
        if (from.eligibility.childDeduction != null) to.childDeduction = from.eligibility.childDeduction;
        if (from.eligibility.deductions != null) to.deductions = from.eligibility.deductions;
        if (from.disabilityDeduction > 0) to.disabilityDeduction = from.disabilityDeduction;
        if (from.eligibility.sixtyFiveDeduction != null) to.sixtyFiveDeduction = from.eligibility.sixtyFiveDeduction;
        if (from.eligibility.totalDeductions != null) to.totalDeductions = from.eligibility.totalDeductions;
        if (from.eligibility.totalNetIncome != null) to.totalNetIncome = from.eligibility.totalNetIncome;
        if (from.claimedChildCareExpense_line214 != null) to.childCareExpense = from.claimedChildCareExpense_line214;
        if (from.netIncomelastYear != null) to.netIncomeLastYear = from.netIncomelastYear;
        if (from.childrenCount != null && from.childrenCount > 0) to.numChildren = from.childrenCount;
        if (from.numDisabled > 0) to.numDisabled = from.numDisabled;
        if (from.spouseIncomeLine236 != null) to.spouseIncomeLine236 = from.spouseIncomeLine236;
        if (from.netIncomelastYear != null) to.totalNetIncome = from.netIncomelastYear;
        if (from.reportedUCCBenefit_line117 != null) to.reportedUCCBenefit = from.reportedUCCBenefit_line117;
        if (from.spouseDSPAmount_line125 != null) to.spouseDSPAmount = from.spouseDSPAmount_line125;

        
        // Capturing Mailing Address 
        to.applicantAddressLine1 = from.mailingAddress.addressLine1;
        to.applicantAddressLine2 = from.mailingAddress.addressLine2;
        to.applicantAddressLine3 = from.mailingAddress.addressLine3;
        to.applicantCity = from.mailingAddress.city;
        to.applicantCountry = from.mailingAddress.country;
        if (from.mailingAddress.postal) {
            to.applicantPostalCode = from.mailingAddress.postal.toUpperCase().replace(' ', '');
        }
        to.applicantProvinceOrState = from.mailingAddress.province;
        
        // Capturing Previous pHn , Power of attorney, SIn and Phone number   
        if (from.applicant.previous_phn) {
            to.applicantPHN = Number(from.applicant.previous_phn.replace(new RegExp('[^0-9]', 'g'), ''));
        }
        if (from.hasPowerOfAttorney)
            to.powerOfAttorney = 'Y';
        else {
            to.powerOfAttorney = 'N';
        }

        if (from.applicant.sin) {
            to.applicantSIN = Number(from.applicant.sin.replace(new RegExp('[^0-9]', 'g'), ''));
        }
        if (from.phoneNumber) {
            to.applicantTelephone = Number(from.phoneNumber.replace(new RegExp('[^0-9]', 'g'), ''));
        }
        
        // Capturing AuthorizedbyapplicantDate, Autorizedby Spouse, AuthorizedbyApplicant
        to.authorizedByApplicantDate =
            moment(from.authorizedByApplicantDate).format(this.ISO8601DateFormat);
        if (from.authorizedByApplicant) {
            to.authorizedByApplicant = 'Y';
        }
        else {
            to.authorizedByApplicant = 'N';
        }
        if (from.authorizedBySpouse) {
            to.authorizedBySpouse = 'Y';
        }
        else {
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
                to.spousePHN = Number(from.spouse.previous_phn.replace(new RegExp('[^0-9]', 'g'), ''));
            }
            if (from.spouse.sin) {
                to.spouseSIN = Number(from.spouse.sin.replace(new RegExp('[^0-9]', 'g'), ''));
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
            toAttachment.attachmentDocumentType = MspApiBenefitService.AttachmentDocumentType;

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
            toAttachment.attachmentOrder = String(attachment.attachmentOrder) ;
            
            // Add to array
            to.attachments.push(toAttachment);
        }
        
        console.log(to);
        return to;
    }
}
