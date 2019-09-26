import { MspPerson } from '../../../components/msp/model/msp-person.model';
import { Eligibility } from './eligibility.model';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { ApplicationBase } from '../../../models/application-base.model';
import { AssistanceYear } from './assistance-year.model';
import * as _ from 'lodash';
import { PhoneNumber } from '../../../components/msp/model/phone.model';
import { Address, CommonImage } from 'moh-common-lib';
import { Relationship } from '../../../models/relationship.enum';

export enum AssistanceApplicationType {
  CurrentYear,
  PreviousTwoYears,
  MultiYear
}

export class FinancialAssistApplication implements ApplicationBase {
  private _uuid = UUID.UUID();

  pageStatus: any[] = []; // page status - complete/ incomplete

  authorizationToken: string;
  phnRequired: boolean = true;

  assistYears: AssistanceYear[] = [];
  assistYeaDocs: CommonImage[] = [];

  infoCollectionAgreement: boolean = false;

  applicantClaimForAttendantCareExpense: boolean = false;
  spouseClaimForAttendantCareExpense: boolean = false;
  childClaimForAttendantCareExpense: boolean = false;
  childClaimForAttendantCareExpenseCount: number = 1;

  applicantDisabilityCredit: number;
  spouseDisabilityCredit: number;
  childrenDisabilityCredit: number;

  _attendantCareExpense: number;

  private _attendantCareExpenseReceipts: CommonImage[] = new Array<CommonImage>();

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

  get attendantCareExpense(): number {
    if (!!this._attendantCareExpense && !isNaN(this._attendantCareExpense)) {
      return parseFloat(this._attendantCareExpense + '');
    } else {
      return null;
    }
  }

  get isUniquePhns() {
    const allPhs: string[] = this.allPersons
      .filter(x => x)
      .map(x => x.previous_phn)
      .filter(x => x)
      .filter(x => x.length >= 10);
    return new Set(allPhs).size === allPhs.length;
  }

  get isUniqueSin() {
    const allPhs: string[] = this.allPersons
      .filter(x => x)
      .map(x => x.sin)
      .filter(x => x);
    return new Set(allPhs).size === allPhs.length;
  }

  set attendantCareExpense(n: number) {
    this._attendantCareExpense = n || 0;
  }
  get attendantCareExpenseReceipts(): CommonImage[] {
    return this._attendantCareExpenseReceipts;
  }

  set attendantCareExpenseReceipts(receipts: CommonImage[]) {
    this._attendantCareExpenseReceipts = receipts || [];
  }
  /**
   * Set by the API, not for client use
   */
  referenceNumber: string;

  eligibility: Eligibility = new Eligibility();
  /**
   * Person applying for assistance
   * @type {Person}
   */
  applicant: MspPerson = new MspPerson(Relationship.Applicant);

  /**
   * Spouse of person applying
   * @type {Person}
   */
  spouse: MspPerson = new MspPerson(Relationship.Spouse);

  private _netIncomelastYear: number;
  /**
   * line 236 on NOA
   */
  private _spouseIncomeLine236: number;

  private _childrenCount: number;
  /**
   * Line 214 on NOA
   */
  private _claimedChildCareExpense_line214: number;

  /**
   * Line 117 on NOA
   */
  private _reportedUCCBenefit_line117: number;

  /**
   * Line 125
   */
  private _spouseDSPAmount_line125: number;

  ageOver65: boolean;
  spouseAgeOver65: boolean;

  private _hasSpouseOrCommonLaw: boolean;

  /**
   * Returns an array of ALL persons uses in financial assistance.
   *
   * Useful, for example, to make sure all PHNs are unique.
   */
  get allPersons(): Array<MspPerson> {
    return [this.applicant, this.spouse].filter(x => x); //no 'undefined's
  }

  /**
   * Applicant himself or herself eligible for disablity credit flag
   */
  private eligibleForDisabilityCredit: boolean;
  private spouseOrCommonLawEligibleForDisabilityCredit: boolean;

  childWithDisabilityCount: number = 0;

  _authorizedByApplicant: boolean;
  _authorizedBySpouse: boolean;
  _authorizedByAttorney: boolean;
  authorizedByApplicantDate: Date;

  powerOfAttorneyDocs: CommonImage[] = [];
  get hasPowerOfAttorney(): boolean {
    return this.powerOfAttorneyDocs && this.powerOfAttorneyDocs.length > 0;
  }

  set authorizedByApplicant(auth: boolean) {
    this._authorizedByApplicant = auth;

    if (auth) {
      // this._authorizedByAttorney = false;
      this.authorizedByApplicantDate = moment().toDate();
    }
  }

