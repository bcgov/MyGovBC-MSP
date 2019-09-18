import AddressDto from './address.dto';
import {OutofBCRecordDto} from '../../../models/outof-bc-record.dto';
import {MSPEnrollementMember} from '../../../models/status-activities-documents';
import { PersonStatusChange } from './person-status-change';
import {
    StatusRules,
    ActivitiesRules,
    StatusInCanada,
    Activities,
    DocumentRules,
    Documents
  } from '../../../models/status-activities-documents';
  import { SimpleDate, Address, BRITISH_COLUMBIA, CANADA, CommonImage } from 'moh-common-lib';


// TODO: Class makes reference to self within definition - This should be reviewed
export default class PersonDto {
    relationship: number;
    firstName: string;
    middleName: string;
    lastName: string;

    dob_day: number;
    dob_month: number;
    dob_year: number;

    dateOfBirth: SimpleDate;

    sin: string;
    assistYearDocs: CommonImage[]; //= [];

    arrivalToCanadaYear: number;
    arrivalToCanadaMonth: number;
    arrivalToCanadaDay: number;
    arrivalToBCYear: number;
    arrivalToBCMonth: number;
    arrivalToBCDay: number;
    hasBeenReleasedFromArmedForces: boolean;
    movedFromProvinceOrCountry: string;
    institutionWorkHistory: string;
    nameOfInstitute: string;
    dischargeYear: number;
    dischargeMonth: number;
    dischargeDay: number;

    status: number;
    docType: number;
    currentActivity: number;
    healthNumberFromOtherProvince: string;

    previous_phn: string;
    specificMember_phn: string;
    enrollmentMember: MSPEnrollementMember ;

    gender: number;

    liveInBC: boolean;
    livedInBCSinceBirth: boolean;
    hasPreviousBCPhn: boolean;

    madePermanentMoveToBC: boolean;
    plannedAbsence: boolean;
    id: string;

    spouse: PersonDto;

    // three kind of spouses can be there for Account Change.. remove ,update ,add
    removedSpouse?: PersonDto;
    addedSpouse?: PersonDto;
    updatedSpouse?: PersonDto;


    children: PersonDto[] = [];

    addedChildren: PersonDto[] = [];
    removedChildren: PersonDto[] = [];
    updatedChildren: PersonDto[] = [];

    reasonForCancellation: string;
    cancellationDate: SimpleDate;
    marriageDate: SimpleDate;
    prevLastName: string;
    phoneNumber: string;
    imageDocType: string;
    images: CommonImage[];
    nameChangeDocType: string;
    nameChangeImages: CommonImage[];
    hasNameChange: boolean;
    isExistingBeneficiary: boolean;
    knownMailingAddress: boolean;
    fullTimeStudent: boolean;
    inBCafterStudies: boolean;
    mailingAddress: AddressDto = new AddressDto();
    residentialAddress: AddressDto = new AddressDto();

    schoolName: string;

    schoolAddress: AddressDto = new AddressDto();

    studiesFinishedYear: number;
    studiesFinishedMonth: number;
    studiesFinishedDay: number;

    studiesBeginYear: number;
    studiesBeginMonth: number;
    studiesBeginDay: number;

    studiesDepartureYear: number;
    studiesDepartureMonth: number;
    studiesDepartureDay: number;

    declarationForOutsideOver30Days: boolean;

    newlyAdopted: boolean;
    adoptedDate: SimpleDate;

    outOfBCRecord: OutofBCRecordDto;
    planOnBeingOutOfBCRecord: OutofBCRecordDto;


    schoolOutsideOfBC: boolean;

    // New Update Status
    statusChange: PersonStatusChange;

    updateNameDueToMarriage: boolean;
    updateNameDueToMarriageDocType: Documents;
    updateNameDueDoc: CommonImage[] = [];

    updateNameDueToError: boolean;
    updateNameDueToErrorDocType: Documents;
    updateNameDueToErrorDoc: CommonImage[] = [];

    updateBirthdate: boolean;
    updateBirthdateDocType: Documents;
    updateBirthdateDoc: CommonImage[] = [];

    updateGender: boolean;
    updateGenderDocType: Documents;
    updateGenderDoc: CommonImage[] = [];

    updateGenderDesignation: boolean;
    updateGenderDesignationDocType: Documents;
    updateGenderDesignationDoc: CommonImage[] = [];

    updateStatusInCanada: boolean;
    updateStatusInCanadaDoc: CommonImage[];

}
