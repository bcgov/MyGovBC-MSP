import * as Primitive from '../../xml-primitives';
import * as ct from './commonTypes';

// Source files:
// https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd-flat/AssistanceTypes.xsd


interface BaseType {
	_exists: boolean;
	_namespace: string;
}
interface _AssistanceApplicantType extends ct._BasicInfoType {
	financials: FinancialsType;
	mailingAddress?: ct.AddressType;
	phn: number;
	powerOfAttorny: ct.YesOrNoType;
	residenceAddress: ct.AddressType;
	SIN: number;
	telephone: number;
}
export interface AssistanceApplicantType extends _AssistanceApplicantType { constructor: { new(): AssistanceApplicantType }; }
export var AssistanceApplicantType: { new(): AssistanceApplicantType };

interface _AssistanceApplicationType extends BaseType {
	applicant: AssistanceApplicantType;
	authorizedByApplicant: ct.YesOrNoType;
	authorizedByApplicantDate: Date;
	authorizedBySpouse: ct.YesOrNoType;
	authorizedBySpouseDate: Date;
	spouse?: AssistanceSpouseType;
}
export interface AssistanceApplicationType extends _AssistanceApplicationType { constructor: { new(): AssistanceApplicationType }; }
export var AssistanceApplicationType: { new(): AssistanceApplicationType };

interface _AssistanceSpouseType extends BaseType {
	name: ct.NameType;
	phn?: number;
	SIN?: number;
	spouseDeduction?: number;
	spouseSixtyFiveDeduction?: number;
}
export interface AssistanceSpouseType extends _AssistanceSpouseType { constructor: { new(): AssistanceSpouseType }; }
export var AssistanceSpouseType: { new(): AssistanceSpouseType };

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

export interface document extends BaseType {
	assistanceApplication: AssistanceApplicationType;
}
export var document: document;
