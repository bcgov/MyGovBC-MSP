/**
 * ID documents for account management changes
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
        let nameBirthDate: DocumentGroup = new DocumentGroup("Name/BirthDate", "name or birthdate",
            [Documents.CanadianBirthCertificate, Documents.CanadianCitizenCard]);

        let marriageDivorceLegalName: DocumentGroup = new DocumentGroup("Marriage, divorce or a legal name change", "divorce or a legal name change",
            [Documents.MarriageCertificate,
            Documents.DivorceDecree,
            Documents.ChangeOfNameCertificate, Documents.SeparationAgreement

        ]);

        let gender: DocumentGroup = new DocumentGroup("Gender", "Gender",
            [Documents.CanadianBirthCertificate, Documents.GenderDesignationAdult,Documents.GenderDesignationMinor]);

        let statusInCanada: DocumentGroup = new DocumentGroup("Status in Canada", "Status in Canada",
            [Documents.CanadianPassport, Documents.PermanentResidentCard,Documents.WorkPermit,
                Documents.StudyPermit, Documents.VisitorVisa,Documents.LandedImmigrationDocs,
                Documents.ReligiousWorkerPermit, Documents.ReligiousConfirmationOrder,Documents.FoilDiplomaticPassport]);


        return [nameBirthDate, marriageDivorceLegalName, gender, statusInCanada];
    }

}

class DocumentGroup {
    title: String;
    caption: String;
    docs: Documents[];

    constructor(title: String, caption: String, docs: Documents[]) {
        this.title = title;
        this.caption = caption;
        this.docs = docs;
    }
}


export {AccountDocumentRules, Documents, DocumentGroup};