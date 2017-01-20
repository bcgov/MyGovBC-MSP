import {Address} from "./address.model";
import {Relationship, StatusInCanada, Activities, Documents} from "./status-activities-documents";
import {Person} from "./person.model";
import {UUID} from "angular2-uuid";
import {MspImage} from "./msp-image";
import {ApplicationBase} from "./application-base.model";

/**
 * Overall MSP Application Process Data
 */
class MspApplication implements ApplicationBase {

  readonly uuid = UUID.UUID();

  /**
   * Set by the API, not for client use
   */
  referenceNumber: string;

  private _applicant: Person = new Person(Relationship.Applicant);
  
  private _children: Array<Person>  = [];
  private _spouse: Person;

  unUsualCircumstance:boolean;

  get applicant(): Person {
    return this._applicant;
  }

  set applicant(apt: Person) {
    this._applicant = apt;
  } 
  get spouse(): Person {
    return this._spouse;
  }

  get children(): Array<Person> {
    return this._children;
  }

  set children(children:Array<Person>) {
    this._children = children;
  }

  addSpouse = (sp:Person)=>{
    if(!this._spouse){
      this._spouse = sp;
    }else{
      console.log('spouse already added to your coverage.');
    }
  };

  addChild(relationship: Relationship): Person {
    let c = new Person(relationship)
    this._children.length < 30 ? this._children.push(c): console.log('No more than 30 children can be added to one application');
    return c;
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

  // Outside BC question
  outsideBCFor30Days: boolean;

  getOutOfProvinceFor30DayCandidates (): Person[] {
    let personList = new Array<Person>();

    if (this.applicant.test30DayCandidate()) {
      personList.push(this.applicant);
    }
    if (this.spouse != null) {
      if (this.spouse.test30DayCandidate()) {
        personList.push(this.spouse)
      }
    }
    for (let child of this.children) {
      if (child.test30DayCandidate()) {
        personList.push(child);
      }
    }

    return personList;
  }

  getOutOfProvinceFor30DayCandidatesAvailable (): Person[] {
    let personList = new Array<Person>();

    if (this.applicant.test30DayCandidateAvailable()) {
      personList.push(this.applicant);
    }
    if (this.spouse != null) {
      if (this.spouse.test30DayCandidateAvailable()) {
        personList.push(this.spouse)
      }
    }
    for (let child of this.children) {
      if (child.test30DayCandidateAvailable()) {
        personList.push(child);
      }
    }

    return personList;

  }

  getOutOfProvincePersons (): Person[] {
    let personList = new Array<Person>();
    if (this.applicant.outsideBC) {
      personList.push(this.applicant)
    }
    if (this.spouse && this.spouse.outsideBC) {
      personList.push(this.spouse)
    }
    for (let child of this.children) {
      if (child.outsideBC) {
        personList.push(child);
      }
    }

    return personList;
  }

  /*
    Gets all images for applicant, spouse and all children
   */
  getAllImages():MspImage[] {
    let allImages = Array<MspImage>();

    // add applicant
    allImages = allImages.concat(this.applicant.documents.images);

    if (this.spouse) {
      allImages = allImages.concat(this.spouse.documents.images);
    }
    for (let child of this.children) {
      allImages = allImages.concat(child.documents.images);
    }

    return allImages;
  }

  /**
   * Finds a person based on UUID
   * @param uuid
   * @returns {any}
   */
  findPerson(uuid: string): Person {
    if (this.applicant.uuid === uuid) {
      return this.applicant;
    }
    if (this.spouse) {
      if (this.spouse.uuid === uuid) {
        return this.spouse;
      }
    }
    for (let child of this.children) {
      if (child.uuid === uuid) {
        return child;
      }
    }
    return null;
  }

  constructor() {
    // Set some defaults
    this.residentialAddress.province = "British Columbia";
    this.residentialAddress.country = "Canada";
  }
}

export {MspApplication, Person, StatusInCanada, Activities}