import { SampleImageInterface } from 'moh-common-lib';
// NOTE: Added to end of enums and strings so that we do not break sample documents modal
/**
 * Types of supporting documentation
 */
export enum SupportDocumentTypes {
  CanadianBirthCertificate,
  CanadianPassport,
  CanadianCitizenCard,
  DriverLicense,
  RecordOfLanding,
  PermanentResidentCard,
  PermanentResidentConfirmation,
  WorkPermit,
  StudyPermit,
  VisitorVisa,
  PassportWithDiplomaticFoil,
  MarriageCertificate,
  ChangeOfNameCertificate,
  ReligiousWorker,
  NoticeOfDecision,
  DiplomaticPassportAcceptance,
  WorkInCanadaAcceptance,
  DivorceDecree,
  ChangeGenderAdultApplication,
  ChangeGenderChildApplication,
  ChangeGenderPhyscianConfirmation,
  ParentalConsentWaiver,
  SeperationAgreement,
  NotrizedStatementOrAffidavit,
  Other
}

/**
 * Dropdown selections associated with SupportDocuments enums
 */
export const SupportDocumentList = {
  CanadianBirthCertificate: 'Canadian birth certificate',
  CanadianPassport: 'Canadian passport',
  CanadianCitizenCard: 'Canadian citizenship card or certificate',
  DriverLicense: 'Driving License',
  RecordOfLanding: 'Record of Landing',
  PermanentResidentCard: 'Permanent Resident Card',
  PermanentResidentConfirmation: 'Confirmation of Permanent Residence',
  WorkPermit: 'Work permit',
  StudyPermit: 'Study permit',
  VisitorVisa: 'Visitor permit',
  PassportWithDiplomaticFoil: 'Passport with diplomatic foil',
  MarriageCertificate: 'Marriage Certificate',
  ChangeOfNameCertificate: 'Legal Name Change Certificate',
  ReligiousWorker: 'Religious Worker',
  NoticeOfDecision : 'Notice Of Decision',
  DiplomaticPassportAcceptance : 'Diplomatic Passport Acceptance',
  WorkInCanadaAcceptance : 'Work In Canada Acceptance',
  DivorceDecree : 'Divorce Decree',
  ChangeGenderAdultApplication : 'Gender Adult Application',
  ChangeGenderChildApplication : 'Gender Child Application',
  ChangeGenderPhyscianConfirmation : 'Gender Physcian Confirmation',
  ParentalConsentWaiver : 'Parental Consent Waiver',
  SeperationAgreement : 'Seperation Agreement',
  NotrizedStatementOrAffidavit : 'Notrized Statement Or Affidavit',
  Other: 'Other',
};

// Must match order of enums
export const SupportDocumentSamples: SampleImageInterface[] = [
  // CanadianBirthCertificate
  { path: 'assets/canadian_birth_certs.jpg', desc: 'Pictures of various sample Canadian Birth Certificates' },
  // CanadianPassport
  { path: 'assets/Data_Page_of_Canadian_Passport.jpg', desc: 'A picture of a sample Canadian Passport' },
  // CanadianCitizenCard
  { path: 'assets/canadian_cit_card-cert.jpg', desc: 'Picture of a sample Canadian Citizenship Card and a Certificate' },
  // DriverLicense
  { path: 'assets/BC_driving_license.jpg', desc: 'A picture of a sample BC Driver’s License' },
  // RecordOfLanding
  { path: 'assets/record-of-landing.jpg', desc: 'A picture of a sample Record of Landing' },
  // PermanentResidentCard
  { path: 'assets/pr_card.jpg', desc: 'A picture of a sample Permanent Resident Card front and back' },
  // PermanentResidentConfirmation
  { path: null, desc: null },
  // WorkPermit
  { path: 'assets/work-permit.jpg', desc: 'A picture of a sample Work Permit' },
  // StudyPermit
  { path: 'assets/SP-new2013.jpg', desc: 'A picture of a sample Study Permit' },
  // VisitorVisa
  { path: 'assets/visitor-permit.jpg', desc: 'A picture of a sample Visitor Permit' },
  // PassportWithDiplomaticFoil
  { path: 'assets/acceptance-foil.jpg', desc: 'A picture of a sample Acceptance Foil' },
  // MarriageCertificate
  { path: 'assets/large-marriage-cert-big.jpg', desc: 'A picture of a sample B.C. Marriage Certificate' },
  // ChangeOfNameCertificate
  { path: 'assets/name-change-cert.jpg', desc: 'A picture of a sample Legal Name Change Certificate' }
  // Remaining documents need to be added here.
];
