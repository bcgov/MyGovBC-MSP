import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AccountChangeAccountHolderFactory, AccountChangeAccountHolderType, AccountChangeApplicationTypeFactory, AccountChangeChildType, AccountChangeChildTypeFactory, AccountChangeChildrenFactory, AccountChangeSpouseType, AccountChangeSpouseTypeFactory, AccountChangeSpousesTypeFactory, OperationActionType } from '../modules/msp-core/api-model/accountChangeTypes';
import { ApplicationTypeFactory, AttachmentType, AttachmentTypeFactory, AttachmentsType, AttachmentsTypeFactory, DocumentFactory, _ApplicationTypeNameSpace, document } from '../modules/msp-core/api-model/applicationTypes';
import { AssistanceApplicantTypeFactory, AssistanceApplicationTypeFactory, AssistanceSpouseTypeFactory, FinancialsType, FinancialsTypeFactory } from '../modules/msp-core/api-model/assistanceTypes';
import { AddressType, AddressTypeFactory, AttachmentUuidsType, AttachmentUuidsTypeFactory, CitizenshipType, GenderType, NameType, NameTypeFactory } from '../modules/msp-core/api-model/commonTypes';
import { LivedInBCTypeFactory, OutsideBCTypeFactory, WillBeAwayTypeFactory } from '../modules/msp-core/api-model/enrolmentTypes';
import { ResponseType } from '../modules/msp-core/api-model/responseTypes';
import { MspAccountApp } from '../modules/account/models/account.model';
import { ApplicationBase } from '../models/application-base.model';
import { AssistanceApplicationType, FinancialAssistApplication } from '../modules/assistance/models/financial-assist-application.model';
import { OperationActionType as OperationActionTypeEnum, MspPerson } from '../components/msp/model/msp-person.model';
import { Address, CommonImage } from 'moh-common-lib';
import { MspLogService } from './log.service';
import { MspMaintenanceService } from './msp-maintenance.service';
import { Response } from '@angular/http';
import {ISpaEnvResponse} from '../components/msp/model/spa-env-response.interface';
import { environment } from '../../environments/environment';
import { StatusInCanada, CanadianStatusReason } from '../modules/msp-core/models/canadian-status.enum';
import { Relationship } from '../models/relationship.enum';
import { format } from 'date-fns';

const jxon = require('jxon/jxon');

@Injectable()
export class MspApiService {
    protected _headers: HttpHeaders = new HttpHeaders();
    constructor(private http: HttpClient, private logService: MspLogService, private maintenanceService: MspMaintenanceService) {
    }

   /*
    sendRequest(app: MspApplication): Promise<any> {
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
*/
/*
    sendEnrolmentApplication(
        app: MSPApplicationSchema,
        authToken: string
      ): Observable<any> {
          const url = environment.appConstants['apiBaseUrl']
        + '/MSPDESubmitApplication/' + app.uuid
        + '?programArea=enrolment';

        // Setup headers
        this._headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Response-Type': 'application/json',
          'X-Authorization': 'Bearer ' + authToken
        });
        return this.http.post<MspApplication>(url, app);
      }
      */

