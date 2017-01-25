import * as Primitive from './xml-primitives';
import * as ct from './commonTypes';

// Source files:
// https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd-flat/AssistanceTypes.xsd


interface BaseType {
	_exists: boolean;
	_namespace: string;
	_sequence:Array<string>
}
interface _AssistanceApplicantType extends ct.BasicInfoType {
	financials: FinancialsType;
	mailingAddress: ct.AddressType;
	phn: number;
	powerOfAttorney: ct.YesOrNoType;
	//residenceAddress?: ct.AddressType;  // not used
	SIN: number;
	telephone: number;
}
export interface AssistanceApplicantType extends _AssistanceApplicantType { constructor: { new(): AssistanceApplicantType }; }
export var AssistanceApplicantType: { new(): AssistanceApplicantType };

export class AssistanceApplicantTypeFactory {
	static make(): AssistanceApplicantType {
		let instance = <AssistanceApplicantType>{};
		instance._sequence = ["name", "gender", "birthDate", "attachmentUuids", "telephone", "residenceAddress",
			"mailingAddress", "financials", "phn","SIN","powerOfAttorney"];
		return instance;
	}
}

interface _AssistanceApplicationType extends BaseType {
	applicant: AssistanceApplicantType;
	authorizedByApplicant: ct.YesOrNoType;
	authorizedByApplicantDate: string;
	authorizedBySpouse?: ct.YesOrNoType;
	spouse?: AssistanceSpouseType;
}
export interface AssistanceApplicationType extends _AssistanceApplicationType { constructor: { new(): AssistanceApplicationType }; }
export var AssistanceApplicationType: { new(): AssistanceApplicationType };


export class AssistanceApplicationTypeFactory {
	static make(): AssistanceApplicationType {
		let instance = <AssistanceApplicationType>{};
		instance._sequence = ["applicant", "spouse", "authorizedByApplicant", "authorizedByApplicantDate",
			"authorizedBySpouse"];
		return instance;
	}
}

interface _AssistanceSpouseType extends BaseType {
	name: ct.NameType;
	phn?: number;
	SIN?: number;
	spouseDeduction?: number;
	spouseSixtyFiveDeduction?: number;
}
export interface AssistanceSpouseType extends _AssistanceSpouseType { constructor: { new(): AssistanceSpouseType }; }
export var AssistanceSpouseType: { new(): AssistanceSpouseType };

export class AssistanceSpouseTypeFactory {
	static make(): AssistanceSpouseType {
		let instance = <AssistanceSpouseType>{};
		instance._sequence = ["name", "phn", "SIN", "spouseDeduction",
			"spouseSixtyFiveDeduction"];
		return instance;
	}
}

export type AssistanceYearType = ("CurrentPA" | "PreviousTwo" | "MultiYear");
interface _AssistanceYearType extends Primitive._string { content: AssistanceYearType; }

interface _FinancialsType extends BaseType {
	adjustedNetIncome?: number;
	assistanceYear: AssistanceYearType;
	childCareExpense?: number;
	childDeduction?: number;
	deductions?: number;
	disabilityDeduction?: number;
	disabilitySavingsPlan?: number;
	netIncome: number;
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
export var FinancialsType: { new(): FinancialsType };

export class FinancialsTypeFactory {
	static make(): FinancialsType {
		let instance = <FinancialsType>{};
		instance._sequence = ["taxYear", "assistanceYear", "netIncome", "spouseNetIncome",
			"totalNetIncome", "sixtyFiveDeduction", "numChildren", "childDeduction", "childCareExpense", "deductions",
			"uccb", "numDisabled", "disabilityDeduction", "disabilitySavingsPlan", "totalDeductions", "adjustedNetIncome"];
		return instance;
	}
}

export interface document extends BaseType {
	assistanceApplication: AssistanceApplicationType;
}
export var document: document;

export class DocumentFactory {
	static make(): document {
		let instance = <document>{};
		instance._sequence = ["assistanceApplication"];
		return instance;
	}
}