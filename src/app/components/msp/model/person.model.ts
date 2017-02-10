import {Relationship, StatusInCanada, Activities} from "./status-activities-documents";
import {PersonDocuments} from "./person-document.model";
import {Address} from "./address.model";
import {OutofBCRecord} from "./outof-bc-record.model";
import moment = require("moment");
import {UUID} from "angular2-uuid";
import * as _ from 'lodash';

var sha1 =  require('sha1');

enum Gender {
  Female = <any>"F",
  Male = <any>"M"
}

class Person {

  readonly uuid = UUID.UUID();

  relationship: Relationship;
  _status: StatusInCanada;
  _currentActivity: Activities;
  documents: PersonDocuments = new PersonDocuments();
  outOfBCRecords:OutofBCRecord[] = [];

  /**
   * Had episodes of leaving and returning to bc for peirod of longer than 30 days.
   */
  private _beenOutSideOver30Days:boolean;
  declarationForOutsideOver30Days: boolean;

  get beenOutSideOver30Days():boolean {
    return this.outOfBCRecords.filter( rec => {
      return !rec.isEmpty;      
    }).length > 0;
  }

  get hasCompleteOutSideRecords():boolean {
    let noRecords = this.outOfBCRecords.length === 0; 
    let allFilledIn = this.outOfBCRecords.filter( rec => {
      return rec.isValid();
    }).length === this.outOfBCRecords.length;

    return noRecords || allFilledIn;
  }
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
  _hasPreviousBCPhn: boolean;

  /**
   * Health number from another province
   */
  healthNumberFromOtherProvince:string;

  institutionWorkHistory: string;

  get hasPreviousBCPhn():boolean {
    return this._hasPreviousBCPhn;
  }

  set hasPreviousBCPhn(hasPhn:boolean) {
    if(!hasPhn){
      this.previous_phn = null;
    }
    this._hasPreviousBCPhn = hasPhn;
  }
  

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
  movedFromProvinceOrCountry: string;

  /**
   * This property is for storing user provided answer to the following question:
   * Do you currently live in BC?
   */
  liveInBC:boolean;

  /**
   * Now ask explicitly of the user
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


  fullTimeStudent: boolean;
  inBCafterStudies: boolean;

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

  /*
    Outside BC section
   */
  outsideBC: boolean = false;
  outsideBCDepartureDateYear: number;
  outsideBCDepartureDateMonth: number;
  outsideBCDepartureDateDay: number;
  outsideBCReturnDateYear: number;
  outsideBCReturnDateMonth: number;
  outsideBCReturnDateDay: number;
  outsideBCFamilyMemberReason: string;
  outsideBCDestination: string;

  get hasOutsideBCDepartureDate(): boolean {
    return (this.outsideBCDepartureDateDay != null &&
    this.outsideBCDepartureDateMonth != null &&
    this.outsideBCReturnDateYear != null);
  }

  get hasOutsideBCReturnDate(): boolean {
    return (this.outsideBCReturnDateDay != null &&
    this.outsideBCReturnDateMonth != null &&
    this.outsideBCReturnDateYear != null);
  }

  get outsideBCDepartureDate() {
    return this.parseDate(this.outsideBCDepartureDateYear, this.outsideBCDepartureDateMonth, this.outsideBCDepartureDateDay);
  }

  get outsideBCReturnDate() {
    return this.parseDate(this.outsideBCReturnDateYear, this.outsideBCReturnDateMonth, this.outsideBCReturnDateDay);
  }

  /**
   These questions need to be visible to everyone except those who have selected one of the two following statuses:
   Canadian citizen - moving from another province
   Permanent Resident - moving from another province
   */
  test30DayCandidate(): boolean {
    if (this.status == StatusInCanada.CitizenAdult && this.currentActivity == Activities.MovingFromProvince) {
      return false;
    }
    if (this.status == StatusInCanada.PermanentResident && this.currentActivity == Activities.MovingFromProvince) {
      return false;
    }
    return true;
  }

  /**
   These questions need to be visible to everyone except those who have selected one of the two following statuses:
   Canadian citizen - moving from another province
   Permanent Resident - moving from another province
   */
  test30DayCandidateAvailable(): boolean {
    if (this.outsideBC) {
      return false;
    }
   return this.test30DayCandidate();
  }

