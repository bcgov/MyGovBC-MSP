import {Injectable} from '@angular/core';
import {MspDataService} from '../../../services/msp-data.service';
import {DocumentGroup, Documents} from '../../../models/account-documents';
import {MspAccountApp} from '../../account/models/account.model';
import {CancellationReasonsForSpouse, StatusInCanada} from '../../../models/status-activities-documents';


export class AccountCollection {

    static readonly UPDATE_NAME_DOCS: Documents[] = [
        Documents.CanadianBirthCertificate,
        Documents.CanadianCitizenCard,
        Documents.CanadianPassport,
        Documents.PermanentResidentCard,
        Documents.ConfirmationofPermanentResidence,
        Documents.RecordOfLanding,
        Documents.StudyPermit,
        Documents.WorkPermit,
        Documents.VisitorVisa,
        Documents.ChangeOfNameCertificate
    ];

    static readonly UPDATE_NAME_MARRIAGE: Documents[] = [
        Documents.ChangeOfNameCertificate,
        Documents.MarriageCertificate,
        Documents.DivorceDecree
    ];

    static readonly UPDATE_NAME_MARRIAGEORCOMMONLAW: Documents[] = [
        Documents.ChangeOfNameCertificate,
        Documents.MarriageCertificate
    ];

    //TODO - check 		Confirmation of Permanent Residence doc
    static readonly UPDATE_BIRTH_DOCSLIST: DocumentGroup = new DocumentGroup('CORRECT BIRTHDATE', [{
        docs: [
            Documents.BCDriverLicense,
            Documents.CanadianBirthCertificate,
            Documents.CanadianCitizenCard,
            Documents.CanadianPassport,
            Documents.PermanentResidentCard,
            Documents.ConfirmationofPermanentResidence,
            Documents.RecordOfLanding,
            Documents.StudyPermit,
            Documents.WorkPermit,
            Documents.VisitorVisa,
        ]
    }]);
    static readonly CORRECT_GENDER: DocumentGroup = new DocumentGroup('CORRECT GENDER', [{
        docs: [
            Documents.BCDriverLicense,
            Documents.CanadianBirthCertificate,
            Documents.CanadianCitizenCard,
            Documents.CanadianPassport,
            Documents.PermanentResidentCard,
            Documents.ConfirmationofPermanentResidence,
            Documents.RecordOfLanding,
            Documents.StudyPermit,
            Documents.WorkPermit,
            Documents.VisitorVisa,
        ]
    }]);
    static readonly UPDATE_GENDER_DESIGNATION_DOCSLIST: DocumentGroup = new DocumentGroup('CHANGE GENDER DESIGNATION', [{
        docs: [
            Documents.CanadianBirthCertificate,
            Documents.GenderDesignationAdult,
            Documents.GenderDesignationMinor,
            Documents.PhysicianConfirmationForGenderChange,
            Documents.WaiverParentalConsent
        ]
    }]);
    static readonly UPDATE_STATUS_TEMP: Documents[] = [
        Documents.StudyPermit,
        Documents.WorkPermit,
        Documents.AuthorisationToWorkInCanada,
        Documents.FoilDiplomaticPassport,
        Documents.ReligiousWorkerPermit,
        Documents.NoticeOfDecisionForConventionRefugeeStatus];
    static readonly UPDATE_STATUS_PR: Documents[] = [
        Documents.PermanentResidentCard,
        Documents.ConfirmationofPermanentResidence,
        Documents.RecordOfLanding,
    ];
    static readonly UPDATE_STATUS_CITIZEN: Documents[] = [
        Documents.CanadianBirthCertificate,
        Documents.CanadianCitizenCard,
        Documents.CanadianPassport];

    static readonly ADD_SPOUSE_DOCUMENTS_PR: Documents[] = [
        Documents.PermanentResidentCard,
        Documents.ConfirmationofPermanentResidence,
        Documents.RecordOfLanding
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
        Documents.RecordOfLanding,

    ];
    static readonly ADD_CHILD_DOCUMENTS_CITIZEN: Documents[] = [
        Documents.CanadianBirthCertificate,
        Documents.CanadianCitizenCard,
        Documents.CanadianPassport
    ];
    static readonly ADD_CHILD_DOCUMENTS_TEMP: Documents[] = [
        Documents.WorkPermit,
        Documents.StudyPermit,
        Documents.VisitorPermitChild,
        Documents.ForeignLongFormBirthCertificate,
        Documents.NewlyAdoptedKidContactHIBC
    ];

    static readonly REMOVE_SPOUSE: Documents[] = [
        Documents.DivorceDecree,
        Documents.SeparationAgreement,
        Documents.SwornAffidavit,
        Documents.MaritalStatusSignedWrittenStatement
    ];

    static readonly BLANK: DocumentGroup = new DocumentGroup('', []);

}

@Injectable({
    providedIn: 'root'
})

export class AccountDocumentHelperService {

