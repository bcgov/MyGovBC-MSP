import {Relationship, StatusInCanada, Activities} from "./status-activities-documents";
import {PersonDocuments} from "./person-document.model";
import {Address} from "./address.model";
var sha1 =  require('sha1');

enum Gender {
  Female,
  Male
}

class Person {
  relationship: Relationship;
  status: StatusInCanada;
  currentActivity: Activities;

  documents: PersonDocuments = new PersonDocuments();

  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  dob_day: number;
  dob_month: number;
  dob_year: number;

  arrivalToBCDay: number;
  arrivalToBCMonth: number;
  arrivalToBCYear: number;

  arrivalToCanadaDay: number;
  arrivalToCanadaMonth: number;
  arrivalToCanadaYear: number;

  previous_phn: string;
  institutionWorkHistory: string;

  /**
   * Which province the person has moved from
   */
  movedFromProvince: string;

  /**
   * This property is for storing user provided answer to the following question:
   * Do you currently live in BC?
   */
  liveInBC:boolean;

  /**
   * This property is for storing user provided answer to the following question:
   * Are you planning to stay for six months or longer
   */
  stayForSixMonthsOrLonger:boolean;

  /**
   * This property is for storing user provided answer to the following question:
   * Are you planning to leave BCfor longer than 30 days in the next six months?
   */
  plannedAbsence:boolean;

  /**
   * For children 19-24, we need the school name and address
   */
  schoolName: string;

  schoolAddress: Address = new Address();

  studiesFinishedYear: number;
  studiesFinishedMonth: number;
  studiesFinishedDay: number;

  studiesDepartureYear: number;
  studiesDepartureMonth: number;
  studiesDepartureDay: number;

  id:string;
  constructor(rel: Relationship){
    this.relationship = rel;
    this.id = sha1(new Date().getTime()).substring(0,9);
  }
}

export {Person, Gender};