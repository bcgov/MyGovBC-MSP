/**
 * Documents for account management changes the user may upload as supporting
 * documentation, e.g. passport.
 */
enum Documents {
    CanadianBirthCertificate,
    CanadianPassport,
    CanadianCitizenCard,
    RecordOfLanding,
    ConfirmationOfPR,
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
    WaiverParentalConsent,
    PhysicianConfirmationForGenderChange
}


/**
 * Account change has a different structure for documents section..
 * This can be modified if requirements changes
 */
class AccountDocumentRules {

    static availiableDocuments(): DocumentGroup[] {

        //TODO! NOT DONE. MISSING EXAMPLE DOCS
        const addSpouseOrChildren: DocumentGroup = new DocumentGroup("Add Spouse or Child(ren)",[
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
        const removeSpouseOrChildren: DocumentGroup = new DocumentGroup("Remove Spouse or Child(ren)",[
            Documents.DivorceDecree,
            Documents.SeparationAgreement,
        ]);
        
        let updateBirthdate: DocumentGroup = new DocumentGroup("Update or Correct Birthdate",[
            Documents.CanadianBirthCertificate,
            Documents.CanadianCitizenCard,
            Documents.CanadianPassport,
            Documents.LandedImmigrationDocs,
            Documents.PermanentResidentCard,
            Documents.CurrentImigrationDocs
        ]);

        let updateName: DocumentGroup = new DocumentGroup("Update or Correct Name", [
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

        let statusInCanada: DocumentGroup = new DocumentGroup("Update or Confirm Status in Canada",[
            Documents.CanadianPassport,
            Documents.LandedImmigrationDocs,
            Documents.PermanentResidentCard,
            Documents.StudyPermit,
            Documents.WorkPermit,
            Documents.ReligiousConfirmationOrder,
            Documents.FoilDiplomaticPassport,
            Documents.ReligiousWorkerPermit,

        ]);

        let genderCorrection: DocumentGroup = new DocumentGroup("Update or Correct Gender",[
            Documents.BCDriverLicense,
            Documents.CanadianBirthCertificate,
            Documents.CanadianCitizenCard,
            Documents.CanadianPassport,
            Documents.LandedImmigrationDocs,
            Documents.PermanentResidentCard,
            Documents.CurrentImigrationDocs
        ]);

        let genderChange: DocumentGroup = new DocumentGroup("Changing your Gender Designation",[

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

/**
 * A collection of documents which satisfy an account change, e.g. adding a
 * dependent, getting married/divorced, updating status in Canada.  Usually one
 * of the documents is sufficient for the user to provide.
 */
class DocumentGroup {
    /** Human readable name, displayed to user. */
    title: String;
    /** A list of all possible documents which satisfy the requirement for the DocumentGroup */
    docs: Documents[];

    constructor(title: String, docs: Documents[]) {
        this.title = title;
        this.docs = docs;
    }
}


export {AccountDocumentRules, Documents, DocumentGroup};