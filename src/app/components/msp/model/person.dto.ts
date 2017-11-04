import {MspImage} from './msp-image';
import AddressDto from './address.dto';
import {OutofBCRecordDto} from './outof-bc-record.dto';
import { SimpleDate } from '../model/simple-date.interface';

export default class PersonDto {
    relationship: number;
    firstName: string;
    middleName: string;
    lastName: string;

    dob_day: number;
    dob_month: number;
    dob_year: number;
    sin: string;

    arrivalToCanadaYear: number;
    arrivalToCanadaMonth: number;
    arrivalToCanadaDay: number;
    arrivalToBCYear: number;
    arrivalToBCMonth: number;
    arrivalToBCDay: number;

    movedFromProvinceOrCountry: string;
    institutionWorkHistory: string;

    dischargeYear: number;
    dischargeMonth: number;
    dischargeDay: number;

    status: number;
    currentActivity: number;
    healthNumberFromOtherProvince: string;

    previous_phn: string;
    gender: number;

    liveInBC: boolean;
    livedInBCSinceBirth: boolean;
    hasPreviousBCPhn: boolean;

    madePermanentMoveToBC: boolean;
    plannedAbsence: boolean;
    id: string

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
    cancellationDate:SimpleDate;

    images: MspImage[];

    fullTimeStudent: boolean;
    inBCafterStudies: boolean;

    schoolName: string;

    schoolAddress: AddressDto = new AddressDto();

    studiesFinishedYear: number;
    studiesFinishedMonth: number;
    studiesFinishedDay: number;

    studiesDepartureYear: number;
    studiesDepartureMonth: number;
    studiesDepartureDay: number;

    declarationForOutsideOver30Days: boolean;

    outOfBCRecord: OutofBCRecordDto;
}