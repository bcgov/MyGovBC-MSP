import {Injectable} from '@angular/core';
import {MspDataService} from './msp-data.service';
import {DocumentGroup, Documents} from '../model/account-documents';
import {MspAccountApp} from '../model/account.model';
import {CancellationReasonsForSpouse, StatusInCanada} from '../model/status-activities-documents';


export class AccountCollection {
    static readonly UPDATE_NAME_DOCSLIST: DocumentGroup = new DocumentGroup('CORRECT/UPDATE NAME', [
        Documents.CanadianBirthCertificate,
        Documents.CanadianCitizenCard,
        Documents.CanadianPassport,
        Documents.ChangeOfNameCertificate,
        Documents.RecordOfLanding,
        Documents.ConfirmationofPermanentResidence,
        Documents.MarriageCertificate,
        Documents.PermanentResidentCard,
        Documents.DivorceDecree,
        Documents.SeparationAgreement]);

    //TODO - check 		Confirmation of Permanent Residenc doc
    static readonly UPDATE_BIRTH_DOCSLIST: DocumentGroup = new DocumentGroup('CORRECT BIRTHDATE', [
        Documents.CanadianBirthCertificate,
        Documents.CanadianCitizenCard,
        Documents.CanadianPassport,
        Documents.RecordOfLanding,
        Documents.ConfirmationofPermanentResidence,
        Documents.PermanentResidentCard]);
    static readonly CORRECT_GENDER: DocumentGroup = new DocumentGroup('CORRECT GENDER', [
        Documents.BCDriverLicense,
        Documents.CanadianBirthCertificate,
        Documents.CanadianCitizenCard,
        Documents.CanadianPassport,
        Documents.RecordOfLanding,
        Documents.ConfirmationofPermanentResidence,
        Documents.PermanentResidentCard]);
    static readonly UPDATE_GENDER_DESIGNATION_DOCSLIST: DocumentGroup = new DocumentGroup('CHANGE GENDER DESIGNATION', [
        Documents.CanadianBirthCertificate,
        Documents.CanadianPassport,
        Documents.GenderDesignationAdult,
        Documents.GenderDesignationMinor,
        Documents.PhysicianConfirmationForGenderChange,
        Documents.WaiverParentalConsent]);
    static readonly UPDATE_STATUS_TEMP: Documents[] = [
        Documents.StudyPermit,
        Documents.WorkPermit,
        Documents.AuthorisationToWorkInCanada,
        Documents.FoilDiplomaticPassport,
        Documents.ReligiousWorkerPermit,
        Documents.NoticeOfDecisionForConventionRefugeeStatus];
    static readonly UPDATE_STATUS_PR: Documents[] = [
        Documents.RecordOfLanding,
        Documents.PermanentResidentCard,
        Documents.ConfirmationofPermanentResidence
    ];
    static readonly UPDATE_STATUS_CITIZEN: Documents[] = [
        Documents.CanadianBirthCertificate,
        Documents.CanadianPassport];

    static readonly ADD_SPOUSE_DOCUMENTS_PR: Documents[] = [
        Documents.RecordOfLanding,
        Documents.ConfirmationofPermanentResidence,
        Documents.PermanentResidentCard
    ];
    static readonly ADD_SPOUSE_DOCUMENTS_CITIZEN: Documents[] = [
        Documents.CanadianBirthCertificate,
        Documents.CanadianCitizenCard,
        Documents.CanadianPassport
    ];
    static readonly ADD_SPOUSE_DOCUMENTS_TEMP: Documents[] = [
        Documents.StudyPermit,
        Documents.WorkPermit,
        Documents.VisitorPermitSpouse
    ];

