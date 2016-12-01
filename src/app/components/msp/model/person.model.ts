import {Relationship, StatusInCanada, Activities} from "./status-activities-documents";
import {PersonDocuments} from "./person-document.model";

class Person {
  relationship: Relationship;
  status: StatusInCanada;
  currentActivity: Activities;

  documents: PersonDocuments = new PersonDocuments();

  firstName: string;
  middleName: string;
  lastName: string;
  legalGender: string;
  dob_day: number;
  dob_month: number;
  dob_year: number;

  arrival_day: number;
  arrival_month: number;
  arrival_year: number;

  previous_phn: string;
  institutionWorkHistory: string;

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

  constructor(rel: Relationship){
    this.relationship = rel;
  }
}

export {Person};