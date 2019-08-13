import * as Primitive from './xml-primitives';

// Source files:
// https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd-flat/CommonTypes.xsd


interface BaseType {
	_exists: boolean;
	_namespace: string;
	_sequence: Array<string>;
}
interface _AddressType extends BaseType {
	street: string;
	addressLine1: string;
	addressLine2?: string;
	addressLine3?: string;
	city?: string;
	country?: string;
	postalCode?: string;
	provinceOrState?: string;
}
export interface AddressType extends _AddressType { constructor: { new(): AddressType }; }
export let AddressType: { new(): AddressType };

export class AddressTypeFactory {
	static make(): AddressType {
		const instance = <AddressType>{};
		instance._sequence = ['addressLine1', 'addressLine2', 'addressLine3', 'city', 'postalCode', 'provinceOrState',
			'country'];
		return instance;
	}
}

interface _AttachmentUuidsType extends BaseType {
	attachmentUuid: string[];
}
export interface AttachmentUuidsType extends _AttachmentUuidsType { constructor: { new(): AttachmentUuidsType }; }
export let AttachmentUuidsType: { new(): AttachmentUuidsType };

export class AttachmentUuidsTypeFactory {
	static make(): AttachmentUuidsType {
		const instance = <AttachmentUuidsType>{};
		instance._sequence = ['attachmentUuid'];
		return instance;
	}
}

interface _BasicCitizenshipType extends BaseType {
	attachmentUuids: AttachmentUuidsType;
	citizenshipType: CitizenshipType;
}
export interface BasicCitizenshipType extends _BasicCitizenshipType { constructor: { new(): BasicCitizenshipType }; }
export let BasicCitizenshipType: { new(): BasicCitizenshipType };

export class BasicCitizenshipTypeFactory {
	static make(): BasicCitizenshipType {
		const instance = <BasicCitizenshipType>{};
		instance._sequence = ['citizenshipType', 'attachmentUuids'];
		return instance;
	}
}

export interface _BasicInfoType extends BaseType {
	attachmentUuids?: AttachmentUuidsType;
	birthDate: string;
	gender?: GenderType;
	name: NameType;
}
export interface BasicInfoType extends _BasicInfoType { constructor: { new(): BasicInfoType }; }
export let BasicInfoType: { new(): BasicInfoType };

export class BasicInfoTypeFactory {
	static make(): BasicInfoType {
		const instance = <BasicInfoType>{};
		instance._sequence = ['name', 'gender', 'birthDate', 'attachmentUuids'];
		return instance;
	}
}

export type CitizenshipType = ('CanadianCitizen' | 'PermanentResident' | 'WorkPermit' | 'StudyPermit' | 'Diplomat' | 'ReligiousWorker' | 'VisitorPermit');
interface _CitizenshipType extends Primitive._string { content: CitizenshipType; }

export type CityType = string;
type _CityType = Primitive._string;

export type CountryType = string;
type _CountryType = Primitive._string;

export type GenderType = ('M' | 'F');
interface _GenderType extends Primitive._string { content: GenderType; }

export type GroupNumberType = number;
type _GroupNumberType = Primitive._number;

interface _NameType extends BaseType {
	firstName: string;
	lastName: string;
	secondName?: string;
}
export interface NameType extends _NameType { constructor: { new(): NameType }; }
export let NameType: { new(): NameType };

export class NameTypeFactory {
	static make(): NameType {
		const instance = <NameType>{};
		instance._sequence = ['firstName', 'secondName', 'lastName'];
		return instance;
	}
}

export type PHNType = number;
type _PHNType = Primitive._number;

export type PostalCodeType = string;
type _PostalCodeType = Primitive._string;

export type PrevHealthNumberType = string;
type _PrevHealthNumberType = Primitive._string;

export type PrevProvinceOrCountryType = string;
type _PrevProvinceOrCountryType = Primitive._string;

export type ProvinceOrStateType = string;
type _ProvinceOrStateType = Primitive._string;

export type SchoolAddressType = string;
type _SchoolAddressType = Primitive._string;

export type InstitutionNameType = string;
type _InstitutionNameType = Primitive._string;

export type SchoolNameType = string;
type _SchoolNameType = Primitive._string;

export type SINType = number;
type _SINType = Primitive._number;

export type SubAddressLineType = string;
type _SubAddressLineType = Primitive._string;

export type SubNameType = string;
type _SubNameType = Primitive._string;

export type TelephoneType = number;
type _TelephoneType = Primitive._number;

export type YearType = number;
type _YearType = Primitive._number;

export type YesOrNoType = ('Y' | 'N');
interface _YesOrNoType extends Primitive._string { content: YesOrNoType; }

export interface document extends BaseType {
}
export let document: document;
