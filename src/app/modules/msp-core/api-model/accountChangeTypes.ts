import * as Primitive from './xml-primitives';
import * as ct from './commonTypes';
import * as et from './enrolmentTypes';
import {BasicInfoTypeFactory} from './commonTypes';
import {EnrolmentApplicantType} from './enrolmentTypes';

// BaseType
interface BaseType {
	_exists: boolean;
	_namespace: string;
	_sequence: Array<string>;
}

// accountChangeAccountHolderType
interface _AccountChangeAccountHolderType extends ct._BasicInfoType {
	name: ct.NameType;
	gender: ct.GenderType;
	birthDate: string;
	attachmentUuids: ct.AttachmentUuidsType;
    phn: ct.PrevHealthNumberType;
    telephone: number;
    residenceAddress: ct.AddressType;
    mailingAddress?: ct.AddressType;
    citizenship?: ct.CitizenshipType;
    authorizedByApplicant: ct.YesOrNoType;
    authorizedByApplicantDate: string;
    authorizedBySpouse?: ct.YesOrNoType;
	selectedAddressChange: ct.YesOrNoType;
	selectedPersonalInfoChange: ct.YesOrNoType;
	selectedAddRemove: ct.YesOrNoType;
	selectedStatusChange: ct.YesOrNoType;
}
export interface AccountChangeAccountHolderType extends _AccountChangeAccountHolderType { constructor: { new(): AccountChangeAccountHolderType }; }

export let AccountChangeAccountHolderType: { new(): AccountChangeAccountHolderType };

export class AccountChangeAccountHolderFactory {
	static make(): AccountChangeAccountHolderType {
		const instance = <AccountChangeAccountHolderType>{};
        instance._sequence = ['name', 'gender', 'birthDate', 'attachmentUuids', 'phn', 'telephone', 'residenceAddress', 'mailingAddress', 'citizenship', 'authorizedByApplicant',
            'authorizedByApplicantDate', 'authorizedBySpouse', 'selectedAddressChange', 'selectedPersonalInfoChange', 'selectedAddRemove', 'selectedStatusChange'];
		return instance;
	}
}

// AccountChangeApplication
interface _AccountChangeApplicationType extends BaseType {
	accountHolder: AccountChangeAccountHolderType;
	spouses?: AccountChangeSpousesType;
	children?: AccountChangeChildrenType;
}
export interface AccountChangeApplicationType extends _AccountChangeApplicationType { constructor: { new(): AccountChangeApplicationType }; }

export let AccountChangeApplicationType: { new(): AccountChangeApplicationType };

export class AccountChangeApplicationTypeFactory {
	static make(): AccountChangeApplicationType {
		const instance = <AccountChangeApplicationType>{};
		instance._sequence = ['accountHolder', 'spouses', 'children'];
		return instance;
	}
}

// AccountChangeSpouses
interface _AccountChangeSpousesType extends BaseType {
    removedSpouse?: AccountChangeSpouseType;
    addedSpouse?: AccountChangeSpouseType;
    updatedSpouse?: AccountChangeSpouseType;
}
export interface AccountChangeSpousesType extends _AccountChangeSpousesType { constructor: { new(): AccountChangeSpousesType }; }

export let AccountChangeSpousesType: { new(): AccountChangeSpousesType };

export class AccountChangeSpousesTypeFactory {
    static make(): AccountChangeSpousesType {
        const instance = <AccountChangeSpousesType>{};
        instance._sequence = ['removedSpouse', 'addedSpouse', 'updatedSpouse'];
        return instance;
    }
}

// Spouse
interface _AccountChangeSpouseType extends ct._BasicInfoType {
	citizenship?: ct.CitizenshipType;
	isExistingBeneficiary?: ct.YesOrNoType;
	previousCoverage?: et.PreviousCoverageType;
	livedInBC?: et.LivedInBCType;
	outsideBC?: et.OutsideBCType;
	outsideBCinFuture?: et.OutsideBCType;
	willBeAway?: et.WillBeAwayType;
    previousLastName?: ct.SubNameType;
    mailingAddress?: ct.AddressType;
    marriageDate?: string;
    phn?: ct.PHNType;
    cancellationReason?: CancellationReasonType;
    cancellationDate?: string;
}
export interface AccountChangeSpouseType extends _AccountChangeSpouseType { constructor: { new(): AccountChangeSpouseType }; }

export let AccountChangeSpouseType: { new(): AccountChangeSpouseType };

export class AccountChangeSpouseTypeFactory {
    static make(): AccountChangeSpouseType {
        const instance = <AccountChangeSpouseType>{};
        instance._sequence = ['name', 'gender', 'birthDate', 'attachmentUuids',
			'citizenship', 'isExistingBeneficiary', 'previousCoverage', 'livedInBC', 'outsideBC', 'outsideBCinFuture', 'willBeAway',
			'previousLastName', 'mailingAddress', 'marriageDate', 'phn', 'cancellationReason', 'cancellationDate'];
        return instance;
    }
}

// CancellationReason
export type CancellationReasonType = string;
type _CancellationReasonType = Primitive._string;

// AccountChangeChildren
interface _AccountChangeChildrenType extends BaseType {
    child: AccountChangeChildType[];
}
export interface AccountChangeChildrenType extends _AccountChangeChildrenType { constructor: { new(): AccountChangeChildrenType }; }

export let AccountChangeChildrenType: { new(): AccountChangeChildrenType };