  set authorizedBySpouse(auth: boolean) {
    this._authorizedBySpouse = auth;
    if (auth) {
      this._authorizedByAttorney = false;
    }
  }
  set authorizedByAttorney(auth: boolean) {
    this._authorizedByAttorney = auth;
    if (auth) {
      // this._authorizedByApplicant = false;
      this._authorizedBySpouse = false;
      this.authorizedByApplicantDate = moment().toDate();
    }
  }

  get authorizedByApplicant(): boolean {
    return this._authorizedByApplicant;
  }
  get authorizedBySpouse(): boolean {
    return this._authorizedBySpouse;
  }
  get authorizedByAttorney(): boolean {
    return this._authorizedByAttorney;
  }
  get netIncomelastYear(): number {
    return this._netIncomelastYear === null ? null : this._netIncomelastYear;
  }

  set netIncomelastYear(n: number) {
    if (!this.isEmptyString(n)) {
      this._netIncomelastYear = n;
    }
  }
  get spouseIncomeLine236(): number {
    return this._spouseIncomeLine236 === null
      ? null
      : this._spouseIncomeLine236;
  }

  set spouseIncomeLine236(n: number) {
    if (!this.isEmptyString(n)) {
      this._spouseIncomeLine236 = n;
    }
  }
  //End of GET SET for the SpouseIncome
  isEmptyString(value: number) {
    let temp: string = value + '';
    temp = temp.trim();
    return temp.length < 1;
  }
  get childrenCount(): number {
    if (!this._childrenCount) {
      return null;
    } else {
      const n =
        !!this._childrenCount && !isNaN(this._childrenCount)
          ? this._childrenCount
          : 0;
      return n;
    }
  }

  childrenCountArray(): Array<number> {
    const arr: number[] = new Array(this.childrenCount);
    for (let i = 0; i <= this.childrenCount; i++) {
      arr[i] = i;
    }

    return arr;
  }

  set childrenCount(n: number) {
    n > 29 ? (this._childrenCount = 0) : (this._childrenCount = n);
    if (
      !this.childrenCount ||
      this.childrenCount < this.childWithDisabilityCount
    ) {
      this.childWithDisabilityCount = 0;
    }
  }

  get claimedChildCareExpense_line214() {
    if (
      !!this._claimedChildCareExpense_line214 &&
      !isNaN(this._claimedChildCareExpense_line214)
    ) {
      return parseFloat(this._claimedChildCareExpense_line214 + '');
    } else {
      return null;
    }
  }

  set claimedChildCareExpense_line214(n: number) {
    if (!this.isEmptyString(n)) {
      this._claimedChildCareExpense_line214 = n;
    }
  }
  get reportedUCCBenefit_line117(): number {
    if (
      !!this._reportedUCCBenefit_line117 &&
      !isNaN(this._reportedUCCBenefit_line117)
    ) {
      return parseFloat(this._reportedUCCBenefit_line117 + '');
    } else {
      return null;
    }
  }

  set reportedUCCBenefit_line117(n: number) {
    if (!this.isEmptyString(n)) {
      this._reportedUCCBenefit_line117 = n;
    }
  }
  get spouseDSPAmount_line125(): number {
    if (
      !!this._spouseDSPAmount_line125 &&
      !isNaN(this._spouseDSPAmount_line125)
    ) {
      return parseFloat(this._spouseDSPAmount_line125 + '');
    } else {
      return null;
    }
  }

  set spouseDSPAmount_line125(n: number) {
    if (!this.isEmptyString(n)) {
      this._spouseDSPAmount_line125 = n;
    }
  }
  // End of GET SET for spouseDSPAmount_line125
  get hasSpouseOrCommonLaw() {
    return this._hasSpouseOrCommonLaw;
  }

  set setSpouse(arg: boolean) {
    if (!arg) {
      this.spouseEligibleForDisabilityCredit = arg;
      this.spouseIncomeLine236 = undefined;
      this.spouseAgeOver65 = undefined;
    }
    this._hasSpouseOrCommonLaw = arg;
  }

  get selfDisabilityCredit() {
    return this.eligibleForDisabilityCredit;
  }
  set selfDisabilityCredit(selfEligible: boolean) {
    this.eligibleForDisabilityCredit = selfEligible;
  }

  get spouseEligibleForDisabilityCredit() {
    return this.spouseOrCommonLawEligibleForDisabilityCredit;
  }

  set spouseEligibleForDisabilityCredit(spouseEligible: boolean) {
    if (spouseEligible) {
      this._hasSpouseOrCommonLaw = true;
    }
    this.spouseOrCommonLawEligibleForDisabilityCredit = spouseEligible;
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
    if (this.phoneNumber == null || this.phoneNumber.length < 1) {
      return true;
    }

    // But if it's provided is must be valid
    const regEx = new RegExp(PhoneNumber.PhoneNumberRegEx);
    return regEx.test(this.phoneNumber);
  }

