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

  /**
   * Name section
   */
  firstName: string;
  middleName: string;
  lastName: string;

  get hasFullName():boolean {
    return (this.firstName != null &&
        this.middleName != null &&
        this.lastName != null);
  }
  get fullName():string {
    let fullName = this.firstName;
    if (this.middleName != null &&
      this.middleName.length > 0) {
      fullName += " " + this.middleName;
    }
    fullName +=  " " + this.lastName;

    return fullName;
  }

  /**
   * Gender
   */
  gender: Gender;

  /**
   * Date of birth section
   */
  dob_day: number;
  dob_month: number;
  dob_year: number;

  get hasDob(): boolean {
    return (this.dob_year != null &&
      this.dob_month != null &&
      this.dob_day != null);
  }

  arrivalToBCDay: number;
  arrivalToBCMonth: number;
  arrivalToBCYear: number;

  arrivalToCanadaDay: number;
  arrivalToCanadaMonth: number;
  arrivalToCanadaYear: number;

  previous_phn: string;
  institutionWorkHistory: string;

  /**
   * Discharge date if worked in CDN forces
   */
  dischargeYear: number;
  dischargeMonth: number;
  dischargeDay: number;

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
   * Denotes unusual situation for the applicant
   */
  uncommonSituation: boolean;


  /**
   * For children 19-24, we need the school name and address
   */
  schoolName: string;
  schoolAddress: Address = new Address();

  /**
   * When the student expects to finish
   */
  studiesFinishedYear: number;
  studiesFinishedMonth: number;
  studiesFinishedDay: number;

  /**
   * If school outside BC when did they leave
   */
  studiesDepartureYear: number;
  studiesDepartureMonth: number;
  studiesDepartureDay: number;

  /**
   * Social Insurance Number
   */
  sin: string;

  id:string;
  constructor(rel: Relationship){
    this.relationship = rel;
    this.id = sha1(new Date().getTime()).substring(0,9);
  }
}

export {Person, Gender};