/**
 * ID documents
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
    ChangeOfNameCertificate
}


/**
 * Business rules for documents
 */
class AccountDocumentRules {

    static availiableDocuments(): DocumentGroup[] {
        return [new DocumentGroup("Name/BirthDate", "name or birthdate", [Documents.MarriageCertificate, Documents.ChangeOfNameCertificate]),
            new DocumentGroup("", "", [Documents.MarriageCertificate, Documents.VisitorVisa])];
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


export {AccountDocumentRules,Documents, DocumentGroup};