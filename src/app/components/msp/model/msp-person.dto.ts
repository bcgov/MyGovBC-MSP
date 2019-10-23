import { AddressDto } from '../../../models/address.dto';
import { OutofBCRecordDto } from '../../../models/outof-bc-record.model';
import { CancellationReasons} from '../../../models/status-activities-documents';
import { PersonStatusChange } from './person-status-change';
import { CommonImage } from 'moh-common-lib';
import { SupportDocuments } from '../../../modules/msp-core/models/support-documents.model';
import { Gender } from '../../../models/gender.enum';



// TODO: Class makes reference to self within definition - This should be reviewed
export class PersonDto {
    relationship: number;
    firstName: string;
    middleName: string;
    lastName: string;

    previouslastName: string;

    dob: Date;
    immigrationStatusChange: boolean;

    updatingPersonalInfo: boolean;

    isRemovedAtTheEndOfCurrentMonth: boolean;

    hasActiveMedicalServicePlan: boolean;

    dateOfBirth: Date;

    sin: string;
    assistYearDocs: CommonImage[]; //= [];


    arrivalToCanadaDate: Date;
    arrivalToBCDate: Date;
    departureDateDuring12MonthsDate: Date;
    departureDateDuring6MonthsDate: Date;
    returnDate12MonthsDate: Date;
    returnDate6MonthsDate: Date;

    hasBeenReleasedFromArmedForces: boolean;
    movedFromProvinceOrCountry: string;
    institutionWorkHistory: string;
    nameOfInstitute: string;
    dischargeDate: Date;

    status: number;
    docType: number;
    currentActivity: number;
    healthNumberFromOtherProvince: string;

    cancellationReason: CancellationReasons;

    previous_phn: string;
    specificMember_phn: string;
    //enrollmentMember: MSPEnrollementMember ;

    hasCurrentMailingAddress: boolean;

    gender: Gender;

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
    cancellationDate: Date;
    marriageDate: Date;

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

    studiesFinishedDate: Date;
    studiesBeginDate: Date;
    studiesDepartureDate: Date;

    declarationForOutsideOver30Days: boolean;
    declarationForOutsideOver60Days: boolean;
    departureReason: string;
    departureReason12Months: string;
    departureDestination: string;
    departureDestination12Months: string;
    departureDate: Date;
    returnDate: Date;

    newlyAdopted: boolean;
    adoptedDate: Date;

    outOfBCRecord: OutofBCRecordDto;
    planOnBeingOutOfBCRecord: OutofBCRecordDto;

    schoolOutsideOfBC: boolean;

    // New Update Status
    statusChange: PersonStatusChange;

    updateNameDueToMarriage: boolean;
    updateNameDueToMarriageDocType: SupportDocuments = new SupportDocuments();
    updateNameDueDoc: CommonImage[] = [];

    removedSpouseDueToDivorceDoc: SupportDocuments = new SupportDocuments();

    updateNameDueToError: boolean;
    updateNameDueToErrorDocType: SupportDocuments = new SupportDocuments();
    updateNameDueToErrorDoc: CommonImage[] = [];

    updateBirthdate: boolean;
    updateBirthdateDocType:  SupportDocuments = new SupportDocuments();
    updateBirthdateDoc: CommonImage[] = [];

    updateGender: boolean;
    updateGenderDocType: SupportDocuments = new SupportDocuments();
    updateGenderDoc: CommonImage[] = [];

    updateGenderDesignation: boolean;
    updateGenderDesignationDocType: SupportDocuments = new SupportDocuments();
    updateGenderDesignationDoc: CommonImage[] = [];

    updateStatusInCanada: boolean;
    updateStatusInCanadaDoc: CommonImage[];
    updateStatusInCanadaDocType: SupportDocuments = new SupportDocuments();

    nameChangeDocs: SupportDocuments = new SupportDocuments();

}
