import { Injectable } from '@angular/core';
import { MspLogService } from './log.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BenefitApplication } from '../model/benefit-application.model';
import { BenefitApplicationTypeFactory  } from '../api-model/benefitTypes';
import { AssistanceApplicationType } from '../model/financial-assist-application.model';
import { ApplicationType, AttachmentType, _ApplicationTypeNameSpace, document } from '../api-model/applicationTypes';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { AbstractHttpService } from './abstract-api.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AddressType, AddressTypeFactory, AttachmentUuidsType, AttachmentUuidsTypeFactory, BasicCitizenshipTypeFactory, CitizenshipType, GenderType, NameType, NameTypeFactory } from '../api-model/commonTypes';

@Injectable({
  providedIn: 'root'
})

//TODO - nothing has been done on these service except the skeleton.
// This service should handle the hitting of the middleware
export class MspApiBenefitService extends AbstractHttpService {

    protected _headers: HttpHeaders = new HttpHeaders();
    readonly ISO8601DateFormat = 'YYYY-MM-DD';

    constructor(protected http: HttpClient, private logService: MspLogService) {
        super(http);  
    }
    
    /**
     * User does NOT specify document type therefore we always say its a supporting document
     * @type {string}
     */
    static readonly AttachmentDocumentType = 'SupportDocument';
    static readonly ApplicationType = 'benefitApplication';

