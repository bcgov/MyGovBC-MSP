import AddressDto from './address.dto';
import {OutofBCRecordDto} from '../../../models/outof-bc-record.dto';
import { MSPEnrollementMember, CancellationReasons} from '../../../models/status-activities-documents';
import { PersonStatusChange } from './person-status-change';
/*import {
    StatusRules,
    ActivitiesRules,
    StatusInCanada,
    Activities,
    DocumentRules,
    Documents
  } from '../../../models/status-activities-documents';*/
//import { SimpleDate , CommonImage } from 'moh-common-lib';
import { SimpleDate, Address, BRITISH_COLUMBIA, CANADA, CommonImage } from 'moh-common-lib';
import { PersonDocuments } from './person-document.model';


// TODO: Class makes reference to self within definition - This should be reviewed
export default class PersonDto {
    relationship: number;
    firstName: string;
    middleName: string;
    lastName: string;

  

    previouslastName: string;

    dob_day: number;
    dob_month: number;
    dob_year: number;
    immigrationStatusChange: boolean;

    updatingPersonalInfo: boolean;

    isRemovedAtTheEndOfCurrentMonth: boolean;

    hasActiveMedicalServicePlan: boolean;

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

    cancellationReason: CancellationReasons;

    previous_phn: string;
    specificMember_phn: string;
    enrollmentMember: MSPEnrollementMember ;

    hasCurrentMailingAddress: boolean;

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
    marriageDate: SimpleDate = { day: null, month: null, year: null };
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
    declarationForOutsideOver60Days: boolean;
    departureReason: string;
    departureDestination: string;
    departureDate: SimpleDate = { day: null, month: null, year: null };
    returnDate: SimpleDate = { day: null, month: null, year: null };

    newlyAdopted: boolean;
    adoptedDate: SimpleDate;

    outOfBCRecord: OutofBCRecordDto;
    planOnBeingOutOfBCRecord: OutofBCRecordDto;


    schoolOutsideOfBC: boolean;

    // New Update Status
    statusChange: PersonStatusChange;

    updateNameDueToMarriage: boolean;
    updateNameDueToMarriageDocType: PersonDocuments = new PersonDocuments();
    updateNameDueDoc: CommonImage[] = [];

    removedSpouseDueToDivorceDoc: PersonDocuments = new PersonDocuments();

    updateNameDueToError: boolean;
    updateNameDueToErrorDocType: PersonDocuments = new PersonDocuments();
    updateNameDueToErrorDoc: CommonImage[] = [];

    updateBirthdate: boolean;
    updateBirthdateDocType:  PersonDocuments = new PersonDocuments();
    updateBirthdateDoc: CommonImage[] = [];

    updateGender: boolean;
    updateGenderDocType: PersonDocuments = new PersonDocuments();
    updateGenderDoc: CommonImage[] = [];

    updateGenderDesignation: boolean;
    updateGenderDesignationDocType: PersonDocuments = new PersonDocuments();
    updateGenderDesignationDoc: CommonImage[] = [];

    updateStatusInCanada: boolean;
    updateStatusInCanadaDoc: CommonImage[];
    updateStatusInCanadaDocType: PersonDocuments = new PersonDocuments();
    
    nameChangeDocs: PersonDocuments = new PersonDocuments();

}
