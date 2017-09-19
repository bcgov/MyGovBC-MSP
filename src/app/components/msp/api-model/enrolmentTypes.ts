import * as Primitive from './xml-primitives';
import * as ct from './commonTypes';
import {BasicInfoTypeFactory} from "./commonTypes";

// Source files:
// https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd-flat/EnrolmentTypes.xsd


interface BaseType {
	_exists: boolean;
	_namespace: string;
	_sequence:Array<string>;
}
interface _DependentType extends _PersonType {
	dateStudiesFinish: string;
	departDateSchoolOutside?: string;
	schoolAddress: ct.AddressType;
	schoolName: string;
}
export interface DependentType extends _DependentType { constructor: { new(): DependentType }; }
export var DependentType: { new(): DependentType };

export class DependentTypeFactory {
	static make(): DependentType {
		let instance = <DependentType>{};
		instance._sequence = ["name", "gender", "birthDate", "attachmentUuids", "residency", "schoolName",
			"schoolAddress", "dateStudiesFinish", "departDateSchoolOutside"]
		return instance;
	}
}

export interface _EnrolmentApplicantType extends ct._BasicInfoType {
	authorizedByApplicant: ct.YesOrNoType;
	authorizedByApplicantDate: string;
	authorizedBySpouse?: ct.YesOrNoType;
	mailingAddress?: ct.AddressType;
	residenceAddress: ct.AddressType;
	residency: ResidencyType;
	telephone: number;
}
export interface EnrolmentApplicantType extends _EnrolmentApplicantType { constructor: { new(): EnrolmentApplicantType }; }
export var EnrolmentApplicantType: { new(): EnrolmentApplicantType };

export class EnrolmentApplicantTypeFactory {
	static make(): EnrolmentApplicantType {
		let instance = <EnrolmentApplicantType>{};
		instance._sequence = ["name", "gender", "birthDate", "attachmentUuids", "telephone", "residenceAddress", "mailingAddress", "residency", "authorizedByApplicant",
			"authorizedByApplicantDate", "authorizedBySpouse"];
		return instance;
	}
}

interface _EnrolmentApplicationType extends BaseType {
	applicant: EnrolmentApplicantType;
	children?: EnrolmentChildrenType;
	dependents?: EnrolmentDependentsType;
	spouse?: PersonType;
}
export interface EnrolmentApplicationType extends _EnrolmentApplicationType { constructor: { new(): EnrolmentApplicationType }; }
export var EnrolmentApplicationType: { new(): EnrolmentApplicationType };

export class EnrolmentApplicationTypeFactory {
	static make(): EnrolmentApplicationType {
		let instance = <EnrolmentApplicationType>{};
		instance._sequence = ["applicant", "spouse", "children", "dependents"]
		return instance;
	}
}

interface _EnrolmentChildrenType extends BaseType {
	child: PersonType[];
}
export interface EnrolmentChildrenType extends _EnrolmentChildrenType { constructor: { new(): EnrolmentChildrenType }; }
export var EnrolmentChildrenType: { new(): EnrolmentChildrenType };

export class EnrolmentChildrenTypeFactory {
	static make(): EnrolmentChildrenType {
		let instance = <EnrolmentChildrenType>{};
		instance._sequence = ["child"]
		return instance;
	}
}

interface _EnrolmentDependentsType extends BaseType {
	dependent: DependentType[];
}
export interface EnrolmentDependentsType extends _EnrolmentDependentsType { constructor: { new(): EnrolmentDependentsType }; }
export var EnrolmentDependentsType: { new(): EnrolmentDependentsType };

export class EnrolmentDependentsTypeFactory {
	static make(): EnrolmentDependentsType {
		let instance = <EnrolmentDependentsType>{};
		instance._sequence = ["dependent"];
		return instance;
	}
}

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
		instance._sequence = ["isFullTimeStudent", "isInBCafterStudies", "armedDischargeDate", "armedForceInstitutionName"];
		return instance;
	}
}

export interface document extends BaseType {
	enrolmentApplication: EnrolmentApplicationType;
}
export var document: document;

export class DocumentTypeFactory {
	static make(): document {
		let instance = <document>{};
		instance._sequence = ["enrolmentApplication"];
		return instance;
	}
}