import { MspImage } from './msp-image';

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
  previous_phn: string;
  gender: number;
  
  liveInBC:boolean;
  stayForSixMonthsOrLonger:boolean;
  plannedAbsence:boolean;
  uncommonSituation:boolean;
  id:string

  spouse:PersonDto;

  children: PersonDto[] = [];
  images: MspImage[];
}