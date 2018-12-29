import * as Primitive from './xml-primitives';
import * as ct from './commonTypes';

interface BaseType {
	_exists: boolean;
	_namespace: string;
	_sequence: Array<string>;
}

export interface AccountLetterType extends _AccountLetterType { constructor: { new(): AccountLetterType }; }
export let AccountLetterType: { new(): AccountLetterType };

export class AccountLetterApplicantTypeFactory {
	static make(): AccountLetterType {
		const instance = <AccountLetterType>{};
		instance._sequence = ['RequesterPHN', 'RequesterBirthdate', 'RequesterPostalCode', 'LetterSelection', 'SpecificPHN',
			'AclTransactionId', 'Valid', 'ErrorCode', 'ErrorMessage'];
		return instance;
	}
}

interface _AccountLetterType extends BaseType {
	RequesterPHN: string;
    RequesterBirthdate: string;
	RequesterPostalCode: string;
	LetterSelection: string;
	SpecificPHN: string;
	AclTransactionId: string;
	Valid: string;
	ErrorCode: string;
	ErrorMessage: string;
}

/*
export class AssistanceApplicationTypeFactory {
	static make(): AssistanceApplicationType {
		const instance = <AssistanceApplicationType>{};
		instance._sequence = ['applicant', 'spouse', 'authorizedByApplicant', 'authorizedByApplicantDate',
			'authorizedBySpouse'];
		return instance;
	}
}
*/


/*
interface _FinancialsType extends BaseType {
	adjustedNetIncome?: number;
	assistanceYear: AssistanceYearType;
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
		instance._sequence = ['taxYear', 'assistanceYear', 'numberOfTaxYears', 'netIncome', 'spouseNetIncome',
			'totalNetIncome', 'sixtyFiveDeduction', 'numChildren', 'childDeduction', 'childCareExpense', 'deductions',
			'uccb', 'numDisabled', 'disabilityDeduction', 'disabilitySavingsPlan', 'totalDeductions', 'adjustedNetIncome'];
		return instance;
	}
}

export interface document extends BaseType {
	assistanceApplication: AssistanceApplicationType;
}

export let document: document;

export class DocumentFactory {
	static make(): document {
		const instance = <document>{};
		instance._sequence = ['assistanceApplication'];
		return instance;
	}
}
*/