    static readonly ADD_CHILD_DOCUMENTS_PR: Documents[] = [
        Documents.PermanentResidentCard,
        Documents.ConfirmationofPermanentResidence,
        Documents.LandedImmigrationDocs,

    ];
    static readonly ADD_CHILD_DOCUMENTS_CITIZEN: Documents[] = [
        Documents.CanadianBirthCertificate,
        Documents.CanadianCitizenCard
    ];
    static readonly ADD_CHILD_DOCUMENTS_TEMP: Documents[] = [
        Documents.WorkPermit,
        Documents.StudyPermit,
        Documents.VisitorPermitChild,
        Documents.ForeignLongFormBirthCertificate,
        Documents.NewlyAdoptedKidContactHIBC
    ];

    static readonly REMOVE_SPOUSE: Documents[] =  [
        Documents.DivorceDecreeRequiredForRetro,
        Documents.SeparationAgreement,
        Documents.SwornAffidavit,
        Documents.SignedStatement
    ];

    static readonly BLANK: DocumentGroup = new DocumentGroup('', []);

}

@Injectable({
    providedIn: 'root'
})

export class AccountDocumentHelperService {

    readonly NAME_CHANGE_TEXT = 'If you or your spouse’s name has changed as a result of a marriage or common-law relationship, please include one of the following documents:\n' +
        '<ul><li>Certificate of Name Change</li>' +
        '<li>Marriage Certificate</li></ul>';

    readonly ADD_CHILD_TEXT = '<ul><li>No documentation required</li>' +
        '<li>For a newly adopted child or new guardianship: Contact HIBC</li></ul>';

    readonly REMOVE_CHILD_TEXT = 'No documentation required (note: child will not be removed unless  currently covered under another MSP account)';
    readonly REMOVE_SPOUSE_TEXT = 'No documentation required ';


    private mspAccountApp: MspAccountApp;


    constructor(private dataService: MspDataService) {
        this.mspAccountApp = this.dataService.getMspAccountApp();
    }

    getApplicableDocuments(): DocumentGroup[] {


        let documentGroup: DocumentGroup[] = [];

        /*
        these methods are written to avoid lot of if's
        They return blank Documents if conditions don't satisfy.. the blanks will be later removed while returning from method
        if the conditions satisfy , they return the relevant docs for the users action
         */
        documentGroup = documentGroup.concat(this.addIfPIIsSelected());
        documentGroup.push(this.addIfStatusIsUpdated());
        documentGroup.push(this.addIfSpouseIsAdded());
        documentGroup.push(this.addIfChildIsAdded());
        documentGroup.push(this.addIfChildrenIsRemoved());
        documentGroup.push(this.addIfSpouseIsRemoved());

        // filter out blanks
        return documentGroup.filter(doc => doc !== AccountCollection.BLANK);
    }


    private addIfPIIsSelected(): DocumentGroup [] {
        const documentGroup: DocumentGroup[] = [];

        if (this.mspAccountApp.accountChangeOptions.personInfoUpdate) {
            documentGroup.push(AccountCollection.UPDATE_NAME_DOCSLIST);
            documentGroup.push(AccountCollection.UPDATE_BIRTH_DOCSLIST);
            documentGroup.push(AccountCollection.CORRECT_GENDER);
            documentGroup.push(AccountCollection.UPDATE_GENDER_DESIGNATION_DOCSLIST);
        } else {
            documentGroup.push(AccountCollection.BLANK);
        }

        return documentGroup;
    }

    private addIfStatusIsUpdated(): DocumentGroup {
        if (this.mspAccountApp.accountChangeOptions.statusUpdate) {
            const statusInCanada: DocumentGroup = new DocumentGroup('UPDATE OR CONFIRM STATUS IN CANADA', []);

            if (this.mspAccountApp.isAnyCanadianCitizeinPersonalInfoPage()) {
                statusInCanada.docs = statusInCanada.docs.concat(AccountCollection.UPDATE_STATUS_CITIZEN);
            }
            if (this.mspAccountApp.isAnyPRinPersonalInfoPage()) {
                statusInCanada.docs = statusInCanada.docs.concat(AccountCollection.UPDATE_STATUS_PR);
            }
            if (this.mspAccountApp.isAnyTempPersonalInfoPage()) {
                statusInCanada.docs = statusInCanada.docs.concat(AccountCollection
                    .UPDATE_STATUS_TEMP);
            }
            return statusInCanada;
        }

        return AccountCollection.BLANK;
    }

