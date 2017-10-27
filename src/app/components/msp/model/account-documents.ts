/**
 * Documents for account management changes the user may upload as supporting
 * documentation, e.g. passport.
 */
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
    FoilDiplomaticPassport
}


/**
 * Account change has a different structure for documents section..
 * This can be modified if requirements changes
 */
class AccountDocumentRules {

    static availiableDocuments(): DocumentGroup[] {

        //TODO! NOT DONE. MISSING EXAMPLE DOCS
        const addSpouseOrChildren: DocumentGroup = new DocumentGroup("Add Spouse or Child(ren)",[]);
        //TODO! NOT DONE. MISSING EXAMPLE DOCS
        const removeSpouseOrChildren: DocumentGroup = new DocumentGroup("Remove Spouse or Child(ren)",[]);
        
        let updateBirthdate: DocumentGroup = new DocumentGroup("Update or Correct Birthdate",[
            Documents.CanadianBirthCertificate, 
            Documents.CanadianCitizenCard
        ]);

        let updateName: DocumentGroup = new DocumentGroup("Update or Correct Name", [
            Documents.CanadianBirthCertificate,
            Documents.CanadianCitizenCard
        ]);

        let statusInCanada: DocumentGroup = new DocumentGroup("Update or Confirm Status in Canada",[
            Documents.CanadianPassport, 
            Documents.PermanentResidentCard,
            Documents.WorkPermit,
            Documents.StudyPermit, 
            Documents.VisitorVisa,
            Documents.LandedImmigrationDocs,
            Documents.ReligiousWorkerPermit, 
            Documents.ReligiousConfirmationOrder,
            Documents.FoilDiplomaticPassport
        ]);

        let gender: DocumentGroup = new DocumentGroup("Update or Correct Gender",[
            Documents.CanadianBirthCertificate,
            Documents.GenderDesignationAdult,
            Documents.GenderDesignationMinor
        ]);

        return [
            addSpouseOrChildren,
            removeSpouseOrChildren,
            updateBirthdate,
            updateName,
            statusInCanada,
            gender,            
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