  resetOutsideBCValues(): void {
    this.outsideBC = false;
    this.outsideBCFamilyMemberReason = null;
    this.outsideBCDepartureDateYear = null;
    this.outsideBCDepartureDateMonth = null;
    this.outsideBCDepartureDateDay = null;
    this.outsideBCReturnDateYear = null;
    this.outsideBCReturnDateMonth = null;
    this.outsideBCReturnDateDay = null;
  }


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

  private isNotEmpty(thing:any):boolean{
    return thing !== null && thing !== undefined;
  }

  /**
   *   0: 'Returning to BC after an absence',
   *   1: 'Moving from another province',
   *   2: 'Moving from another country',
   *   3: 'Working in BC',
   *   4: 'Studying in BC',
   *   5: 'Religious worker',
   *   6: 'Diplomat'
   */
  get isInfoComplete(){
    // console.log('check data completeness for: ' + Relationship[this.relationship]);
    let basic =  _.isString(this.gender)
    && _.isString(this.firstName) && this.firstName.length > 0 && _.isString(this.lastName) && this.lastName.length > 0
    // && this.isNotEmpty(this.dob_day) && this.isNotEmpty(this.dob_month) && this.isNotEmpty(this.dob_year)
    && _.isNumber(this.dob_day) && _.isString(this.dob_month) && _.isNumber(this.dob_year)
    && _.isNumber(this._status) && _.isNumber(this._currentActivity);

    let returningToBCComplete = true;

    // code 0 is "Returning to BC after an absence"
    if(this.currentActivity === 0){
      returningToBCComplete = _.isBoolean(this.hasPreviousBCPhn)
      && _.isNumber(this.arrivalToBCYear) && _.isString(this.arrivalToBCMonth) && _.isNumber(this.arrivalToBCDay);
    }

    // code 1 is "Moving from another province"
    let movingFromAnotherProvinceComplete = true;
    if(this.currentActivity === 1){
      movingFromAnotherProvinceComplete = _.isString(this.movedFromProvinceOrCountry) && this.movedFromProvinceOrCountry.length > 1;
    }

    let movingFromAnotherCountryComplete = true;
    if(this.currentActivity === 2 || this.status === 2) {
      movingFromAnotherCountryComplete = _.isString(this.movedFromProvinceOrCountry) && this.movedFromProvinceOrCountry.length > 1;
    }

    let studentComplete:boolean = true;
    if(this.relationship === Relationship.Applicant || this.relationship === Relationship.Child19To24){
      studentComplete = _.isBoolean(this.fullTimeStudent);
      if(studentComplete && this.fullTimeStudent){
        studentComplete = _.isBoolean(this.inBCafterStudies);
      }
    }

    let ageOver19ChildComplete = true;

    if(this.relationship === Relationship.Child19To24){
      if(this.fullTimeStudent){
        ageOver19ChildComplete = _.isString(this.schoolName) && this.schoolName.length > 3
          && _.isNumber(this.studiesFinishedYear) && _.isString(this.studiesFinishedMonth) && _.isNumber(this.studiesFinishedDay)
          && this.schoolAddress.isValid;
      }else{
        //must be a full time student
        ageOver19ChildComplete = false;
      }
    }

    let institutionWorkComplete = true;
    if(this.currentActivity === 1 || this.currentActivity === 0){
      institutionWorkComplete = _.isString(this.institutionWorkHistory) 
        && (this.institutionWorkHistory.toLowerCase() === 'yes' || this.institutionWorkHistory.toLowerCase() === 'no');
      if(institutionWorkComplete && this.institutionWorkHistory.toLowerCase() === 'yes'){
        institutionWorkComplete = _.isNumber(this.dischargeDay) && _.isString(this.dischargeMonth) && _.isNumber(this.dischargeYear);
      }  
    }
    let arrivalInCanadaComplete = _.isNumber(this.arrivalToCanadaDay) && _.isString(this.arrivalToCanadaMonth) && _.isNumber(this.arrivalToCanadaYear);
    
    let result = basic 
      && returningToBCComplete 
      && arrivalInCanadaComplete
      && movingFromAnotherProvinceComplete
      && movingFromAnotherCountryComplete
      && institutionWorkComplete
      && ageOver19ChildComplete
      && studentComplete
      && this.hasCompleteOutSideRecords;

    // console.log(Relationship[this.relationship] + ' data completed? ' + result);  
    return result;  
  }
}

export {Person, Gender};