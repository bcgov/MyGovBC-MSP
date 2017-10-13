import * as Primitive from './xml-primitives';
import * as ct from './commonTypes';
import * as et from './enrolmentTypes';
import {BasicInfoTypeFactory} from "./commonTypes";
import {EnrolmentApplicantType} from "./enrolmentTypes";

// BaseType
interface BaseType {
	_exists: boolean;
	_namespace: string;
	_sequence:Array<string>;
}

// accountChangeAccountHolderType
interface _AccountChangeAccountHolderType extends ct._BasicInfoType {
    phn: ct.PHNType;
    telephone: number;
    mailingAddress?: ct.AddressType;
    residenceAddress: ct.AddressType;
    citizenshipStatus?: ct.BasicCitizenshipType;
    authorizedByApplicant: ct.YesOrNoType;
    authorizedByApplicantDate: string;
	selectedAddressChange: ct.YesOrNoType;
	selectedPersonalInfoChange: ct.YesOrNoType;
	selectedAddRemove: ct.YesOrNoType;
	selectedStatusChange: ct.YesOrNoType;

}
export interface AccountChangeAccountHolderType extends _AccountChangeAccountHolderType { constructor: { new(): AccountChangeAccountHolderType }; }

export var AccountChangeAccountHolderType: { new(): AccountChangeAccountHolderType };