    sendApplication(app: BenefitApplication): Observable<any>{
        let documentModel: document;
        if (app instanceof BenefitApplication) {
            documentModel = this.convertBenefitApplication(app);
        } else {
            throw new Error('Unknown document type');
        }
        const accountLetterJsonResponse = JSON.stringify(documentModel);
        const url =  environment.appConstants.apiBaseUrl + environment.appConstants.suppBenefitAPIUrl;

      // Setup headers
      this._headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Response-Type': 'application/json',
      });
      
      return this.post<BenefitApplication>(url, accountLetterJsonResponse);
      
    }

    protected handleError(error: HttpErrorResponse) {
      console.log("handleError", JSON.stringify(error));
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
    }



    // This method is used to convert the response from user into a JSON object
    private convertBenefitApplication(from: BenefitApplication): document {
        // Instantiate new object from interface
        const to = <document>{}; 
        to.application = <ApplicationType>{};
        
        // Init assistance
        to.application.benefitApplication = BenefitApplicationTypeFactory.make();
        to.application.benefitApplication.applicationType = MspApiBenefitService.ApplicationType;
        to.application.benefitApplication.applicationUuid = from.uuid;
   
        /*
         attachmentUuids: AttachmentUuidsType;
         birthDate: string;
         gender: GenderType;
         name: NameType;
         */
        to.application.benefitApplication.applicantFirstName = from.applicant.firstName;
        to.application.benefitApplication.applicantSecondName = from.applicant.middleName;
        to.application.benefitApplication.applicantLastName = from.applicant.lastName;
   
        if (from.applicant.hasDob) {
            to.application.benefitApplication.applicantBirthdate = from.applicant.dob.format(this.ISO8601DateFormat);
        }
        if (from.applicant.gender != null) {
            to.application.benefitApplication.applicantGender = <GenderType> from.applicant.gender.toString();
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
                to.application.benefitApplication.assistanceYear = 'CurrentPA';
                break;
            case AssistanceApplicationType.PreviousTwoYears:
                to.application.benefitApplication.assistanceYear = 'PreviousTwo';
                break;
                case AssistanceApplicationType.MultiYear:
                to.application.benefitApplication.assistanceYear = 'MultiYear';
                break;
        }
        to.application.benefitApplication.taxYear = from.getTaxYear();
        to.application.benefitApplication.numberOfTaxYears = from.numberOfTaxYears();
        if (from.eligibility.adjustedNetIncome != null) to.application.benefitApplication.adjustedNetIncome = from.eligibility.adjustedNetIncome;
        if (from.eligibility.childDeduction != null) to.application.benefitApplication.childDeduction = from.eligibility.childDeduction;
        if (from.eligibility.deductions != null) to.application.benefitApplication.deductions = from.eligibility.deductions;
        if (from.disabilityDeduction > 0) to.application.benefitApplication.disabilityDeduction = from.disabilityDeduction;
        if (from.eligibility.sixtyFiveDeduction != null) to.application.benefitApplication.sixtyFiveDeduction = from.eligibility.sixtyFiveDeduction;
        if (from.eligibility.totalDeductions != null) to.application.benefitApplication.totalDeductions = from.eligibility.totalDeductions;
        if (from.eligibility.totalNetIncome != null) to.application.benefitApplication.totalNetIncome = from.eligibility.totalNetIncome;
        if (from.claimedChildCareExpense_line214 != null) to.application.benefitApplication.childCareExpense = from.claimedChildCareExpense_line214;
        if (from.netIncomelastYear != null) to.application.benefitApplication.netIncomeLastYear = from.netIncomelastYear;
        if (from.childrenCount != null && from.childrenCount > 0) to.application.benefitApplication.numChildren = from.childrenCount;
        if (from.numDisabled > 0) to.application.benefitApplication.numDisabled = from.numDisabled;
        if (from.spouseIncomeLine236 != null) to.application.benefitApplication.spouseIncomeLine236 = from.spouseIncomeLine236;
        if (from.netIncomelastYear != null) to.application.benefitApplication.totalNetIncome = from.netIncomelastYear;
        if (from.reportedUCCBenefit_line117 != null) to.application.benefitApplication.reportedUCCBenefit = from.reportedUCCBenefit_line117;
        if (from.spouseDSPAmount_line125 != null) to.application.benefitApplication.spouseDSPAmount = from.spouseDSPAmount_line125;

        
        // Capturing Mailing Address 
        to.application.benefitApplication.applicantAddressLine1 = from.mailingAddress.addressLine1;
        to.application.benefitApplication.applicantAddressLine2 = from.mailingAddress.addressLine2;
        to.application.benefitApplication.applicantAddressLine3 = from.mailingAddress.addressLine3;
        to.application.benefitApplication.applicantCity = from.mailingAddress.city;
        to.application.benefitApplication.applicantCountry = from.mailingAddress.country;
        if (from.mailingAddress.postal) {
            to.application.benefitApplication.applicantPostalCode = from.mailingAddress.postal.toUpperCase().replace(' ', '');
        }
        to.application.benefitApplication.applicantProvinceOrState = from.mailingAddress.province;
        
        // Capturing Previous pHn , Power of attorney, SIn and Phone number   
        if (from.applicant.previous_phn) {
            to.application.benefitApplication.applicantPHN = Number(from.applicant.previous_phn.replace(new RegExp('[^0-9]', 'g'), ''));
        }
        if (from.hasPowerOfAttorney)
            to.application.benefitApplication.powerOfAttorney = 'Y';
        else {
            to.application.benefitApplication.powerOfAttorney = 'N';
        }

        if (from.applicant.sin) {
            to.application.benefitApplication.applicantSIN = Number(from.applicant.sin.replace(new RegExp('[^0-9]', 'g'), ''));
        }
        if (from.phoneNumber) {
            to.application.benefitApplication.applicantTelephone = Number(from.phoneNumber.replace(new RegExp('[^0-9]', 'g'), ''));
        }
        
        // Capturing AuthorizedbyapplicantDate, Autorizedby Spouse, AuthorizedbyApplicant
        to.application.benefitApplication.authorizedByApplicantDate =
            moment(from.authorizedByApplicantDate).format(this.ISO8601DateFormat);
        if (from.authorizedByApplicant) {
            to.application.benefitApplication.authorizedByApplicant = 'Y';
        }
        else {
            to.application.benefitApplication.authorizedByApplicant = 'N';
        }
        if (from.authorizedBySpouse) {
            to.application.benefitApplication.authorizedBySpouse = 'Y';
        }
        else {
            to.application.benefitApplication.authorizedBySpouse = 'N';
        }
    
        if (from.hasSpouseOrCommonLaw) {
            
            /*  name: ct.NameType;
                birthDate?: string;
                phn?: number;
                SIN?: number;
                spouseDeduction?: number;
                spouseSixtyFiveDeduction?: number;
            */
            to.application.benefitApplication.spouseFirstName = from.spouse.firstName;
            to.application.benefitApplication.spouseSecondName = from.spouse.middleName;
            to.application.benefitApplication.spouseLastName = from.spouse.lastName;

            if (from.spouse.hasDob) {
                to.application.benefitApplication.spouseBirthdate = from.spouse.dob.format(this.ISO8601DateFormat);
            }
            if (from.spouse.previous_phn) {
                to.application.benefitApplication.spousePHN = Number(from.spouse.previous_phn.replace(new RegExp('[^0-9]', 'g'), ''));
            }
            if (from.spouse.sin) {
                to.application.benefitApplication.spouseSIN = Number(from.spouse.sin.replace(new RegExp('[^0-9]', 'g'), ''));
            }

            /*
                spouseDeduction?: number;
                spouseSixtyFiveDeduction?: number;
            */
            if (from.eligibility.spouseDeduction != null) {
                to.application.benefitApplication.spouseDeduction = from.eligibility.spouseDeduction;
            }
            if (from.eligibility.spouseSixtyFiveDeduction != null) {
                to.application.benefitApplication.spouseSixtyFiveDeduction = from.eligibility.spouseSixtyFiveDeduction;
            }
        }
        
        // Capturing Attachments
        to.application.benefitApplication.attachments = new Array<AttachmentType>();

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
            to.application.benefitApplication.attachments.push(toAttachment);
        }
        
        console.log(to);
        return to;
    }
}
