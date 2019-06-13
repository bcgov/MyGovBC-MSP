// Moved from account-documents/i18n
export const LangAccountDocuments = {
    0: ['Canadian Birth certificate', true],
    1: ['Canadian Passport', true],
    2: ['Canadian Citizenship card or certificate (front and back)', true],
    3: ['Record of Landing', true],
    4: ['Permanent Resident Card (front and back)', true],
    5: ['Work permit', true],
    6: ['Study permit', true],
    7: ['Visitor permit', true],
    8: ['Passport with diplomatic foil', true],
    9: ['Marriage Certificate', true],
    10: ['Certificate of Name Change', true],
     11: ['Divorce Decree (required for retroactive requests)', false],
      12: ['Separation Agreement (formerly married or common-law)', false],
      13: ['Landed Immigration Documents', true],
      14: ['Permit indicating Religious Worker or confirmation of service for religious order', false],
      15: ['Confirmation of their religious service from their religious order', false],
      16: ['Acceptance Foil from your diplomatic passport', false],
      17: ['Verification of Adoption', false],
      18: ['Current Immigration Document used by Immigration, Refugees, and Citizenship Canada', false],
      19: ['BC Driver’s License', true],
      20: ['Application for Change of Gender Designation (Adult)', true],
      21: ['Application for Change of Gender Designation (Minor)', true],
      22: ['Request for Waiver of Parental Consent (Minor) (for under 19 years )', true],
      23: ['Physician’s or Psychologist’s Confirmation of Change of Gender Designation form', true],
      24: ['A Statement dated and signed by you and/or your spouse, including:' +
      '<ul><li class="roundbullet">The date of divorce/separation;</li>' +
      '<li class="roundbullet">Full names of you and your former spouse;</li>' +
      '<li class="roundbullet">Your former spouse’s current address, or an indication that the new address is unknown; and</li>' +
      '<li class="roundbullet">Account numbers or PHNs for you and your former spouse</li></ul>', false],
      25: ['Notarized statement or affidavit (signed by at least one spouse)(formerly married or common-law)', false],
      26: ['Confirmation of Permanent Residence', false],
      27: ['Authorization to work in Canada under the Working Holiday program or International Experience Canada program: a letter confirming employment details including start date, end date and hours of work per week.', false],
      28: ['Notice of Decision for Convention Refugee status', false],
      29: ['A visitor permit is acceptable for the spouse of an Account Holder on a Work or Study permit. If you are sponsoring your spouse for Permanent Residence, please contact HIBC', false],
      30: ['A visitor permit is acceptable for the child of an Account Holder on a Work or Study permit', false],
      31: ['Foreign long form birth certificate (if child born outside of Canada to a Canadian parent and awaiting Canadian Citizenship)', false],
      32: ['For a newly adopted child or new guardianship: Contact HIBC', false],
      33: ['Notarized statement or affidavit (signed by at least one spouse; formerly married or common-law)', false],
      34: ['Signed Statement (including both Personal Health Numbers, separate addresses and signed by at least one party)'],
      35: ['Divorce Decree', false],
  };



/**
 * Documents for account management changes the user may upload as supporting
 * documentation, e.g. passport.
 */
enum Documents {
    CanadianBirthCertificate,   //0
    CanadianPassport,           //1
    CanadianCitizenCard, //2
    RecordOfLanding, //3
    PermanentResidentCard, //4
    WorkPermit, //5
    StudyPermit, //6
    VisitorVisa, //7
    PassportWithDiplomaticFoil, //8
    MarriageCertificate, //9
    ChangeOfNameCertificate, //10
    //new docs for account management
    DivorceDecreeRequiredForRetro, //11
    SeparationAgreement, //12
    LandedImmigrationDocs, //13
    ReligiousWorkerPermit, //14
    ReligiousConfirmationOrder, //15
    FoilDiplomaticPassport, //16
    AdoptionVerification, //17
    CurrentImigrationDocs, //18
    BCDriverLicense, //19
    GenderDesignationAdult, //20
    GenderDesignationMinor, //21
    WaiverParentalConsent, //22
    PhysicianConfirmationForGenderChange, //23
    MaritalStatusSignedWrittenStatement, //24
    NotarizedStatmentAffidavit, //25
    ConfirmationofPermanentResidence, //26
    AuthorisationToWorkInCanada , //27
    NoticeOfDecisionForConventionRefugeeStatus , //28
    VisitorPermitSpouse , //29
    VisitorPermitChild , //30
    ForeignLongFormBirthCertificate , //31
    NewlyAdoptedKidContactHIBC,
    SwornAffidavit,
    SignedStatement,
    DivorceDecree
}


