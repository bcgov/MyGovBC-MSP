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
