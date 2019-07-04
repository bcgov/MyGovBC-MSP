export interface MSPApplicationSchema {
  accountChangeApplication?: AccountChangeApplicationType;
  assistanceApplication?: AssistanceApplicationType;
  attachments: any[];
  enrolmentApplication?: EnrolmentApplicationType;
  supplementaryBenefitsApplication?: SupplementaryBenefitsApplicationType;
  uuid: string;
}

export interface AccountChangeApplicationType {
  accountHolder: AccountChangeAccountHolderType;
  children?: any[];
  spouses: AccountChangeSpousesType;
}

export interface AccountChangeAccountHolderType {
  attachmentUuids?: string[];
  authorizedByApplicant: string;
  authorizedByApplicantDate: string;
  authorizedBySpouse?: string;
  birthDate: string;
  citizenship?: CitizenshipType;
  gender: string;
  mailingAddress?: AddressType;
  name: NameType;
  phn: string;
  residenceAddress: AddressType;
  selectedAddRemove: string;
  selectedAddressChange: string;
  selectedPersonalInfoChange: string;
  selectedStatusChange: string;
  telephone?: string;
}

export enum CitizenshipType {
  CanadianCitizen = 'CanadianCitizen',
  Diplomat = 'Diplomat',
  PermanentResident = 'PermanentResident',
  ReligiousWorker = 'ReligiousWorker',
  StudyPermit = 'StudyPermit',
  VisitorPermit = 'VisitorPermit',
  WorkPermit = 'WorkPermit'
}

export interface AddressType {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  country: string;
  postalCode: string;
  provinceOrState: string;
}

export interface NameType {
  firstName: string;
  lastName: string;
  secondName?: string;
}

export interface AccountChangeSpousesType {
  addedSpouse?: AccountChangeSpouseType;
  removedSpouse?: AccountChangeSpouseType;
  updatedSpouse?: AccountChangeSpouseType;
}

export interface AccountChangeSpouseType {
  attachmentUuids?: string[];
  birthDate: string;
  cancellationDate?: string;
  cancellationReason?: string;
  citizenship?: CitizenshipType;
  gender: string;
  livedInBC?: LivedInBCType;
  mailingAddress?: AddressType;
  marriageDate?: string;
  name: NameType;
  outsideBC?: OutsideBCType;
  outsideBCinFuture?: OutsideBCType;
  phn: string;
  previousCoverage?: PreviousCoverageType;
  previousLastName?: string;
  willBeAway?: WillBeAwayType;
}

export interface LivedInBCType {
  hasLivedInBC: string;
  isPermanentMove?: string;
  prevHealthNumber?: string;
  prevProvinceOrCountry?: string;
  recentBCMoveDate?: string;
  recentCanadaMoveDate?: string;
}

export interface OutsideBCType {
  beenOutsideBCMoreThan: string;
  departureDate?: string;
  destination?: string;
  familyMemeberReason?: string;
  returnDate?: string;
}

export interface PreviousCoverageType {
  hasPreviousCoverage: string;
  prevPHN?: string;
}

export interface WillBeAwayType {
  armedDischargeDate?: string;
  armedForceInstitutionName?: string;
  isFullTimeStudent: string;
  isInBCafterStudies?: string;
}

export interface AssistanceApplicationType {
  applicant: AssistanceApplicantType;
  authorizedByApplicant: string;
  authorizedByApplicantDate: string;
  authorizedBySpouse: string;
  spouse?: AssistanceSpouseType;
}

export interface AssistanceApplicantType {
  attachmentUuids?: string[];
  birthDate: string;
  financials: FinancialsType;
  gender?: string;
  mailingAddress: AddressType;
  name: NameType;
  phn: string;
  powerOfAttorney: string;
  SIN: string;
  telephone?: string;
}

export interface FinancialsType {
  adjustedNetIncome: number;
  assistanceYear: AssistanceYearType;
  childCareExpense?: number;
  childDeduction: number;
  deductions: number;
  disabilityDeduction?: number;
  disabilitySavingsPlan?: number;
  netIncome: number;
  numberOfTaxYears: string;
  numChildren?: number;
  numDisabled?: number;
  sixtyFiveDeduction: number;
  spouseDeduction?: number;
  spouseNetIncome?: number;
  spouseSixtyFiveDeduction?: number;
  taxYear: string;
  totalDeductions: number;
  totalNetIncome: number;
  uccb?: number;
}

export enum AssistanceYearType {
  CurrentPA = 'CurrentPA',
  MultiYear = 'MultiYear',
  PreviousTwo = 'PreviousTwo'
}

export interface AssistanceSpouseType {
  attachmentUuids?: string[];
  birthDate: string;
  name: NameType;
  phn: string;
  SIN: string;
  spouseDeduction?: number;
  spouseSixtyFiveDeduction?: number;
}

