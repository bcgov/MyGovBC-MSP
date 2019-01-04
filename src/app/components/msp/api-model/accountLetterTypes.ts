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