    /**
     * Sends the Application and returns an MspApplication if successful with referenceNumber populated
     * @param app
     * @returns {Promise<MspApplication>}
     */
    sendApplication(app: ApplicationBase): Promise<ApplicationBase> {
        return new Promise<ApplicationBase>((resolve, reject) => {
            try {
                return this.maintenanceService.checkMaintenance().subscribe(response => {
                    const spaResponse = <ISpaEnvResponse> response;
                    if (spaResponse && spaResponse.SPA_ENV_MSP_MAINTENANCE_FLAG && spaResponse.SPA_ENV_MSP_MAINTENANCE_FLAG === 'true'){
                        console.log('In Maintenance Mode: ', spaResponse.SPA_ENV_MSP_MAINTENANCE_MESSAGE);
                        return reject(spaResponse);
                    } else {

                        console.log('Start sending...');
                        let documentModel: document;
                      /*  if (app instanceof MspApplication) {
                            console.log(app);
                            documentModel = this.convertMspApplication(app);
                            //documentModel = this.prepareEnrolmentApplication(app);
                        } else*/
                        if (app instanceof FinancialAssistApplication) {
                            documentModel = this.convertAssistance(app);
                        } else if (app instanceof MspAccountApp) {
                            documentModel = this.convertMspAccountApp(app);
                        } else {
                            throw new Error('Unknown document type');
                        }

                        // Check for authorization token
                        if (app.authorizationToken == null ||
                            app.authorizationToken.length < 1) {
                            throw new Error('Missing authorization token.');
                        }

                        // second convert to XML
                        const convertedAppXml = this.toXmlString(documentModel);


                        // if no errors, then we'll sendApplication all attachments
                        return this.sendAttachments(app.authorizationToken, documentModel.application.uuid, app.getAllImages()).then(() => {

                            // once all attachments are done we can sendApplication in the data
                            return this.sendDocument(app.authorizationToken, documentModel, convertedAppXml).then(
                                (response: ResponseType) => {
                                    console.log('sent application resolved');
                                    // Add reference number
                                    app.referenceNumber = response.referenceNumber.toString();

                                    // Let our caller know were done passing back the application
                                    return resolve(app);
                                },

                                (error: Response | any) => {
                                    return reject(error);
                                }
                            );
                        }).catch((error: Response | any) => {
                                console.log('sent all attachments rejected: ', error);
                                this.logService.log({
                                    text: 'Attachment - Send All Rejected ',
                                    response: error,
                                }, 'Attachment - Send All Rejected ');
                                return reject(error);
                            });
                    } // end of else

                }); // end of the return maintenance api
            } catch (error) {
                this.logService.log({
                    text: 'Application - Send Failure ',
                    exception: error,
                }, 'Application - Send Failure ');
                console.log('error: ', error);
                return reject(error);
            }
        });
    }


    private sendAttachments(token: string, applicationUUID: string, attachments: CommonImage[]): Promise<void> {
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
                () => {
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
                    return reject(error);
                }
            )
                .catch((error: Response | any) => {
                    this.logService.log({
                        text: 'Attachments - Send Error ',
                        error: error,
                    }, 'Attachments - Send Error ');
                    console.log('error sending attachment: ', error);
                    return reject(error);
                });
        });
    }

    private sendAttachment(token: string, applicationUUID: string, attachment: CommonImage): Promise<ResponseType> {
        return new Promise<ResponseType>((resolve, reject) => {

            /*
             Create URL
             /{applicationUUID}/attachment/{attachmentUUID}
             */
            let url = environment.appConstants['apiBaseUrl']
                +  environment.appConstants['attachment'] + applicationUUID
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
                .then(() => {
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
                    const response = this.convertResponse(error);
                    reject(response || error);
                });
        });
    }


    /**
     * Sends the application XML, last step in overall transaction
     * @param document
     * @returns {Promise<ResponseType>}
     */
    private sendDocument(token: string, document: document, documentXmlString: string): Promise<ResponseType> {
        return new Promise<ResponseType>((resolve, reject) => {
            /*
             Create URL
             /{applicationUUID}
             */
            const url = environment.appConstants['apiBaseUrl']
                + '/MSPDESubmitApplication/' + document.application.uuid
                + '?programArea=enrolment';

            // Setup headers
            const headers = new HttpHeaders({
                'Content-Type': 'application/xml',
                'Response-Type': 'application/xml',
                'X-Authorization': 'Bearer ' + token,
            });
            const options = {headers: headers, responseType: 'text' as 'text'};

            // Convert doc to XML
            // let documentXmlString = this.toXmlString(document);

            return this.http.post(url, documentXmlString, options)
                .toPromise()
                .then((response: string) => {
                    // this.logService.log({
                    //    text: "Send Document XML - Success",
                    //    response: response,
                    // }, "Send Document XML - Success")
                    console.log('sent application resolved');
                    return resolve(this.convertResponse(response));
                })
                .catch((error) => {
                    this.logService.log({
                        text: 'Application - XML Send Error ',
                        response: error,
                    }, 'Application - XML Send Error ');
                    console.log('full error: ', error);
                    return reject(error);
                });
        });
    }

    convertResponse(responseBody: string): ResponseType {
        return this.stringToJs<ResponseType>(responseBody)['ns2:response'];
    }


    /**
     * Start of MSP Application converted converter operation
     * @param from
     * @returns {applicationTypes.ApplicationType}
     */
