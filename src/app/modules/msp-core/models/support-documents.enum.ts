import { SampleImageInterface } from 'moh-common-lib';

/**
 * Types of supporting documentation
 */
export enum SupportDocuments {
  CanadianBirthCertificate,
  CanadianPassport,
  CanadianCitizenCard,
  RecordOfLanding,
  PermanentResidentCard,
  WorkPermit,
  StudyPermit,
  VisitorVisa,
  PassportWithDiplomaticFoil,
  MarriageCertificate,
  ChangeOfNameCertificate
}

/**
 * Dropdown selections associated with SupportDocuments enums
 */
export const SupportDocumentList = {
  CanadianBirthCertificate: 'Canadian birth certificate',
  CanadianPassport: 'Canadian passport',
  CanadianCitizenCard: 'Canadian citizenship card or certificate',
  RecordOfLanding: 'Confirmation of Permanent Residence',
  PermanentResidentCard: 'Permanent Resident Card (front and back)',
  WorkPermit: 'Work permit',
  StudyPermit: 'Study permit',
  VisitorVisa: 'Visitor permit',
  PassportWithDiplomaticFoil: 'Passport with diplomatic foil',
  MarriageCertificate: 'Marriage Certificate',
  ChangeOfNameCertificate: 'Legal Name Change Certificate'
};

// Must match order of enums
export const SupportDocumentSamples: SampleImageInterface[] = [
  { path: 'assets/canadian_birth_certs.jpg', desc: 'Pictures of various sample Canadian Birth Certificates' },
  { path: 'assets/Data_Page_of_Canadian_Passport.jpg', desc: 'A picture of a sample Canadian Passport' },
  { path: 'assets/canadian_cit_card-cert.jpg', desc: 'Picture of a sample Canadian Citizenship Card and a Certificate' },
  { path: 'assets/record-of-landing.jpg', desc: 'A picture of a sample Record of Landing' },
  { path: 'assets/pr_card.jpg', desc: 'A picture of a sample Permanent Resident Card front and back' },
  { path: 'assets/work-permit.jpg', desc: 'A picture of a sample Work Permit' },
  { path: 'assets/SP-new2013.jpg', desc: 'A picture of a sample Study Permit' },
  { path: 'assets/visitor-permit.jpg', desc: 'A picture of a sample Visitor Permit' },
  { path: 'assets/acceptance-foil.jpg', desc: 'A picture of a sample Acceptance Foil' },
  { path: 'assets/large-marriage-cert-big.jpg', desc: 'A picture of a sample B.C. Marriage Certificate' },
  { path: 'assets/name-change-cert.jpg', desc: 'A picture of a sample Legal Name Change Certificate' }
];