    readonly NAME_CHANGE_TEXT_SPOUSE = 'If you or your spouse’s name has changed as a result of a marriage or common-law relationship, please include one of the following documents:';
    readonly NAME_CHANGE_TEXT_MARRIAGE = 'If your name has changed as a result of a marriage, please include one of the following documents:';
    readonly ALSO_INCLUDE_TEXT = '<u>Also</u> include the following';
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
            documentGroup.push(new DocumentGroup('CORRECT/UPDATE NAME',
                [{docs: AccountCollection.UPDATE_NAME_DOCS},
                    {label: this.NAME_CHANGE_TEXT_MARRIAGE, docs: AccountCollection.UPDATE_NAME_MARRIAGE}
                ]));
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
            let docs: Documents[] = [];
            if (this.mspAccountApp.isAnyCanadianCitizeinPersonalInfoPage()) {
                docs = docs.concat(AccountCollection.UPDATE_STATUS_CITIZEN);
            }
            if (this.mspAccountApp.isAnyPRinPersonalInfoPage()) {
                docs = docs.concat(AccountCollection.UPDATE_STATUS_PR);
            }
            if (this.mspAccountApp.isAnyTempPersonalInfoPage()) {
                docs = docs.concat(AccountCollection
                    .UPDATE_STATUS_TEMP);
            }
            statusInCanada.section.push({docs: docs});
            return statusInCanada;
        }

        return AccountCollection.BLANK;
    }

    private addIfSpouseIsAdded(): DocumentGroup {
        const nameChangeSection =    {label: this.NAME_CHANGE_TEXT_SPOUSE, docs: AccountCollection.UPDATE_NAME_MARRIAGEORCOMMONLAW};
        const addSpouse: DocumentGroup = new DocumentGroup('ADD SPOUSE' , [nameChangeSection]);

         if (!this.mspAccountApp.accountChangeOptions.dependentChange || !this.mspAccountApp.addedSpouse) {
             return AccountCollection.BLANK;
         }

         if (!this.mspAccountApp.addedSpouse.isExistingBeneficiary) {
             if (this.mspAccountApp.addedSpouse.status === StatusInCanada.CitizenAdult) {
                 addSpouse.section.push( {label: this.ALSO_INCLUDE_TEXT, docs: AccountCollection.ADD_SPOUSE_DOCUMENTS_CITIZEN});
             } else if (this.mspAccountApp.addedSpouse.status === StatusInCanada.PermanentResident) {
                 addSpouse.section.push( {label: this.ALSO_INCLUDE_TEXT, docs: AccountCollection.ADD_SPOUSE_DOCUMENTS_PR});
             } else if (this.mspAccountApp.addedSpouse.status === StatusInCanada.TemporaryResident) {
                 addSpouse.section.push( {label: this.ALSO_INCLUDE_TEXT, docs: AccountCollection.ADD_SPOUSE_DOCUMENTS_TEMP});
             }

         }
          return addSpouse;

    }


    private addIfChildIsAdded(): DocumentGroup {
        if (!this.mspAccountApp.accountChangeOptions.dependentChange || this.mspAccountApp.addedChildren.length <= 0) {
            return AccountCollection.BLANK;
        }

          const addChild: DocumentGroup = new DocumentGroup('ADD CHILD(REN)', []);
            let docs: Documents[] = [];
              if (this.mspAccountApp.addedChildren.filter(person => person.isExistingBeneficiary === false)[0]) {
                  if (this.mspAccountApp.addedChildren.filter(person => person.status === StatusInCanada.CitizenAdult)[0]) {
                      docs = docs.concat(AccountCollection.ADD_CHILD_DOCUMENTS_CITIZEN);
                  }

                  if (this.mspAccountApp.addedChildren.filter(person => person.status === StatusInCanada.PermanentResident)[0]) {
                      docs = docs.concat(AccountCollection.ADD_CHILD_DOCUMENTS_PR);
                  }

                  if (this.mspAccountApp.addedChildren.filter(person => person.status === StatusInCanada.TemporaryResident)[0]) {
                      docs = docs.concat(AccountCollection.ADD_CHILD_DOCUMENTS_TEMP);
                  }
                  addChild.section = [{docs : docs}];
              } else {
                  addChild.section = [{label : this.ADD_CHILD_TEXT}];
              }
          return addChild;
    }


    private addIfChildrenIsRemoved(): DocumentGroup {
        if (this.mspAccountApp.accountChangeOptions.dependentChange && this.mspAccountApp.removedChildren && this.mspAccountApp.removedChildren.length > 0) {
              return  new DocumentGroup('REMOVE CHILD(REN)', [{label: this.REMOVE_CHILD_TEXT}]);
        }
        return AccountCollection.BLANK;
    }

    private addIfSpouseIsRemoved(): DocumentGroup {
          if (this.mspAccountApp.accountChangeOptions.dependentChange && this.mspAccountApp.removedSpouse) {
              const removeSpouse: DocumentGroup = new DocumentGroup('REMOVE SPOUSE', []);
              if (this.mspAccountApp.removedSpouse.reasonForCancellation === CancellationReasonsForSpouse[CancellationReasonsForSpouse.SeparatedDivorced]) {
                  removeSpouse.section = [{docs: AccountCollection.REMOVE_SPOUSE}];
              } else {
                  removeSpouse.section = [{label: this.REMOVE_SPOUSE_TEXT}];
              }
              return removeSpouse;
          }
        return AccountCollection.BLANK;
    }
}
