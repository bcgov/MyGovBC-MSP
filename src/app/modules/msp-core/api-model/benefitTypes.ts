import * as Primitive from './xml-primitives';
import * as ct from './commonTypes';
import * as at from './applicationTypes';

// Source files:
// https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd-flat/BenefitTypes.xsd
// tslint:disable:indent



interface BaseType {
	_exists: boolean;
	_namespace: string;
	_sequence: Array<string>;
}
interface _BenefitApplicantType extends ct.BasicInfoType {
	uuid: string;
	financials: FinancialsType;
	mailingAddress: ct.AddressType;
	phn: number;
	powerOfAttorney: ct.YesOrNoType;
	//residenceAddress?: ct.AddressType;  // not used
	SIN: number;
	telephone: number;
}
export interface BenefitApplicantType extends _BenefitApplicantType { constructor: { new(): BenefitApplicantType }; }
export let BenefitApplicantType: { new(): BenefitApplicantType };

export class BenefitApplicantTypeFactory {
	static make(): BenefitApplicantType {
		const instance = <BenefitApplicantType>{};
		/*instance._sequence = ['benefitApplication','applicant', 'spouse', 'authorizedByApplicant', 'authorizedByApplicantDate',
			'authorizedBySpouse'];*/
		return instance;
	}
}

interface BenefitApplicationBody {
	applicantFirstName: string;
	applicantSecondName: string;
	applicantLastName: string;

	applicantBirthDate: string; //datestring
	applicantPHN: string;
	applicantSIN: string;
	applicantAddressLine1: string;
	applicantCity: string;
	applicantProvinceOrState: string;
	applicantCountry: string;
	applicantPostalCode: string;
	applicantTelephone: string;
	authorizedByApplicant: ct.YesOrNoType;
	authorizedByApplicantDate: string; //'09-10-2018',
	powerOfAttorney: ct.YesOrNoType;
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
	// TODO - NOT SURE IF NECESSARY. Not in Example from Jing, but could
	// just be that example. authorizedBySpouse?: ct.YesOrNoType		
}

// tslint:disable-next-line:class-name
interface _BenefitApplicationType {
// TODO - Verify removing baseType okay. Removes 'sequence' necessary for ordering... xml only?
	// interface _BenefitApplicationType extends BaseType {
	supplementaryBenefitsApplication: BenefitApplicationBody;
	uuid: string;
	// TODO
	attachments: any;
	// 'supplementaryBenefitsApplication': {
	// 	applicantFirstName: string;
	// 	applicantSecondName: string;
	// 	applicantLastName: string;

	// 	applicantPHN: string,
	// 	applicantSIN: string,
	// 	applicantAddressLine1: string,
	// 	applicantCity: string
    //     applicantProvinceOrState: string
    //     applicantCountry: string
    //     applicantPostalCode: string
    //     applicantTelephone: string
    //     authorizedByApplicant: ct.YesOrNoType
    //     authorizedByApplicantDate: string //'09-10-2018',
	// 	powerOfAttorney: ct.YesOrNoType,
    //     assistanceYear: string
    //     taxYear: string
    //     numberOfTaxYears: number
    //     adjustedNetIncome: number
    //     childDeduction: number
    //     deductions: number
    //     disabilityDeduction: number
    //     sixtyFiveDeduction: number
    //     totalDeductions: number
    //     totalNetIncome: number
    //     childCareExpense: number
    //     netIncomeLastYear: number
    //     numChildren: number
    //     numDisabled: number
    //     spouseIncomeLine236: number
    //     reportedUCCBenefit: number
    //     spouseDSPAmount: number
	// 	spouseDeduction: number
	// 	// TODO - NOT SURE IF NECESSARY. Not in Example from Jing, but could
	// 	// just be that example. authorizedBySpouse?: ct.YesOrNoType		
	// };

	// applicationType: string;

	// TODO - Can we remove below? 

