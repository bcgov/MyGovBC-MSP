import {Address} from "./address.model";
import {Relationship, StatusInCanada, Activities} from "./status-activities-documents";
import {Person} from "./person.model";
import {UUID} from "angular2-uuid";

/**
 * Overall MSP Application Process Data
 */
class MspApplication {

  readonly uuid = UUID.UUID();

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

  addSpouse = (sp:Person)=>{
    if(!this._spouse){
      this._spouse = sp;
    }else{
      console.log('spouse already added to your coverage.');
    }
  };

  addChild(relationship: Relationship): void {
    let c = new Person(relationship)
    this._children.length < 30 ? this._children.push(c): console.log('No more than 30 children can be added to one application');
  }
  
  removeChild(idx: number):void {
    let removed = this._children.splice(idx,1);
  }

  removeSpouse(): void {
    this._spouse = null;
  }

  // Address and Contact Info
  public residentialAddress: Address = new Address();
  public mailingSameAsResidentialAddress: boolean = true;
  public mailingAddress: Address = new Address();
  public phoneNumber: string;

  authorizedByApplicant: boolean;
  authorizedByApplicantDate: Date;
  authorizedBySpouse: boolean;
  authorizedBySpouseDate: Date;

  constructor() {
    // Set some defaults
    this.residentialAddress.province = "British Columbia";
    this.residentialAddress.country = "Canada";
  }
}

export {MspApplication, Person, StatusInCanada, Activities}