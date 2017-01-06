import * as Primitive from './xml-primitives';
import * as ct from './commonTypes';

// Source files:
// https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd-flat/EnrolmentTypes.xsd


interface BaseType {
	_exists: boolean;
	_namespace: string;
}
interface _DependentType extends _PersonType {
	dateStudiesFinish: Date;
	departDateSchoolOutside?: Date;
	schoolAddress: string;
	schoolName: string;
}
export interface DependentType extends _DependentType { constructor: { new(): DependentType }; }
export var DependentType: { new(): DependentType };

interface _EnrolmentApplicantType extends ct._BasicInfoType {
	authorizedByApplicant: ct.YesOrNoType;
	authorizedByApplicantDate: Date;
	authorizedBySpouse: ct.YesOrNoType;
	authorizedBySpouseDate: Date;
	mailingAddress?: ct.AddressType;
	residenceAddress: ct.AddressType;
	residency: ResidencyType;
	telephone: number;
}
export interface EnrolmentApplicantType extends _EnrolmentApplicantType { constructor: { new(): EnrolmentApplicantType }; }
export var EnrolmentApplicantType: { new(): EnrolmentApplicantType };

interface _EnrolmentApplicationType extends BaseType {
	applicant: EnrolmentApplicantType;
	children?: EnrolmentChildrenType;
	dependents?: EnrolmentDependentsType;
	spouse?: PersonType;
}
export interface EnrolmentApplicationType extends _EnrolmentApplicationType { constructor: { new(): EnrolmentApplicationType }; }
export var EnrolmentApplicationType: { new(): EnrolmentApplicationType };

interface _EnrolmentChildrenType extends BaseType {
	child: PersonType[];
}
export interface EnrolmentChildrenType extends _EnrolmentChildrenType { constructor: { new(): EnrolmentChildrenType }; }
export var EnrolmentChildrenType: { new(): EnrolmentChildrenType };

interface _EnrolmentDependentsType extends BaseType {
	dependent: DependentType[];
}
export interface EnrolmentDependentsType extends _EnrolmentDependentsType { constructor: { new(): EnrolmentDependentsType }; }
export var EnrolmentDependentsType: { new(): EnrolmentDependentsType };

interface _LivedInBCType extends BaseType {
	hasLivedInBC: ct.YesOrNoType;
	isPermanentMove?: ct.YesOrNoType;
	prevHealthNumber?: string;
	prevProvinceOrCountry?: string;
	recentBCMoveDate?: Date;
	recentCanadaMoveDate?: Date;
}
export interface LivedInBCType extends _LivedInBCType { constructor: { new(): LivedInBCType }; }
export var LivedInBCType: { new(): LivedInBCType };

interface _OutsideBCType extends BaseType {
	beenOutsideBCMoreThan: ct.YesOrNoType;
	departureDate?: Date;
	familyMemberReason?: string;
	returnDate?: Date;
}
export interface OutsideBCType extends _OutsideBCType { constructor: { new(): OutsideBCType }; }
export var OutsideBCType: { new(): OutsideBCType };

interface _PersonType extends ct._BasicInfoType {
	residency: ResidencyType;
}
export interface PersonType extends _PersonType { constructor: { new(): PersonType }; }
export var PersonType: { new(): PersonType };

interface _PreviousCoverageType extends BaseType {
	hasPreviousCoverage: ct.YesOrNoType;
	prevPHN?: number;
}
export interface PreviousCoverageType extends _PreviousCoverageType { constructor: { new(): PreviousCoverageType }; }
export var PreviousCoverageType: { new(): PreviousCoverageType };

interface _ResidencyType extends BaseType {
	citizenshipStatus: ct.BasicCitizenshipType;
	livedInBC: LivedInBCType;
	outsideBC: OutsideBCType;
	previousCoverage: PreviousCoverageType;
	willBeAway: WillBeAwayType;
}
export interface ResidencyType extends _ResidencyType { constructor: { new(): ResidencyType }; }
export var ResidencyType: { new(): ResidencyType };

interface _WillBeAwayType extends BaseType {
	armedDischageDate?: Date;
	isFullTimeStudent: ct.YesOrNoType;
	isInBCafterStudies?: ct.YesOrNoType;
	willBeAway: ct.YesOrNoType;
}
export interface WillBeAwayType extends _WillBeAwayType { constructor: { new(): WillBeAwayType }; }
export var WillBeAwayType: { new(): WillBeAwayType };

export interface document extends BaseType {
	enrolmentApplication: EnrolmentApplicationType;
}
export var document: document;
