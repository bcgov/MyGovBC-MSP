import {Address} from "./address.model";
import {Relationship, StatusInCanada, Activities} from "./status-activities-documents";

class Person {
  relationship: Relationship;
  status: StatusInCanada;
  currentActivity: Activities;
  firstname: string;
  middlename: string;
  lastname: string;
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

/**
 * Primary applicant for msp appication
 */
class MspApplication {
  private _applicant: Person = new Person(Relationship.Applicant);
  
  private _children: Array<Person>  = [];
  private _spouse: Person;

  get applicant(): Person {
    return this._applicant;
  }
  get spouse(): Person {
    return this._spouse;
  }

  get children(): Array<Person> {
    return this._children;
  }

  addSpouse(): void{
    if(!this._spouse){
      this._spouse = new Person(Relationship.Spouse);
      console.log('spouse added: ' + JSON.stringify(this._spouse));
    }else{
      console.log('spouse already added to your coverage.');
    }
  }

  addChild(): void {
    let c = new Person(Relationship.Child)
    this._children.length < 30 ? this._children.push(c): console.log('No more than 30 chidren can be added to one application');
  }
  
  removeChild(idx: number):void {
    // console.log('removing child at index ' + idx);
    let removed = this._children.splice(idx,1);
  }

  removeSpouse(): void {
    // console.log('spouse removed from coverage');
    this._spouse = null;
  }

  // Address and Contact Info
  public residentialAddress: Address = new Address();
  public mailingSameAsResidentialAddress: boolean = true;
  public mailingAddress: Address = new Address();
  public phoneNumber: string;

  constructor() {
    // Set some defaults
    this.residentialAddress.province = "BC";
    this.residentialAddress.country = "Canada";
  }
}

export {MspApplication, Person, StatusInCanada, Activities}