export class AccountChangeChildrenFactory {
    static make(): AccountChangeChildrenType {
        const instance = <AccountChangeChildrenType>{};
        instance._sequence = ['child'];
        return instance;
    }
}

// child
interface _AccountChangeChildType extends ct._BasicInfoType {
	operationAction: OperationActionType;
    citizenship?: ct.CitizenshipType;
    isExistingBeneficiary?: ct.YesOrNoType;
    previousCoverage?: et.PreviousCoverageType;
    livedInBC?: et.LivedInBCType;
    outsideBC?: et.OutsideBCType;
    outsideBCinFuture?: et.OutsideBCType;
    willBeAway?: et.WillBeAwayType;
    mailingAddress?: ct.AddressType;
    phn?: ct.PHNType;
    cancellationReason?: CancellationReasonType;
    cancellationDate?: string;
    adoptionDate?: string;
    schoolName?: ct.SchoolNameType;
    schoolAddress?: ct.AddressType;
    dateStudiesBegin?: string;
    dateStudiesFinish?: string;
    departDateSchoolOutside?: string;
}
export interface AccountChangeChildType extends _AccountChangeChildType { constructor: { new(): AccountChangeChildType }; }

export let AccountChangeChildType: { new(): AccountChangeChildType };

export class AccountChangeChildTypeFactory {
    static make(): AccountChangeChildType {
        const instance = <AccountChangeChildType>{};
        instance._sequence = ['name', 'gender', 'birthDate', 'attachmentUuids', 'operationAction',
            'citizenship', 'isExistingBeneficiary', 'previousCoverage', 'livedInBC', 'outsideBC', 'outsideBCinFuture', 'willBeAway',
            'mailingAddress', 'phn', 'cancellationReason', 'cancellationDate', 'adoptionDate', 'schoolName', 'schoolAddress',
            'dateStudiesBegin', 'dateStudiesFinish', 'departDateSchoolOutside'];
        return instance;
    }
}

// operationType
export type OperationActionType = ('Add' | 'Remove' | 'Update');
interface _OperationActionType extends Primitive._string { content: OperationActionType; }

// livedInBC
interface _LivedInBCType extends BaseType {
	hasLivedInBC: ct.YesOrNoType;
	isPermanentMove?: ct.YesOrNoType;
	prevHealthNumber?: string;
	prevProvinceOrCountry?: string;
	recentBCMoveDate?: string;
	recentCanadaMoveDate?: string;
}
export interface LivedInBCType extends _LivedInBCType { constructor: { new(): LivedInBCType }; }

export let LivedInBCType: { new(): LivedInBCType };

export class LivedInBCTypeFactory {
	static make(): LivedInBCType {
		const instance = <LivedInBCType>{};
		instance._sequence = ['hasLivedInBC', 'recentBCMoveDate', 'recentCanadaMoveDate', 'isPermanentMove',
			'prevProvinceOrCountry', 'prevHealthNumber'];
		return instance;
	}
}

// outsideBC
interface _OutsideBCType extends BaseType {
	beenOutsideBCMoreThan: ct.YesOrNoType;
	departureDate?: string;
	familyMemberReason?: string;
	returnDate?: string;
	destination?: string;
}
export interface OutsideBCType extends _OutsideBCType { constructor: { new(): OutsideBCType }; }

export let OutsideBCType: { new(): OutsideBCType };

export class OutsideBCTypeFactory {
	static make(): OutsideBCType {
		const instance = <OutsideBCType>{};
		instance._sequence = ['beenOutsideBCMoreThan', 'departureDate', 'returnDate', 'familyMemberReason', 'destination'];
		return instance;
	}
}

// previousCoverage
interface _PreviousCoverageType extends BaseType {
	hasPreviousCoverage: ct.YesOrNoType;
	prevPHN?: number;
}
export interface PreviousCoverageType extends _PreviousCoverageType { constructor: { new(): PreviousCoverageType }; }

export let PreviousCoverageType: { new(): PreviousCoverageType };

export class PreviousCoverageTypeFactory {
	static make(): PreviousCoverageType {
		const instance = <PreviousCoverageType>{};
		instance._sequence = ['hasPreviousCoverage', 'prevPHN'];
		return instance;
	}
}

// willBeAway
interface _WillBeAwayType extends BaseType {
	armedDischargeDate?: string;
	armedForceInstitutionName?: string;
	isFullTimeStudent: ct.YesOrNoType;
	isInBCafterStudies?: ct.YesOrNoType;
}
export interface WillBeAwayType extends _WillBeAwayType { constructor: { new(): WillBeAwayType }; }

export let WillBeAwayType: { new(): WillBeAwayType };

export class WillBeAwayTypeFactory {
	static make(): WillBeAwayType {
		const instance = <WillBeAwayType>{};
		instance._sequence = ['isFullTimeStudent', 'isInBCafterStudies', 'armedDischargeDate', 'armedForceInstitutionName'];
		return instance;
	}
}

// this document : accountChangeApplication
export interface document extends BaseType {
	accountChangeApplication: AccountChangeApplicationType;
}
export let document: document;

export class DocumentTypeFactory {
	static make(): document {
		const instance = <document>{};
		instance._sequence = ['accountChangeApplication'];
		return instance;
	}
}

export type CitizenshipType = ('CanadianCitizen' | 'PermanentResident' | 'WorkPermit' | 'StudyPermit' | 'Diplomat' | 'ReligiousWorker' | 'VisitorPermit');
interface _CitizenshipType extends Primitive._string { content: CitizenshipType; }
