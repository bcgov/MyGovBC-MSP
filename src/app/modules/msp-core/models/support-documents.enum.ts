import { SampleImageInterface } from 'moh-common-lib';
// NOTE: Added to end of enums and strings so that we do not break sample documents modal
/**
 * Types of supporting documentation
 */
export enum SupportDocumentTypes {
  CanadianBirthCertificate,
  CanadianPassport,
  CanadianCitizenCard,
  DriversLicense,
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
  ChangeGenderMinorApplication,
  ChangeGenderPhysicianConfirmation,
  ParentalConsentWaiver,
  SeparationAgreement,
  NotarizedStatementOrAffidavit,
  Other,
}

/**
 * Dropdown selections associated with SupportDocuments enums
 */
export const SupportDocumentList = {
  CanadianBirthCertificate: 'Canadian Birth Certificate',
  CanadianPassport: 'Canadian Passport',
  CanadianCitizenCard: 'Canadian Citizenship Card or Certificate',
  DriversLicense: 'BC Driver\'s License',
  RecordOfLanding: 'Record of Landing',
  PermanentResidentCard: 'Permanent Resident Card',
  PermanentResidentConfirmation: 'Confirmation of Permanent Residence',
  WorkPermit: 'Work Permit',
  StudyPermit: 'Study Permit',
  VisitorVisa: 'Visitor Permit',
  PassportWithDiplomaticFoil: 'Passport With Diplomatic Foil',
  MarriageCertificate: 'Marriage Certificate',
  ChangeOfNameCertificate: 'Name Change Certificate / Certificate of Name Change',
  ReligiousWorker: 'Religious Worker',
  NoticeOfDecision: 'Notice Of Decision',
  DiplomaticPassportAcceptance: 'Diplomatic Passport Acceptance',
  WorkInCanadaAcceptance: 'Work In Canada Acceptance',
  DivorceDecree: 'Divorce Decree',
  ChangeGenderAdultApplication:
    'Application for Change of Gender Designation (Adult)',
  ChangeGenderMinorApplication:
    'Application for Change of Gender Designation (Minor)',
  ChangeGenderPhysicianConfirmation:
    'Physician\'s or Psychologist Confirmation of Change of Gender Designation Form',
  ParentalConsentWaiver:
    'Request for Waiver of Parental Consent (minor) (for under 19 years)',
  SeparationAgreement: 'Separation Agreement',
  NotarizedStatementOrAffidavit: 'Notarized Statement Or Affidavit',
  Other: 'Other',
};

// Must match order of enums
export const SupportDocumentSamples: SampleImageInterface[] = [
  // CanadianBirthCertificate
  {
    path: 'assets/canadian_birth_certs.jpg',
    desc: 'Picture of various sample Canadian Birth Certificates',
  },
  // CanadianPassport
  {
    path: 'assets/canadian_passport.jpg',
    desc: 'Picture of a sample Canadian Passport',
  },
  // CanadianCitizenCard
  {
    path: 'assets/canadian_cit_card_cert.jpg',
    desc: 'Picture of a sample Canadian Citizenship Card and a Certificate',
  },
  // DriversLicense
  {
    path: 'assets/bc_drivers_license.jpg',
    desc: 'Picture of a sample BC Driver’s License',
  },
  // RecordOfLanding
  {
    path: 'assets/record_of_landing.jpg',
    desc: 'Picture of a sample Record of Landing',
  },
  // PermanentResidentCard
  {
    path: 'assets/perm_resident_card.jpg',
    desc: 'Picture of a sample Permanent Resident Card, front and back',
  },
  // PermanentResidentConfirmation
  {
    path: 'assets/TEMP_perm_residence_conf.jpg',
    desc: 'Picture of a sample Confirmation of Permanent Residence',
  },
  // WorkPermit
  { path: 'assets/work_permit.jpg', desc: 'Picture of a sample Work Permit' },
  // StudyPermit
  {
    path: 'assets/study_permit.jpg',
    desc: 'Picture of a sample Study Permit',
  },
  // VisitorVisa
  {
    path: 'assets/visitor_permit.jpg',
    desc: 'Picture of a sample Visitor Permit',
  },
  // PassportWithDiplomaticFoil
  {
    path: 'assets/acceptance_foil.jpg',
    desc: 'Picture of a sample Acceptance Foil',
  },
  // MarriageCertificate
  {
    path: 'assets/marriage_cert.jpg',
    desc: 'Picture of a sample B.C. Marriage Certificate',
  },
  // ChangeOfNameCertificate
  {
    path: 'assets/name_change_cert.jpg',
    desc: 'Picture of a sample Legal Name Change Certificate',
  },
  // ReligiousWorker
  {
    path: null,
    desc: null,
  },
  // NoticeOfDecision
  {
    path: null,
    desc: null,
  },
  // DiplomaticPassportAcceptance
  {
    path: null,
    desc: null,
  },
  // WorkInCanadaAcceptance
  {
    path: null,
    desc: null,
  },
  // DivorceDecree
  {
    path: 'assets/TEMP_divorce_decree.png',
    desc: 'Picture of a sample Divorce Decree',
  },
  // ChangeGenderAdultApplication
  {
    path: 'assets/app_change_gender_adult.jpg',
    desc: 'Picture of a Application for Change of Gender Designation (Adult)',
  },
  // ChangeGenderMinorApplication
  {
    path: 'assets/app_change_gender_minor.jpg',
    desc: 'Picture of a Application for Change of Gender Designation (Minor)',
  },
  // ChangeGenderPhysicianConfirmation:
  {
    path: 'assets/physician_conf_gender_designation.jpg',
    desc:
      'Picture of a Physician\'s or Psychologist Confirmation of Change of Gender Designation Form',
  },
  // ParentalConsentWaiver:
  {
    path: 'assets/request_waiver_parental_consent.jpg',
    desc:
      'Picture of a Request for Waiver of Parental Consent (minor) (for under 19 years) Form',
  },
  // SeparationAgreement
  {
    path: 'assets/separation_agreement.png',
    desc: 'Picture of a sample Separation Agreement',
  },
  // NotarizedStatementOrAffidavit
  {
    path: 'assets/affidavit.png',
    desc: 'Picture of a sample Affidavit',
  },
];
