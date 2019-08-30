
/**
 * ID documents
 */
export enum Documents {
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
export class MspDocumentConstants {

  public static documentList = {
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

  public static langDocument(): string[] {
    return Object.keys(this.documentList).map( x => this.documentList[x] );
  }
}