  id: string;

  /**
   * Power of atterney docs and attendant care expense receipts
   */
  getAllImages(): CommonImage[] {
    return [
      ...this.powerOfAttorneyDocs,
      ...this.attendantCareExpenseReceipts,
      ...this.assistYeaDocs
    ];
  }

  /**
   * Filters out years not applied for
   * @returns {AssistanceYear[]}
   */
  getAppliedForTaxYears(): AssistanceYear[] {
    const years = this.assistYears.filter((value: AssistanceYear) => {
      if ( value.apply ) {
        return value.year;
      }
    });

    console.log( 'getAppliedForTaxYears: ', years );
    return years.filter( x => x );
  }

  get taxtYearsProvided(): boolean {
    return (
      !!this.getAppliedForTaxYears() && this.getAppliedForTaxYears().length > 0
    );
  }
  /**
   * Sorts descending the applied for tax years
   */
  getMostRecentAppliedForTaxYears(): AssistanceYear[] {
    const years = this.getAppliedForTaxYears().sort(
      (a: AssistanceYear, b: AssistanceYear) => {
        return b.year - a.year;
      }
    );
    console.log( 'getMostRecentAppliedForTaxYears: ', years );
    return years;
  }

  /**
   * Determines what type of application this is based on tax years specified
   * @returns {AssistanceApplicationType}
   */
  getAssistanceApplicationType(): AssistanceApplicationType {
    const mostRecentAppliedForTaxYears = this.getMostRecentAppliedForTaxYears();

    // If we only have one and it's last year
    if (
      mostRecentAppliedForTaxYears == null ||
      (mostRecentAppliedForTaxYears.length === 1 &&
        mostRecentAppliedForTaxYears[0].year === this.MostRecentTaxYear)
    ) {
      return AssistanceApplicationType.CurrentYear;
    }

    // If we only have two and it's last year
    if (
      mostRecentAppliedForTaxYears &&
      mostRecentAppliedForTaxYears.length === 2 &&
      mostRecentAppliedForTaxYears[0].year === this.MostRecentTaxYear &&
      mostRecentAppliedForTaxYears[1].year === this.MostRecentTaxYear - 1
    ) {
      return AssistanceApplicationType.PreviousTwoYears;
    }

    // If we only have one and it's last year - 1
    if (
      mostRecentAppliedForTaxYears &&
      mostRecentAppliedForTaxYears.length === 1 &&
      mostRecentAppliedForTaxYears[0].year === this.MostRecentTaxYear
    ) {
      return AssistanceApplicationType.PreviousTwoYears;
    }

    // In all other cases it's multi year
    return AssistanceApplicationType.MultiYear;
  }

  /**
   * It ALWAYS returns most recent applied for year which is always this year
   * @returns {number}
   */
  getTaxYear(): number {
    const mostRecentAppliedForTaxYears = this.getMostRecentAppliedForTaxYears();
    if (mostRecentAppliedForTaxYears.length > 0) {
      return mostRecentAppliedForTaxYears[0].year;
    } else {
      return this.MostRecentTaxYear;
    }
  }

  get MostRecentTaxYear(): number {
    /** If current year is 2019, then the tax year is 2018 */
    return moment().year() - 1;
  }

  /**
   * Counts the number of tax years
   * @returns {number}
   */
  numberOfTaxYears(): number {
    return this.getAppliedForTaxYears().length;
  }

  /**
   * Counts up total number of disabled including children, applicant and spouse
   */
  get numDisabled(): number {
    let numDisabled = 0;

    // applicant
    if (
      this.selfDisabilityCredit != null &&
      this.selfDisabilityCredit === true
    ) {
      numDisabled++;
    }

    // spouse
    if (
      this.spouseEligibleForDisabilityCredit != null &&
      this.spouseEligibleForDisabilityCredit === true
    ) {
      numDisabled++;
    }

    if (
      this.childWithDisabilityCount != null &&
      this.childWithDisabilityCount >= 0
    ) {
      numDisabled += this.childWithDisabilityCount;
    }

    return numDisabled;
  }

  /**
   * The sum of all disability deductions
   * @returns {number}
   */
  get disabilityDeduction(): number {
    let disabilityDeduction = 0;

    if (this.applicantDisabilityCredit && this.applicantDisabilityCredit > 0) {
      disabilityDeduction += this.applicantDisabilityCredit;
    }
    if (this.spouseDisabilityCredit && this.spouseDisabilityCredit > 0) {
      disabilityDeduction += this.spouseDisabilityCredit;
    }

    if (this.childrenDisabilityCredit && this.childrenDisabilityCredit > 0) {
      disabilityDeduction += this.childrenDisabilityCredit;
    }

    return disabilityDeduction;
  }

  constructor() {
    this.id = UUID.UUID();
  }
}
