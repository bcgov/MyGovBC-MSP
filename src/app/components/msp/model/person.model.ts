import {Relationship, StatusInCanada, Activities} from "./status-activities-documents";
import {PersonDocuments} from "./person-document.model";
import {Address} from "./address.model";
import moment = require("moment");
var sha1 =  require('sha1');

enum Gender {
  Female = <any>"F",
  Male = <any>"M"
}

class Person {
  relationship: Relationship;
  _status: StatusInCanada;
  _currentActivity: Activities;
  documents: PersonDocuments = new PersonDocuments();
  /**
   * Name section
   */
  firstName: string;
  middleName: string;
  lastName: string;

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

  get dob() {
    return this.parseDate(this.dob_year, this.dob_month, this.dob_day);
  }

  arrivalToBCDay: number;
  arrivalToBCMonth: number;
  arrivalToBCYear: number;

  get hasArrivalToBC(): boolean {
    return (this.arrivalToBCDay != null &&
      this.arrivalToBCMonth != null &&
      this.arrivalToBCYear != null);
  }

  get arrivalToBC() {
    return this.parseDate(this.arrivalToBCYear, this.arrivalToBCMonth, this.arrivalToBCDay);
  }

  arrivalToCanadaDay: number;
  arrivalToCanadaMonth: number;
  arrivalToCanadaYear: number;

  get arrivalToCanada() {
    return this.parseDate(this.arrivalToCanadaYear, this.arrivalToCanadaMonth, this.arrivalToCanadaDay);
  }

  get hasArrivalToCanada(): boolean {
    return (this.arrivalToCanadaDay != null &&
    this.arrivalToCanadaMonth != null &&
    this.arrivalToCanadaYear != null);
  }

  /**
   * BC Personal Health Number
   */
  previous_phn: string;
  healthNumberFromOtherProvince:string;
  hasPreviousBCPhn: boolean;

  institutionWorkHistory: string;

  /**
   * Discharge date if worked in CDN forces
   */
  dischargeYear: number;
  dischargeMonth: number;
  dischargeDay: number;

  get hasDischarge(): boolean {
    return (this.dischargeDay != null &&
    this.dischargeMonth != null &&
    this.dischargeYear != null);
  }

  get dischargeDate() {
    return this.parseDate(this.dischargeYear, this.dischargeMonth, this.dischargeDay);
  }

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
   * Derived from answer to question: Do you have a previous PHN?
   * If answser is NO, the livedInBCSinceBirth = false
   * See https://apps.gcpe.gov.bc.ca/jira/browse/PSPDN-398
   */
  livedInBCSinceBirth:boolean = null;

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

  get hasStudiesFinished(): boolean {
    return (this.studiesFinishedDay != null &&
    this.studiesFinishedMonth != null &&
    this.studiesFinishedYear != null);
  }

  get studiesFinishedDate() {
    return this.parseDate(this.studiesFinishedYear, this.studiesFinishedMonth, this.studiesFinishedDay);
  }

  /**
   * If school outside BC when did they leave
   */
  studiesDepartureYear: number;
  studiesDepartureMonth: number;
  studiesDepartureDay: number;

  get hasStudiesDeparture(): boolean {
    return (this.studiesDepartureDay != null &&
    this.studiesDepartureMonth != null &&
    this.studiesDepartureYear != null);
  }

  get studiesDepartureDate() {
    return this.parseDate(this.studiesDepartureYear, this.studiesDepartureMonth, this.studiesDepartureDay);
  }

  get status(){
    return this._status;
  }
  set status(st:StatusInCanada){
    this._status = st;
    if(this._status === StatusInCanada.PermanentResident 
      || this._status === StatusInCanada.TemporaryResident){
        this.livedInBCSinceBirth = false;
      }
  }

  get currentActivity(){
    return this._currentActivity;
  }

  /**
   * All activies in the system now indicates that person has not lived in BC since birth.
   */
  set currentActivity(act: Activities) {
    this._currentActivity = act;
    this.livedInBCSinceBirth = false;
  }

  get hasFullName():boolean {
    return (this.firstName != null &&
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
   * Social Insurance Number
   */
  sin: string;

  id:string;
  constructor(rel: Relationship){
    this.relationship = rel;
    this.id = sha1(new Date().getTime()).substring(0,9);
  }

  private parseDate (year: number, month: number, day: number) {
    return moment({
      year: year,
      month: month - 1, // moment use 0 index for month :(
      day: day,
    }).utc(); // use UTC mode to prevent browser timezone shifting
  }
}

export {Person, Gender};