/*    convertMspApplication(from: MspApplication): document {
        // Instantiate new object from interface
        const to = DocumentFactory.make();
        to.application = ApplicationTypeFactory.make();

        // UUID
        to.application.uuid = from.uuid;

        // Init data structure
        to.application.enrolmentApplication = EnrolmentApplicationTypeFactory.make();

        // Applicant section
        to.application.enrolmentApplication.applicant = EnrolmentApplicantTypeFactory.make();
        to.application.enrolmentApplication.applicant.name = this.convertName(from.applicant);
*/
        /*
         birthDate: Date;
         gender: GenderType;
         */
/*        to.application.enrolmentApplication.applicant.attachmentUuids = this.convertAttachmentUuids(from.applicant.documents.images);

        if (from.applicant.hasDob) {
            to.application.enrolmentApplication.applicant.birthDate = from.applicant.dob.format(this.ISO8601DateFormat);
        }
        if (from.applicant.gender != null) {
            to.application.enrolmentApplication.applicant.gender = <GenderType>{};
            to.application.enrolmentApplication.applicant.gender = <GenderType> from.applicant.gender.toString();
        }*/
        /*
         authorizedByApplicant: ct.YesOrNoType;
         authorizedByApplicantDate: Date;
         authorizedBySpouse: ct.YesOrNoType;
         */
