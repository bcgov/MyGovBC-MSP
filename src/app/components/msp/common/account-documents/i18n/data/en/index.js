/*
the title of the documents differs for account management and others[enrollment and PA].
instead of using if's , created a new file.

true ==> document with sample.Show sample documents links
false ==> no samples can be provided. Dont show sample document link

 */
module.exports = {
  0: ['Canadian Birth certificate',true],
  1: ['Canadian Passport',true],
  2: ['Canadian Citizenship card or certificate',true],
  3:['Record of Landing',true],
  4: ['Permanent Resident Card (front and back)',true],
  5: ['Work permit',true],
  6: ['Study permit',true],
  7: ['Visitor permit',true],
  8: ['Passport with diplomatic foil',true],
  9: ['Marriage Certificate',true],
  10: ['Certificate of Name Change ',true],
   11:['Divorce Decree (formerly married)',false],
    12:['Separation Agreement (formerly married or common-law)',false],
    13:['Landed Immigration Documents',true],
    14:['Permit indicating Religious Worker',false],
    15:['Confirmation of their religious service from their religious order ',false],
    16:['Foil from your diplomatic passport',false],
    17:['Verification of Adoption',false],
    18:['Current Immigration Document used by Immigration, Refugees, and Citizenship Canada',false],
    19:['BC Driver’s License',true],
    20:['Application for Change of Gender Designation (Adult)',true],
    21:['Application for Change of Gender Designation (Minor)',true],
    22:['Request for Waiver of Parental Consent (Minor) (for under 19 years )',true],
    23:['Physician’s or Psychologist’s Confirmation of Change of Gender Designation form',true],
    24:['A Statement dated and signed by you and/or your spouse, including:' +
    '<ul><li class="roundbullet">The date of divorce/separation;</li>' +
    '<li class="roundbullet">Full names of you and your former spouse;</li>' +
    '<li class="roundbullet">Your former spouse’s current address, or an indication that the new address is unknown; and</li>' +
    '<li class="roundbullet">Account numbers or PHNs for you and your former spouse</li></ul>',false],
    25:['Notarized statement or affidavit (signed by at least one spouse)(formerly married or common-law)',false]
}
/**
 * Should Match account-documents.ts ID documents

 enum Documents {
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
    ChangeOfNameCertificate,
    //new docs for account management
    DivorceDecree,
    SeparationAgreement,
    GenderDesignationAdult,
    GenderDesignationMinor,
    LandedImmigrationDocs,
    ReligiousWorkerPermit,
    ReligiousConfirmationOrder,
    FoilDiplomaticPassport,
    AdoptionVerification,
    CurrentImigrationDocs,
    BCDriverLicense,
    WaiverParentalConsent
}

*/
