import { Address, BRITISH_COLUMBIA, CANADA, CommonImage } from 'moh-common-lib';
import { Relationship, Activities } from '../../msp-core/models/status-activities-documents';
import { MspPerson } from '../../../components/msp/model/msp-person.model';
import { UUID } from 'angular2-uuid';
import { ApplicationBase } from '../../msp-core/models/application-base.model';
import { PhoneNumber } from '../../../components/msp/model/phone.model';

/**
 * Overall MSP Application Process Data
 */
export class MspApplication implements ApplicationBase {

  private _uuid = UUID.UUID();
  infoCollectionAgreement: boolean = false;
  authorizationToken: string;
  phnRequired: boolean = false;

  /**
   * Set by the API, not for client use
   */
  referenceNumber: string;

  private _applicant: MspPerson = new MspPerson(Relationship.Applicant);

  private _children: Array<MspPerson> = [];
  /** Either the current spouse, or an application to add a new spouse */
  private _spouse: MspPerson;
  /** An application to remove a spouse.  */
  private _spouseRemoval: MspPerson;

  unUsualCircumstance: boolean;

  pageStatus: any[] = []; // page status - complete/ incomplete

  // Documents
  applicantStatusDoc: CommonImage[] = [];
  applicantNameDoc: CommonImage[] = [];
  spouseStatusDoc: CommonImage[] = [];
  spouseNameDoc: CommonImage[] = [];
  childrenStatusDoc: Array<CommonImage[]> = [];
  childrenNameDoc: Array<CommonImage[]> = [];


  get uuid(): string {
    return this._uuid;
  }

  regenUUID() {
    this._uuid = UUID.UUID();

    /**
     * Each image will have a uuid that starts with application uuid
     * followed by [index]-of-[total]
     */
    const all = this.getAllImages();

    all.forEach(image => {
      image.uuid = UUID.UUID();
    });
  }
  get applicant(): MspPerson {
    return this._applicant;
  }

  set applicant(apt: MspPerson) {
    this._applicant = apt;
  }
  get spouse(): MspPerson {
    return this._spouse;
  }

  get children(): Array<MspPerson> {
    return this._children;
  }

  get isUniquePhns () {
        const allPhs: string[] = this.allPersons.filter(x => x).map(x => x.previous_phn).filter(x => x)  .filter(x => x.length >= 10) ;
        return new Set(allPhs).size === allPhs.length ;
  }

  set children(children: Array<MspPerson>) {
    this._children = children;
  }

  addSpouse = (sp: MspPerson) => {
    if (!this._spouse) {
      this._spouse = sp;
    } else {
      console.log('spouse already added to your coverage.');
    }
  }

  addChild(relationship: Relationship): MspPerson {
    const c = new MspPerson(relationship);
    if (relationship === Relationship.Child19To24) {
      //child between 19-24 must be a full time student to qualify for enrollment
      c.fullTimeStudent = true;
    }
    this._children.length < 30 ? this._children.push(c) : console.log('No more than 30 children can be added to one application');
    return c;
  }

  removeChild(idx: number): void {
    const removed = this._children.splice(idx, 1);
  }

  removeSpouse(): void {
    this._spouse = null;
  }

  /**
   * Returns an array of ALL persons uses in application.
   *
   * Useful, for example, to make sure all PHNs are unique.
   */
  get allPersons(): Array<MspPerson> {
    return [
      this.applicant,
      ...this.children,
      this.spouse,
    ]
    .filter(x => x); //no 'undefined's
  }

  // Address and Contact Info
  public residentialAddress: Address = new Address();
  public mailingSameAsResidentialAddress: boolean = true;
  public mailingAddress: Address = new Address();
  public phoneNumber: string;


  /**
   * validator for phone number
   * @returns {boolean}
   */
  get phoneNumberIsValid(): boolean {

    // Phone is optional
    if (this.phoneNumber == null ||
      this.phoneNumber.length < 1) {
      return true;
    }

    // But if it's provided is must be valid
    const regEx = new RegExp(PhoneNumber.PhoneNumberRegEx);
    return regEx.test(this.phoneNumber);
  }

  authorizedByApplicant: boolean;
  authorizedByApplicantDate: Date;
  authorizedBySpouse: boolean;

  // Outside BC question
  _outsideBCFor30Days: boolean;

  /**
   * Set this flag if any family member has been outside BC for more than 30 days
   */
  get outsideBCFor30Days(): boolean {
    return (!!this.applicant && this.applicant.beenOutSideOver30Days)
      || (!!this._spouse && this._spouse.beenOutSideOver30Days)
      || this.childBeenOutsideBCFor30Days();
  }

  set outsideBCFor30Days(out: boolean) {
    this._outsideBCFor30Days = out;
  }

  private childBeenOutsideBCFor30Days(): boolean {
    return this.children.filter(child => {
      return child.beenOutSideOver30Days;
    }).length > 0;
  }

  /*
    Gets all images for applicant, spouse and all children
   */
  getAllImages(): CommonImage[] {
    let allImages = [
      ...this.applicantNameDoc,
      ...this.applicantNameDoc
    ];

    if (this.spouse) {
      allImages = allImages.concat([...this.spouseStatusDoc,
                                   ...this.spouseNameDoc]);
    }
    for (const child of this.childrenStatusDoc) {
      allImages = allImages.concat(child);
    }

    for (const child of this.childrenNameDoc) {
      allImages = allImages.concat(child);
    }

    return allImages;
  }

  /**
   * Finds a person based on UUID
   * @param uuid
   * @returns {any}
   */
  findPerson(uuid: string): MspPerson {
    if (this.applicant.uuid === uuid) {
      return this.applicant;
    }
    if (this.spouse) {
      if (this.spouse.uuid === uuid) {
        return this.spouse;
      }
    }
    for (const child of this.children) {
      if (child.uuid === uuid) {
        return child;
      }
    }
    return null;
  }


  get documentsReady(): boolean {
    const applicantDocsAvail = this.applicant.hasDocuments;
    let spouseDocsAvail = true;
    let kidsDocsAvail = true;
    if (this._spouse) {
      spouseDocsAvail = this._spouse.hasDocuments;
    }

    const kidsWithNoDocs = this._children.filter(kid => {
      return !kid.hasDocuments;
    });
    kidsDocsAvail = kidsWithNoDocs.length === 0;

    return applicantDocsAvail && spouseDocsAvail && kidsDocsAvail;
  }

  get childDocumentsReady(): boolean {
    let kidsDocsAvail = true;
    const kidsWithNoDocs = this._children.filter(kid => {
      return !kid.hasDocuments;
    });

    kidsDocsAvail = kidsWithNoDocs.length === 0;

    return kidsDocsAvail;
  }

  get spouseDocumentsReady(): boolean {

    let spouseDocsAvail = true;
    if (this._spouse) {
      spouseDocsAvail = this._spouse.hasDocuments;
    }
    return spouseDocsAvail;
  }





  get hasValidAuthToken() {
    return this.authorizationToken && this.authorizationToken.length > 1;
  }
  constructor() {
    // Set some defaults
    this.residentialAddress.province = BRITISH_COLUMBIA;
    this.residentialAddress.country = CANADA;
  }
}
