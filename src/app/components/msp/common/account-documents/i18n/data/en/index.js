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
  4: ['Confirmation of Permanent Residence',true],
  5: ['Permanent Resident Card (front and back)',true],
  6: ['Work permit',true],
  7: ['Study permit',true],
  8: ['Visitor permit',true],
  9: ['Passport with diplomatic foil',true],
  10: ['Marriage Certificate',true],
  11: ['Certificate of Name Change ',true],
   12:['Divorce Decree',false],
    13:['Separation Agreement',false],
    14:['Application for Change of Gender Designation (Adult)',true],
    15:['Application for Change of Gender Designation (Minor)',true],
    16:['Landed Immigration Documents',true],
    17:['Permit indicating Religious Worker',false],
    18:['Confirmation of your religious server from your religious order ',false],
    19:['Foil from your diplomatic passport',false],
    20:['Verification of Adoption',false],
    21:['Current Immigration Documents used by Citizenship and Immigration Canada',false],
    22:['BC Driver’s License',true],
    23:['Request for Waiver of Parental Consent (Minor) (for under 19 years )',true],
    24:['Physician’s or Psychologist’s Confirmation of Change of Gender Designation form',true]
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
