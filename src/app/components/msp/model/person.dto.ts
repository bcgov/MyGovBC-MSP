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
  
  status:number;
  currentActivity:number;
  previous_phn: string;

  liveInBC:boolean;
  stayForSixMonthsOrLonger:boolean;
  plannedAbsence:boolean;
  uncommonSituation:boolean;
  id:string

  spouse:PersonDto;

  images: MspImage[];
}