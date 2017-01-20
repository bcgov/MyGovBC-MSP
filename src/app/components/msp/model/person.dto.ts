import { MspImage } from './msp-image';
import AddressDto from './address.dto';

export default class PersonDto {
  relationship:number;
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
  
  movedFromProvince:string;
  institutionWorkHistory:string;

  dischargeYear: number;
  dischargeMonth: number;
  dischargeDay: number;

  status:number;
  currentActivity:number;
  healthNumberFromOtherProvince:string;
  previous_phn: string;
  gender: number;
  
  liveInBC:boolean;
  livedInBCSinceBirth:boolean;
  hasPreviousBCPhn: boolean;

  stayForSixMonthsOrLonger:boolean;
  plannedAbsence:boolean;
  uncommonSituation:boolean;
  id:string

  spouse:PersonDto;

  children: PersonDto[] = [];
  images: MspImage[];

  schoolName: string;
  
  schoolAddress: AddressDto = new AddressDto();

  studiesFinishedYear: number;
  studiesFinishedMonth: number;
  studiesFinishedDay: number;

  studiesDepartureYear: number;
  studiesDepartureMonth: number;
  studiesDepartureDay: number;

  outsideBC: boolean = false;
  outsideBCDepartureDateYear: number;
  outsideBCDepartureDateMonth: number;
  outsideBCDepartureDateDay: number;
  outsideBCReturnDateYear: number;
  outsideBCReturnDateMonth: number;
  outsideBCReturnDateDay: number;
  outsideBCFamilyMemberReason: string;
}