/**
 * Account change has a different structure for documents section..
 * This can be modified if requirements changes

class AccountDocumentRules {

    static availiableDocuments(): DocumentGroup[] {

        //TODO! NOT DONE. MISSING EXAMPLE DOCS
        const addSpouseOrChildren: DocumentGroup = new DocumentGroup('Add Spouse or Child(ren)', [
            Documents.CanadianBirthCertificate,
            Documents.CanadianCitizenCard,
            Documents.CanadianPassport,
            Documents.LandedImmigrationDocs,
            Documents.PermanentResidentCard,
            Documents.StudyPermit,
            Documents.WorkPermit,
            Documents.ReligiousConfirmationOrder,
            Documents.ReligiousWorkerPermit,
            Documents.AdoptionVerification


        ]);
        //TODO! NOT DONE. MISSING EXAMPLE DOCS
        const removeSpouseOrChildren: DocumentGroup = new DocumentGroup('Remove Spouse or Child(ren)', [
            Documents.DivorceDecree,
            Documents.SeparationAgreement,
            Documents.NotarizedStatmentAffidavit,
            Documents.MaritalStatusSignedWrittenStatement
        ]);

        const updateBirthdate: DocumentGroup = new DocumentGroup('Update or Correct Birthdate', [
            Documents.CanadianBirthCertificate,
            Documents.CanadianCitizenCard,
            Documents.CanadianPassport,
            Documents.LandedImmigrationDocs,
            Documents.PermanentResidentCard,
            Documents.CurrentImigrationDocs
        ]);

        const updateName: DocumentGroup = new DocumentGroup('Update or Correct Name', [
            Documents.CanadianBirthCertificate,
            Documents.CanadianCitizenCard,
            Documents.CanadianPassport,
            Documents.ChangeOfNameCertificate,
            Documents.LandedImmigrationDocs,
            Documents.MarriageCertificate,
            Documents.PermanentResidentCard,
            Documents.CurrentImigrationDocs,
            Documents.DivorceDecree,
            Documents.SeparationAgreement,

        ]);

        const statusInCanada: DocumentGroup = new DocumentGroup('Update or Confirm Status in Canada', [
            Documents.CanadianPassport,
            Documents.LandedImmigrationDocs,
            Documents.PermanentResidentCard,
            Documents.StudyPermit,
            Documents.WorkPermit,
            Documents.ReligiousConfirmationOrder,
            Documents.CurrentImigrationDocs,
            Documents.FoilDiplomaticPassport,
            Documents.ReligiousWorkerPermit,

        ]);

        const genderCorrection: DocumentGroup = new DocumentGroup('Correct Gender', [
            Documents.BCDriverLicense,
            Documents.CanadianBirthCertificate,
            Documents.CanadianCitizenCard,
            Documents.CanadianPassport,
            Documents.LandedImmigrationDocs,
            Documents.PermanentResidentCard,
            Documents.CurrentImigrationDocs
        ]);

        const genderChange: DocumentGroup = new DocumentGroup('Change Gender Designation', [

            Documents.CanadianBirthCertificate,
            Documents.CanadianPassport,
            Documents.GenderDesignationAdult,
            Documents.GenderDesignationMinor,
            Documents.PhysicianConfirmationForGenderChange,
            Documents.WaiverParentalConsent
        ]);

        return [
            addSpouseOrChildren,
            removeSpouseOrChildren,
            updateBirthdate,
            updateName,
            statusInCanada,
            genderCorrection,
            genderChange
        ];
    }
}
 */


/**
 * A collection of documents which satisfy an account change, e.g. adding a
 * dependent, getting married/divorced, updating status in Canada.  Usually one
 * of the documents is sufficient for the user to provide.
 * Documents are put into Section because one set of documents might have two different sections
 */

class DocumentGroup {
    /** Human readable Title/Name, displayed to user. Title of the Accordion or group...*/
    title: String;

    section: {  label?: String ,  docs?: Documents[]}[];

    constructor(title: String ,  section?: {  label?: String ,  docs?: Documents[]}[]) {
        this.title = title;
        this.section = section;
    }
}


export {Documents, DocumentGroup};
