import { Address } from './address.model';
import { Relationship } from './status-activities-documents';
import { Person } from './person.model';
import { UUID } from 'angular2-uuid';
import { MspImage } from './msp-image';
import { ApplicationBase } from './application-base.model';

/**
 * Overall MSP Application Process Data
 */
class AccountLetterApplication implements ApplicationBase {

  private _uuid = UUID.UUID();
  infoCollectionAgreement: boolean = false;
  authorizationToken: string;
  phnRequired: boolean = false;


  postalCode: string = null;

  /**
   * Set by the API, not for client use
   */
  referenceNumber: string;

  private _applicant: Person = new Person(Relationship.AllAgeApplicant);

  get uuid(): string {
    return this._uuid;
  }

  regenUUID() {
    this._uuid = UUID.UUID();

  }

  get applicant(): Person {
    return this._applicant;
  }

  set applicant(apt: Person) {
    this._applicant = apt;
  }

  get isUniquePhns () {
        const allPhs: string[] = this.allPersons.filter(x => x).map(x => x.previous_phn).filter(x => x)  .filter(x => x.length >= 10) ;
        return new Set(allPhs).size === allPhs.length ;
  }

  /**
   * Returns an array of ALL persons uses in application.
   *
   * Useful, for example, to make sure all PHNs are unique.
   */
  get allPersons(): Array<Person> {
    const specificMember: Person = new Person(Relationship.Spouse);
    specificMember.previous_phn = this.applicant.specificMember_phn;

    return [
      this.applicant, specificMember
    ]
    .filter(x => x); //no 'undefined's
  }


  authorizedByApplicant: boolean;
  authorizedByApplicantDate: Date;

  /**
   * Finds a person based on UUID
   * @param uuid
   * @returns {any}
   */
  findPerson(uuid: string): Person {
    if (this.applicant.uuid === uuid) {
      return this.applicant;
    }
    return null;
  }

  getAllImages(): MspImage[] {
    return null;
  }

  get hasValidAuthToken() {
    return this.authorizationToken && this.authorizationToken.length > 1;
  }

  constructor() {

  }
}

export { AccountLetterApplication, Person };