export class AccountChangeAccountHolderFactory {
	static make(): AccountChangeAccountHolderType {
		let instance = <AccountChangeAccountHolderType>{};
        instance._sequence = ["name", "gender", "birthDate", "attachmentUuids", "phn", "telephone", "residenceAddress", "mailingAddress", "citizenshipStatus", "authorizedByApplicant",
            "authorizedByApplicantDate", "selectedAddressChange", "selectedPersonalInfoChange", "selectedAddRemove", "selectedStatusChange", "phn"]
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

export var AccountChangeApplicationType: { new(): AccountChangeApplicationType };

export class AccountChangeApplicationTypeFactory {
	static make(): AccountChangeApplicationType {
		let instance = <AccountChangeApplicationType>{};
		instance._sequence = ["accountHolder", "spouses", "children"]
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

export var AccountChangeSpousesType: { new(): AccountChangeSpousesType };

export class AccountChangeSpousesTypeFactory {
    static make(): AccountChangeSpousesType {
        let instance = <AccountChangeSpousesType>{};
        instance._sequence = ["removedSpouse", "addedSpouse", "updatedSpouse"]
        return instance;
    }
}

// Spouse
interface _AccountChangeSpouseType extends ct._BasicInfoType {
    residency?: et.ResidencyType;
    previousLastName?: ct.SubNameType;
    mailingAddress?: ct.AddressType;
    marriageDate?: string;
    phn?: ct.PHNType;
    cancellationReason?: CancellationReasonType;
    cancellationDate?: string;
    authorizedBySpouse?: ct.YesOrNoType;
}
export interface AccountChangeSpouseType extends _AccountChangeSpouseType { constructor: { new(): AccountChangeSpouseType }; }

export var AccountChangeSpouseType: { new(): AccountChangeSpouseType };

export class AccountChangeSpouseTypeFactory {
    static make(): AccountChangeSpouseType {
        let instance = <AccountChangeSpouseType>{};
        instance._sequence = ["name", "gender", "birthDate", "attachmentUuids", "residency",
		   "previousLastName", "mailingAddress", "marriageDate", "phn", "cancellationReason", "cancellationDate", "authorizedBySpouse"]
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

export var AccountChangeChildrenType: { new(): AccountChangeChildrenType };

export class AccountChangeChildrenFactory {
    static make(): AccountChangeChildrenType {
        let instance = <AccountChangeChildrenType>{};
        instance._sequence = ["child"]
        return instance;
    }
}

// child
interface _AccountChangeChildType extends ct._BasicInfoType {
	operationAction: OperationActionType;
    residency?: et.ResidencyType;
    mailingAddress?: ct.AddressType;
    phn?: ct.PHNType;
    cancellationReason?: CancellationReasonType;
    cancellationDate?: string;
    adoptionDate?: string;
    schoolName?: ct.SchoolNameType;
    schoolAddress?: ct.SchoolAddressType;
    dateStudiesFinish?: string;
    departDateSchoolOutside?: string;
}
export interface AccountChangeChildType extends _AccountChangeChildType { constructor: { new(): AccountChangeChildType }; }

export var AccountChangeChildType: { new(): AccountChangeChildType };

export class AccountChangeChildTypeFactory {
    static make(): AccountChangeChildType {
        let instance = <AccountChangeChildType>{};
        instance._sequence = ["name", "gender", "birthDate", "attachmentUuids", "operationAction", "residency",
            "mailingAddress", "phn", "cancellationReason", "cancellationDate", "adoptionDate", "schoolName", "schoolAddress",
		    "dateStudiesFinish", "departDateSchoolOutside"]
        return instance;
    }
}

// operationType
export type OperationActionType = ("Add" | "Remove" | "Update");
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

export var LivedInBCType: { new(): LivedInBCType };

export class LivedInBCTypeFactory {
	static make(): LivedInBCType {
		let instance = <LivedInBCType>{};
		instance._sequence = ["hasLivedInBC", "recentBCMoveDate", "recentCanadaMoveDate", "isPermanentMove",
			"prevProvinceOrCountry", "prevHealthNumber"];
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

export var OutsideBCType: { new(): OutsideBCType };

export class OutsideBCTypeFactory {
	static make(): OutsideBCType {
		let instance = <OutsideBCType>{};
		instance._sequence = ["beenOutsideBCMoreThan", "departureDate", "returnDate", "familyMemberReason", "destination"];
		return instance;
	}
}

// person
interface _PersonType extends ct._BasicInfoType {
	residency: ResidencyType;
}
export interface PersonType extends _PersonType { constructor: { new(): PersonType }; }

export var PersonType: { new(): PersonType };

export class PersonTypeFactory {
	static make(): PersonType {
		let instance = <PersonType>{};
		instance._sequence = ["name", "gender", "birthDate", "attachmentUuids", "residency"];
		return instance;
	}
}

// previousCoverage
interface _PreviousCoverageType extends BaseType {
	hasPreviousCoverage: ct.YesOrNoType;
	prevPHN?: number;
}
export interface PreviousCoverageType extends _PreviousCoverageType { constructor: { new(): PreviousCoverageType }; }

export var PreviousCoverageType: { new(): PreviousCoverageType };

export class PreviousCoverageTypeFactory {
	static make(): PreviousCoverageType {
		let instance = <PreviousCoverageType>{};
		instance._sequence = ["hasPreviousCoverage", "prevPHN"];
		return instance;
	}
}

// residency
interface _ResidencyType extends BaseType {
	citizenshipStatus: ct.BasicCitizenshipType;
	livedInBC: LivedInBCType;
	outsideBC: OutsideBCType;
	previousCoverage: PreviousCoverageType;
	willBeAway: WillBeAwayType;
}
export interface ResidencyType extends _ResidencyType { constructor: { new(): ResidencyType }; }

export var ResidencyType: { new(): ResidencyType };

export class ResidencyTypeFactory {
	static make(): ResidencyType {
		let instance = <ResidencyType>{};
		instance._sequence = ["citizenshipStatus", "previousCoverage", "livedInBC", "outsideBC", "willBeAway"];
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

export var WillBeAwayType: { new(): WillBeAwayType };

export class WillBeAwayTypeFactory {
	static make(): WillBeAwayType {
		let instance = <WillBeAwayType>{};
		instance._sequence = ["isFullTimeStudent", "isInBCafterStudies", "armedDischargeDate", "armedForceInstitutionName"]
		return instance;
	}
}

// this document : accountChangeApplication
export interface document extends BaseType {
	accountChangeApplication: AccountChangeApplicationType;
}
export var document: document;

export class DocumentTypeFactory {
	static make(): document {
		let instance = <document>{};
		instance._sequence = ["accountChangeApplication"]
		return instance;
	}
}