    private addIfSpouseIsAdded(): DocumentGroup {
        const addSpouse: DocumentGroup = new DocumentGroup('ADD SPOUSE', [], this.NAME_CHANGE_TEXT);

        if (!this.mspAccountApp.accountChangeOptions.dependentChange || !this.mspAccountApp.addedSpouse) {
            return AccountCollection.BLANK;
        }

        if (!this.mspAccountApp.addedSpouse.isExistingBeneficiary) {
            addSpouse.label =   addSpouse.label.concat( '<u>Also</u> include the following');
            if (this.mspAccountApp.addedSpouse.status === StatusInCanada.CitizenAdult) {
                addSpouse.docs = addSpouse.docs.concat(AccountCollection.ADD_SPOUSE_DOCUMENTS_CITIZEN);
            } else if (this.mspAccountApp.addedSpouse.status === StatusInCanada.PermanentResident) {
                addSpouse.docs = addSpouse.docs.concat(AccountCollection.ADD_SPOUSE_DOCUMENTS_PR);
            } else if (this.mspAccountApp.addedSpouse.status === StatusInCanada.TemporaryResident) {
                addSpouse.docs = addSpouse.docs.concat(AccountCollection.ADD_SPOUSE_DOCUMENTS_TEMP);
            }
            return addSpouse;
        } else {
            return addSpouse;
        }

    }


    private addIfChildIsAdded(): DocumentGroup {
        if (!this.mspAccountApp.accountChangeOptions.dependentChange || this.mspAccountApp.addedChildren.length <= 0) {
            return AccountCollection.BLANK;
        }

        const addChild: DocumentGroup = new DocumentGroup('ADD CHILD(REN)', []);
        if (this.mspAccountApp.addedChildren.filter(person => person.isExistingBeneficiary === false)[0]) {
            if (this.mspAccountApp.addedChildren.filter(person => person.status === StatusInCanada.CitizenAdult)[0]) {
                addChild.docs = addChild.docs.concat(AccountCollection.ADD_CHILD_DOCUMENTS_CITIZEN);
            }

            if (this.mspAccountApp.addedChildren.filter(person => person.status === StatusInCanada.PermanentResident)[0]) {
                addChild.docs = addChild.docs.concat(AccountCollection.ADD_CHILD_DOCUMENTS_PR);
            }

            if (this.mspAccountApp.addedChildren.filter(person => person.status === StatusInCanada.TemporaryResident)[0]) {
                addChild.docs = addChild.docs.concat(AccountCollection.ADD_CHILD_DOCUMENTS_TEMP);
            }

            return addChild;
        } else {
            addChild.label = this.ADD_CHILD_TEXT;
            return addChild;
        }

    }


    private addIfChildrenIsRemoved(): DocumentGroup {
        const removeChild: DocumentGroup = new DocumentGroup('REMOVE CHILD(REN)', [], this.REMOVE_CHILD_TEXT);

        if (this.mspAccountApp.removedChildren && this.mspAccountApp.removedChildren.length > 0) {
            return removeChild;
        }
        return AccountCollection.BLANK;
    }

    private addIfSpouseIsRemoved(): DocumentGroup {

    const removeSpouse: DocumentGroup = new DocumentGroup('REMOVE SPOUSE', []);
        if (this.mspAccountApp.removedSpouse) {
            console.log(CancellationReasonsForSpouse[this.mspAccountApp.removedSpouse.reasonForCancellation]) ;
            if (this.mspAccountApp.removedSpouse.reasonForCancellation === CancellationReasonsForSpouse[CancellationReasonsForSpouse.SeparatedDivorced]) {
                removeSpouse.docs = AccountCollection.REMOVE_SPOUSE;
            } else {
                removeSpouse.label = this.REMOVE_SPOUSE_TEXT;
            }
            return removeSpouse;
        }
        return AccountCollection.BLANK;
    }
}