/*        if (from.authorizedByApplicant != null) {
            to.application.enrolmentApplication.applicant.authorizedByApplicant = from.authorizedByApplicant ? 'Y' : 'N';
            to.application.enrolmentApplication.applicant.authorizedByApplicantDate = moment(from.authorizedByApplicantDate)
                .format(this.ISO8601DateFormat);
        }
        if (from.authorizedBySpouse != null) {
            to.application.enrolmentApplication.applicant.authorizedBySpouse = from.authorizedBySpouse ? 'Y' : 'N';
        }*/
        /*
         mailingAddress?: ct.AddressType;
         residenceAddress: ct.AddressType;
         residency: ResidencyType;
         telephone: number;
         */
   /*     if (!from.mailingSameAsResidentialAddress) {
            to.application.enrolmentApplication.applicant.mailingAddress = this.convertAddress(from.mailingAddress);
        }
        to.application.enrolmentApplication.applicant.residenceAddress = this.convertAddress(from.residentialAddress);

        to.application.enrolmentApplication.applicant.residency = this.convertResidency(from.applicant);
        if (from.phoneNumber) {
            to.application.enrolmentApplication.applicant.telephone = Number(from.phoneNumber.replace(new RegExp('[^0-9]', 'g'), ''));
        }

        // Convert spouse
        if (from.spouse) {
            to.application.enrolmentApplication.spouse = this.convertPersonFromEnrollment(from.spouse);
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
                to.application.enrolmentApplication.children = EnrolmentChildrenTypeFactory.make();
                to.application.enrolmentApplication.children.child = new Array<PersonType>();
                for (const child of children) {
                    to.application.enrolmentApplication.children.child.push(this.convertPersonFromEnrollment(child));
                }
            }

            // Dependants
            if (dependants.length > 0) {
                to.application.enrolmentApplication.dependents = EnrolmentDependentsTypeFactory.make();
                to.application.enrolmentApplication.dependents.dependent = new Array<DependentType>();
                for (const dependant of dependants) {
                    to.application.enrolmentApplication.dependents.dependent.push(this.convertDependantFromEnrollment(dependant));
                }
            }
        }

        // Convert attachments
        to.application.attachments = this.convertAttachmentsForEnrolment(from);

        return to;
    }
*/
    convertMspAccountApp(from: MspAccountApp): document {
        const to = DocumentFactory.make();
        to.application = ApplicationTypeFactory.make();
        // UUID
        to.application.uuid = from.uuid;

        to.application.accountChangeApplication = AccountChangeApplicationTypeFactory.make();


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

    convertAssistance(from: FinancialAssistApplication): document {
        // Instantiate new object from interface
        const to = DocumentFactory.make();
        to.application = ApplicationTypeFactory.make();

        // UUID
        to.application.uuid = from.uuid;

        // Init assistance
        to.application.assistanceApplication = AssistanceApplicationTypeFactory.make();

        /*
         attachmentUuids: AttachmentUuidsType;
         birthDate: string;
         gender: GenderType;
         name: NameType;
         */
        to.application.assistanceApplication.applicant = AssistanceApplicantTypeFactory.make();
        to.application.assistanceApplication.applicant.name = this.convertName(from.applicant);

        if (from.applicant.hasDob) {
            to.application.assistanceApplication.applicant.birthDate = format(from.applicant.dob, this.ISO8601DateFormat);
        }
        if (from.applicant.gender != null) {
            to.application.assistanceApplication.applicant.gender = <GenderType> from.applicant.gender.toString();
        }
        if (from.powerOfAttorneyDocs && from.powerOfAttorneyDocs.length > 0) {
            to.application.assistanceApplication.applicant.attachmentUuids = this.convertAttachmentUuids(from.powerOfAttorneyDocs);
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
        to.application.assistanceApplication.applicant.financials = this.convertFinancial(from);
        to.application.assistanceApplication.applicant.mailingAddress = this.convertAddress(from.mailingAddress);

        if (from.applicant.previous_phn) {
            to.application.assistanceApplication.applicant.phn = Number(from.applicant.previous_phn.replace(new RegExp('[^0-9]', 'g'), ''));
        }
        if (from.hasPowerOfAttorney)
            to.application.assistanceApplication.applicant.powerOfAttorney = 'Y';
        else {
            to.application.assistanceApplication.applicant.powerOfAttorney = 'N';
        }

        if (from.applicant.sin) {
            to.application.assistanceApplication.applicant.SIN = Number(from.applicant.sin.replace(new RegExp('[^0-9]', 'g'), ''));
        }
        if (from.phoneNumber) {
            to.application.assistanceApplication.applicant.telephone = Number(from.phoneNumber.replace(new RegExp('[^0-9]', 'g'), ''));
        }
        /*
         authorizedByApplicant: ct.YesOrNoType;
         authorizedByApplicantDate: Date;
         authorizedBySpouse: ct.YesOrNoType;
         authorizedBySpouseDate: Date;
         spouse?: AssistanceSpouseType;
         */
        to.application.assistanceApplication.authorizedByApplicantDate =
            moment(from.authorizedByApplicantDate).format(this.ISO8601DateFormat);
        if (from.authorizedByApplicant) {
            to.application.assistanceApplication.authorizedByApplicant = 'Y';

        }
        else {
            to.application.assistanceApplication.authorizedByApplicant = 'N';
        }
        if (from.authorizedBySpouse) {
            to.application.assistanceApplication.authorizedBySpouse = 'Y';
        }
        else {
            to.application.assistanceApplication.authorizedBySpouse = 'N';
        }

        if (from.hasSpouseOrCommonLaw) {
            to.application.assistanceApplication.spouse = AssistanceSpouseTypeFactory.make();

            /*
             name: ct.NameType;
             birthDate?: string;
             phn?: number;
             SIN?: number;
             spouseDeduction?: number;
             spouseSixtyFiveDeduction?: number;
             */
            to.application.assistanceApplication.spouse.name = this.convertName(from.spouse);
            if (from.spouse.hasDob) {
                to.application.assistanceApplication.spouse.birthDate = format(from.spouse.dob, this.ISO8601DateFormat);
            }
            if (from.spouse.previous_phn) {
                to.application.assistanceApplication.spouse.phn = Number(from.spouse.previous_phn.replace(new RegExp('[^0-9]', 'g'), ''));
            }
            if (from.spouse.sin) {
                to.application.assistanceApplication.spouse.SIN = Number(from.spouse.sin.replace(new RegExp('[^0-9]', 'g'), ''));
            }

            /*
             spouseDeduction?: number;
             spouseSixtyFiveDeduction?: number;
             */
            if (from.eligibility.spouseDeduction != null) {
                to.application.assistanceApplication.spouse.spouseDeduction = from.eligibility.spouseDeduction;
            }
            if (from.eligibility.spouseSixtyFiveDeduction != null) {
                to.application.assistanceApplication.spouse.spouseSixtyFiveDeduction = from.eligibility.spouseSixtyFiveDeduction;
            }
        }

        // Convert attachments
        const attachments = this.convertAttachments(from.getAllImages());
        if (attachments != null) {
            to.application.attachments = attachments;
        }

        return to;
    }

    private convertFinancial(from: FinancialAssistApplication): FinancialsType {
        const to = FinancialsTypeFactory.make();

        /*
         adjustedNetIncome?: number;          // adjustedNetIncome
         assistanceYear: AssistanceYearType;  // "CurrentPA" TODO: ticket in JIRA to address this
         childCareExpense?: number;           // claimedChildCareExpense_line214
         childDeduction?: number;             // childDeduction
         deductions?: number;                 // deductions
         disabilityDeduction?: number;        // disabilityDeduction
         disabilitySavingsPlan?: number;      // spouseDSPAmount_line125
         netIncome: number;                   // netIncomelastYear
         numChildren?: number;                // childrenCount
         numDisabled?: number;                // numDisabled
         sixtyFiveDeduction?: number;         // both applicant and spouse
         spouseNetIncome?: number;            // spouseIncomeLine236
         taxYear: number;                     // Current Year, if multiple the recent selected
         totalDeductions?: number;            // totalDeductions
         totalNetIncome?: number;             // totalNetIncome, applicant and spouse
         uccb?: number;                       // reportedUCCBenefit_line117
                                             // ageOver65
                                             // hasSpouseOrCommonLaw
                                             // spouseAgeOver65
                                             // spouseEligibleForDisabilityCredit
                                             // selfDisabilityCredit
                                             // deductionDifference?
         */

        switch (from.getAssistanceApplicationType()) {
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
        if (from.netIncomelastYear != null) to.netIncome = from.netIncomelastYear;
        if (from.childrenCount != null && from.childrenCount > 0) to.numChildren = from.childrenCount;
        if (from.numDisabled > 0) to.numDisabled = from.numDisabled;
        if (from.spouseIncomeLine236 != null) to.spouseNetIncome = from.spouseIncomeLine236;
        if (from.netIncomelastYear != null) to.netIncome = from.netIncomelastYear;
        if (from.reportedUCCBenefit_line117 != null) to.uccb = from.reportedUCCBenefit_line117;
        if (from.spouseDSPAmount_line125 != null) to.disabilitySavingsPlan = from.spouseDSPAmount_line125;


        return to;
    }

    /**
     * User does NOT specify document type therefore we always say its a supporting document
     * @type {string}
     */
    static readonly AttachmentDocumentType = 'SupportDocument';

    /**
     * Creates the array of attachments from applicant, spouse and all children
     * @param from
     * @returns {AttachmentsType}
     */
   /* private convertAttachmentsForEnrolment(from: MspApplication): AttachmentsType {

        const to = AttachmentsTypeFactory.make();
        to.attachment = new Array<AttachmentType>();

        // assemble all attachments
        const attachments: CommonImage[] = from.getAllImages();

        // Convert each one
        for (const attachment of attachments) {
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
            }

            // uuid
            toAttachment.attachmentUuid = attachment.uuid;
            toAttachment.attachmentOrder = String(attachment.attachmentOrder) ;
            // user does NOT provide description so it's left blank for now, may be used in future

            // Add to array
            to.attachment.push(toAttachment);
        }

        return to;
    }*/

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

    private convertChildFromAccountChange(from: MspPerson): AccountChangeChildType {
        const to = AccountChangeChildTypeFactory.make();

        to.operationAction = <OperationActionType> OperationActionTypeEnum[from.operationActionType];

        to.name = this.convertName(from);
        if (from.hasDob) {
            to.birthDate = format(from.dob, this.ISO8601DateFormat);
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
                to.departDateSchoolOutside = format(from.studiesDepartureDate, this.ISO8601DateFormat);
            }

            if (from.hasStudiesFinished) {
                to.dateStudiesFinish = format(from.studiesFinishedDate, this.ISO8601DateFormat);
            }

            if (from.hasStudiesBegin) {
                to.dateStudiesBegin = format(from.studiesBeginDate, this.ISO8601DateFormat);
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
                    to.livedInBC.recentBCMoveDate = format(from.arrivalToBCDate, this.ISO8601DateFormat);
                }
            }

        }
        //Is this child newly adopted?
        if (from.newlyAdopted) {
            to.adoptionDate = format( from.adoptedDate, this.ISO8601DateFormat);
        }


        // Has this family member been outside of BC for more than a total of 30 days during the past 12 months?
        if (from.declarationForOutsideOver30Days != null) {
            to.outsideBC = OutsideBCTypeFactory.make();
            to.outsideBC.beenOutsideBCMoreThan = from.declarationForOutsideOver30Days === true ? 'Y' : 'N';
            if (from.declarationForOutsideOver30Days) {
                if (from.outOfBCRecord.hasDeparture) {
                    to.outsideBC.departureDate = format(from.outOfBCRecord.departureDate, this.ISO8601DateFormat);
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
                    to.livedInBC.recentBCMoveDate = format(from.arrivalToBCDate, this.ISO8601DateFormat);
                }
            }

        }


        // Has this family member been outside of BC for more than a total of 30 days during the past 12 months?
        if (from.declarationForOutsideOver30Days != null) {
            to.outsideBC = OutsideBCTypeFactory.make();
            to.outsideBC.beenOutsideBCMoreThan = from.declarationForOutsideOver30Days === true ? 'Y' : 'N';
            if (from.declarationForOutsideOver30Days) {
                if (from.outOfBCRecord.hasDeparture) {
                    to.outsideBC.departureDate = format(from.outOfBCRecord.departureDate, this.ISO8601DateFormat);
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

    private convertSpouseFromAccountChange(from: MspPerson): AccountChangeSpouseType {
        const to = AccountChangeSpouseTypeFactory.make();
        to.name = this.convertName(from);

        if (from.hasDob) {
            to.birthDate = format(from.dob, this.ISO8601DateFormat);
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
            to.marriageDate = format(from.marriageDate, this.ISO8601DateFormat);
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
            to.cancellationDate = format( from.cancellationDate, this.ISO8601DateFormat );
            }
        }
        if (from.knownMailingAddress === true ) {
            to.mailingAddress = this.convertAddress(from.mailingAddress);
        } else if (from.knownMailingAddress === false) {
            to.mailingAddress = this.unknownAddress();
        }

        return to;

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

    private convertAttachmentUuids(from: CommonImage[]): AttachmentUuidsType {
        const to = AttachmentUuidsTypeFactory.make();

        to.attachmentUuid = new Array<string>();
        for (const image of from) {
            to.attachmentUuid.push(image.uuid);
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

    static ApplicationTypeNameSpace = _ApplicationTypeNameSpace;

    /**
     * Converts any JS object to XML with optional namespace
     * @param from
     * @param namespace
     * @returns {any}
     */
    toXmlString(from: any): string {
        const xml = jxon.jsToXml(from);
        const xmlString = jxon.xmlToString(xml);
        return this.correctNSinXmlString (xmlString);
    }

    stringToJs<T>(from: string): T {
        const converted = jxon.stringToJs(from) as T;
        return converted;
    }

    jsToXml(from: any) {
        return jxon.jsToXml(from);
    }

    stringToXml(from: string) {
        return jxon.stringToXml(from);
    }

/*
  private prepareEnrolmentApplication(from: MspApplication): any {
    console.log('prepareBenefitApplicatoin', {from, imageUUIDs: from.getAllImages().map(x => x.uuid)});
    const output = {
      'enrolmentApplication': {
        'applicant': {
          'name': {
          'firstName': 'Smith',
          'lastName': 'Butler',
          'secondName': 'MIddle Name'
          },
          'gender': 'M',
          'birthDate': '03-18-1982',
          'residenceAddress': {
            'addressLine1': '236 Tret Street',
            'city': 'Vancouver',
            'postalCode': 'V6J8U7',
            'provinceOrState': 'BC',
            'country': 'Canada',
            'addressLine2': 'ABCDEFGH',
            'addressLine3': 'ABCDEFGHIJKLMNOPQRS'
          },
          'residency': {
          'citizenshipStatus': {
            'citizenshipType': 'ReligiousWorker',
          // 'attachmentUuids': [
          //	'ABCDEFGHIJKLMNOPQRST'
          //  ]
          },
          'previousCoverage': {
            'hasPreviousCoverage': 'N',
            'prevPHN': '9876458907'
          },
          'livedInBC': {
            'hasLivedInBC': 'N',
            'recentBCMoveDate': '03-18-1989',
            'recentCanadaMoveDate': '03-18-1985',
            'isPermanentMove': 'Y',
            'prevProvinceOrCountry': 'ABCDEFGHIJKLMNOPQRSTU',
            'prevHealthNumber': '9876458907'
          },
          'outsideBC': {
            'beenOutsideBCMoreThan': 'Y',
            'departureDate': '03-18-1986',
            'returnDate': '03-18-1987',
            'familyMemberReason': 'ABCDEFGHIJKLMNOPQ',
            'destination': 'ABCDEFGHIJKLMN'
          },
          'willBeAway': {
            'isFullTimeStudent': 'N',
            'isInBCafterStudies': 'Y',
            'armedDischargeDate': '03-18-1989',
            'armedForceInstitutionName': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
          }
          },
          //'attachmentUuids': [
        //	'ABCDEFGHIJKLMNOPQRSTUVWX'
        // ],
          'authorizedByApplicant': 'Y',
          'authorizedByApplicantDate': '09-10-2018',
          'authorizedBySpouse': 'N',
          'telephone': '2356626262'
        }
      }
     };



      // create Attachment from Images
      output['attachments'] = this.convertAttachmentsForEnrolment(from);
      output['uuid'] = from.uuid;
      console.log(output);
      return output;
    }
    */

    // trim in the XML the leading <xx:application xmlns="xx"> and trailing </xx:application>
    // note that xx: might be missing

    private static XmlRootSimple = '<application';
    private static XmlRootNS = ':application';
    private static XmlDocumentHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:application xmlns:ns2="http://www.gov.bc.ca/hibc/applicationTypes">';
    private static XmlDocumentFooter = '</ns2:application>';

    correctNSinXmlString(xmlString: string): string {

        // deal with the beginning
        // check the simple case
        let beginIndex = xmlString.indexOf(MspApiService.XmlRootSimple);
        if (beginIndex >= 0) {
            for (let i = beginIndex; i < xmlString.length; i++) {
                if (xmlString.charAt(i) === '>') {
                    beginIndex = i + 1;
                    break;
                }
            }
            if (beginIndex === xmlString.length)
                beginIndex = 0;
        }
        // not the simple case, check to see the NS case, ie <xx:application>
        else {
            beginIndex = xmlString.indexOf(MspApiService.XmlRootNS);
            if (beginIndex > 0) {
                for (let i = beginIndex; i < xmlString.length; i++) {
                    if (xmlString.charAt(i) === '>') {
                        beginIndex = i + 1;
                        break;
                    }
                }
                if (beginIndex === xmlString.length)
                    beginIndex = 0;
            }
            // cannot find the element <xx:applicationxx> or <applicationxx>
            else {
                const endHeader = xmlString.indexOf('Application>');
                const headerns = 'Header after jxon : ' + xmlString.substring(0, endHeader);
                this.logService.log({
                    text: headerns
                }, 'Application - Header Info');
            }
        }

        // deal with the end
        let endre = /<\/application>/;
        let endIndex = xmlString.search(endre);
        if (endIndex < 0) {
            endre = /<\/[a-z,A-Z,0-9]+:application>/;
            endIndex = xmlString.search(endre);
        }

        if (beginIndex < 0 || endIndex <= 0)
            return xmlString;
        else {
            return MspApiService.XmlDocumentHeader + xmlString.substring(beginIndex, endIndex) + MspApiService.XmlDocumentFooter;
        }
    }

    readonly ISO8601DateFormat = 'yyyy-MM-dd';
}