export interface EnrolmentApplicationType {
  applicant: EnrolmentApplicantType;
  children?: any[];
  dependents?: any[];
  spouse?: PersonType;
}

export interface EnrolmentApplicantType {
  attachmentUuids: string[];
  authorizedByApplicant: string;
  authorizedByApplicantDate: string;
  authorizedBySpouse: string;
  birthDate: string;
  gender: string;
  mailingAddress?: AddressType;
  name: NameType;
  residenceAddress: AddressType;
  residency: ResidencyType;
  telephone?: string;
}

export interface ResidencyType {
  citizenshipStatus: CitizenshipStatus;
  livedInBC: LivedInBCType;
  outsideBC: OutsideBCType;
  outsideBCinFuture?: OutsideBCType;
  previousCoverage: PreviousCoverageType;
  willBeAway: WillBeAwayType;
}

export interface CitizenshipStatus {
  attachmentUuids: string[];
  citizenshipType: CitizenshipType;
}

export interface PersonType {
  attachmentUuids: string[];
  birthDate: string;
  gender: string;
  name: NameType;
  residency: ResidencyType;
}

export interface SupplementaryBenefitsApplicationType {
  /**
   * Adjusted Net Income
   */
  adjustedNetIncome: number;
  /**
   * Applicant Address Line 1
   */
  applicantAddressLine1: string;
  /**
   * Applicant Address Line 2
   */
  applicantAddressLine2?: string;
  /**
   * Applicant Address Line 3
   */
  applicantAddressLine3?: string;
  applicantAttachmentUuids: string[];
  /**
   * Birthdate of Applicant
   */
  applicantBirthdate: string;
  /**
   * Applicant City
   */
  applicantCity: string;
  /**
   * Applicant Country
   */
  applicantCountry: string;
  /**
   * Applicant First Name
   */
  applicantFirstName: string;
  /**
   * Gender of Applicant
   */
  applicantGender?: string;
  /**
   * Applicant Last Name
   */
  applicantLastName: string;
  /**
   * PHN of Applicant
   */
  applicantPHN: string;
  /**
   * PostalCode of Applicant
   */
  applicantPostalCode: string;
  /**
   * Applicant Province or State
   */
  applicantProvinceOrState: string;
  /**
   * Applicant Middle Name
   */
  applicantSecondName: string;
  /**
   * SIN of Applicant
   */
  applicantSIN: string;
  /**
   * Telephone of Applicant
   */
  applicantTelephone: string;
  /**
   * Assistance Year
   */
  assistanceYear: string;
  /**
   * Applicant authorization
   */
  authorizedByApplicant: string;
  /**
   * Date of authorization
   */
  authorizedByApplicantDate: string;
  /**
   * Spouse authorization
   */
  authorizedBySpouse?: string;
  /**
   * Child Care Expense
   */
  childCareExpense: number;
  /**
   * Child Deduction
   */
  childDeduction: number;
  /**
   * Deductions
   */
  deductions: number;
  /**
   * Disability Deduction
   */
  disabilityDeduction: number;
  /**
   * Net Income Last Year
   */
  netIncomeLastYear: number;
  /**
   * Number of Tax Years
   */
  numberOfTaxYears: number;
  /**
   * Number of Children
   */
  numChildren: number;
  /**
   * Number of Disabled persons in care
   */
  numDisabled: number;
  /**
   * Power of attorney
   */
  powerOfAttorney: string;
  /**
   * Reported UCC Benefit Line 117
   */
  reportedUCCBenefit: number;
  /**
   * Sixty Five years age deduction
   */
  sixtyFiveDeduction: number;
  spouseAttachmentUuids?: string[];
  /**
   * Birthdate of Spouse
   */
  spouseBirthdate?: string;
  /**
   * Spouse Deduction
   */
  spouseDeduction: number;
  /**
   * Spouse DSP Amount Line 125
   */
  spouseDSPAmount: number;
  /**
   * Spouse First Name
   */
  spouseFirstName?: string;
  /**
   * Spouse Income line 236
   */
  spouseIncomeLine236: number;
  /**
   * Spouse Last Name
   */
  spouseLastName?: string;
  /**
   * PHN of Spouse
   */
  spousePHN?: string;
  /**
   * Spouse Middle Name
   */
  spouseSecondName?: string;
  /**
   * SIN of Spouse
   */
  spouseSIN?: string;
  /**
   * Spouse 65 years old deduction
   */
  spouseSixtyFiveDeduction?: number;
  /**
   * Tax Year
   */
  taxYear: string;
  /**
   * Total Deductions
   */
  totalDeductions: number;
  /**
   * Total Net Income
   */
  totalNetIncome: number;
}