	attachmentUuids?: ct.AttachmentUuidsType;
	// applicant: BenefitApplicantType;
	// authorizedByApplicant: ct.YesOrNoType;
	// authorizedByApplicantDate: string;
	// authorizedBySpouse?: ct.YesOrNoType;
	// spouse?: BenefitSpouseType;
	// financials: FinancialsType;
	// attachments: Array<at.AttachmentType>;
	// mailingAddress: ct.AddressType;
	// phn: number;
	// powerOfAttorney: ct.YesOrNoType;
	// SIN: number;
	// telephone: number;
	// birthDate: string;
	// name: ct.NameType;
	// applicationUuid: string;
	// applicantGender: string;
	// applicantBirthdate: string;
	// applicantPHN: number;
	// applicantSIN: number;
	// applicantAddressLine1: string;
	// applicantAddressLine2: string;
	// applicantAddressLine3: string;
	// applicantCity: string;
	// applicantProvinceOrState: string;
	// applicantCountry: string;
	// applicantPostalCode: string;
	// applicantTelephone: number;
	// assistanceYear: string;
	// taxYear: number;
	// numberOfTaxYears: number;
	// adjustedNetIncome: number;
	// childDeduction: number;
	// deductions: number;
	// disabilityDeduction: number;
	// sixtyFiveDeduction: number;
	// totalDeductions: number;
	// totalNetIncome: number;
	// childCareExpense: number;
	// netIncomeLastYear: number;
	// numChildren: number;
	// numDisabled: number;
	// spouseIncomeLine236: number;
	// reportedUCCBenefit: number;
	// spouseDSPAmount: number;
	// spouseDeduction: number;
	// spouseFirstName: string;
	// spouseSecondName: string;
	// spouseLastName: string;
	// spouseBirthdate: string;
	// spousePHN: number;
	// spouseSIN: number;
	// spouseSixtyFiveDeduction: number;
}
// export interface BenefitApplicationType extends _BenefitApplicationType { constructor: { new(): BenefitApplicationType }; }
// TODO _ try removing the constructor requrirement by enabling below line
export interface BenefitApplicationType extends _BenefitApplicationType { }

export let BenefitApplicationType: { new(): BenefitApplicationType };


export class BenefitApplicationTypeFactory {
	static make(): BenefitApplicationType {
		const instance = <BenefitApplicationType>{};
		return instance;
	}
}

interface _BenefitSpouseType extends BaseType {
	name: ct.NameType;
	birthDate?: string;
	phn?: number;
	SIN?: number;
	spouseDeduction?: number;
	spouseSixtyFiveDeduction?: number;
}
export interface BenefitSpouseType extends _BenefitSpouseType { constructor: { new(): BenefitSpouseType }; }
export let BenefitSpouseType: { new(): BenefitSpouseType };

export class BenefitSpouseTypeFactory {
	static make(): BenefitSpouseType {
		const instance = <BenefitSpouseType>{};
		/*instance._sequence = ['name', 'birthDate', 'phn', 'SIN', 'spouseDeduction',
			'spouseSixtyFiveDeduction'];*/
		return instance;
	}
}

export type BenefitYearType = ('CurrentPA' | 'PreviousTwo' | 'MultiYear');
interface _BenefitYearType extends Primitive._string { content: BenefitYearType; }

interface _FinancialsType extends BaseType {
	adjustedNetIncome?: number;
	//BenefitYear: BenefitYearType;
	childCareExpense?: number;
	childDeduction?: number;
	deductions?: number;
	disabilityDeduction?: number;
	disabilitySavingsPlan?: number;
	netIncome: number;
	numberOfTaxYears?: number;
	numChildren?: number;
	numDisabled?: number;
	sixtyFiveDeduction?: number;
	spouseNetIncome?: number;
	taxYear: number;
	totalDeductions?: number;
	totalNetIncome?: number;
	uccb?: number;
}
export interface FinancialsType extends _FinancialsType { constructor: { new(): FinancialsType }; }
export let FinancialsType: { new(): FinancialsType };

export class FinancialsTypeFactory {
	static make(): FinancialsType {
		const instance = <FinancialsType>{};
		/*instance._sequence = ['taxYear', 'numberOfTaxYears', 'netIncome', 'spouseNetIncome',
			'totalNetIncome', 'sixtyFiveDeduction', 'numChildren', 'childDeduction', 'childCareExpense', 'deductions',
			'uccb', 'numDisabled', 'disabilityDeduction', 'disabilitySavingsPlan', 'totalDeductions', 'adjustedNetIncome'];*/
		return instance;
	}
}

export interface document extends BaseType {
	BenefitApplication: BenefitApplicationType;
}
export let document: document;

export class DocumentFactory {
	static make(): document {
		const instance = <document>{};
		//instance._sequence = ['BenefitApplication'];
		return instance;
	}
}


