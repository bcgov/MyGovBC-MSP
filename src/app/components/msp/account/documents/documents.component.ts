import {ChangeDetectorRef, Component, Injectable, ViewChild} from '@angular/core';

import {MspDataService} from '../../service/msp-data.service';
import {Router} from '@angular/router';
import {BaseComponent} from '../../common/base.component';
import {LocalStorageService} from 'angular-2-local-storage';
import {MspAccountApp, AccountChangeOptions} from '../../model/account.model';
import {AccountDocumentRules, DocumentGroup} from '../../model/account-documents';
import {
    StatusRules, ActivitiesRules, StatusInCanada, Activities,
    DocumentRules, Documents, Relationship , CancellationReasonsForSpouse
} from '../../model/status-activities-documents';
import {ProcessService, ProcessUrls} from '../../service/process.service';
import {MspImage} from '../../../msp/model/msp-image';
import {FileUploaderComponent} from '../../common/file-uploader/file-uploader.component';
import {MspImageErrorModalComponent} from '../../common/image-error-modal/image-error-modal.component';
import {MspIdReqModalComponent} from '../../common/id-req-modal/id-req-modal.component';
import {AccountDocumentHelperService} from '../../service/account-document-helper.service';

@Component({
    templateUrl: './documents.component.html'
})
@Injectable()
export class AccountDocumentsComponent extends BaseComponent {

    static ProcessStepNum = 1;
    lang = require('./i18n');
    mspAccountApp: MspAccountApp;
    @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
    @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;
    @ViewChild('idReqModal') idReqModal: MspIdReqModalComponent;
    langAccountDocuments = require('../../common/account-documents/i18n');
    langStatus = require('../../common/status/i18n');
    langActivities = require('../../common/activities/i18n');

    constructor(private dataService: MspDataService,
                private _router: Router,
                private _processService: ProcessService,
                private accountDocumentHelperService: AccountDocumentHelperService ,
                private cd: ChangeDetectorRef, private localStorageService: LocalStorageService) {

        super(cd);
        this.mspAccountApp = dataService.getMspAccountApp();
    }

    ngOnInit() {
        AccountDocumentsComponent.ProcessStepNum = this._processService.getStepNumber(ProcessUrls.ACCOUNT_FILE_UPLOADER_URL);
        this.initProcessMembers(AccountDocumentsComponent.ProcessStepNum, this._processService);
    }

    /**
     * Gets the available documents given the known status and activity
     */


    get documentsApplicable(): DocumentGroup[] {
        return this.accountDocumentHelperService.availiableDocuments();
    }


    /**
     * An array of integers with the indices of the different documents.  The
     * reason we have to do this is because of a glitch with ngx-bootstrap's
     * accordion, which if if passed an object in ngFor will break, but is fine
     * if you pass it an integer. Essentially, this enables us to ngFor over
     * this.documents.
     *
     * @example
     * [0, 1, 2, 3]
     */
    public documentIndices() {
        return Object.keys(this.accountDocumentHelperService.availiableDocuments()).map(x => parseInt(x, 10));
    }


    addDoc(doc: MspImage) {
        this.mspAccountApp.documents = this.mspAccountApp.documents.concat(doc);
        this.fileUploader.forceRender();
        this.dataService.saveMspAccountApp();
    }

    errorDoc(evt: MspImage) {
        this.mspImageErrorModal.imageWithError = evt;
        this.mspImageErrorModal.showFullSizeView();
        this.mspImageErrorModal.forceRender();
    }

    deleteDoc(doc: MspImage) {
        this.mspAccountApp.documents = this.mspAccountApp.documents
            .filter(d => {
                return d.id !== doc.id;
            });
        this.dataService.saveMspAccountApp();
    }

    viewIdReqModal(event: Documents) {
        this.idReqModal.showFullSizeView(event);
    }

    /**
     * To decide if documents are mandatory for upload.
     * logic is to figure out all conditions which needs document upload.
     *
     *  if nameChangeDueToMarriage - No Docs Needed @returns True .Exclusive Condition
     *  if status update  or PI - Docs needed   @return false
     *
     *  if Depdendent option is selected
     *      if there is removal of spouse , Docs needed  @return false     *
     *      if any of the  added spouse/children is new beneficiary @returns false
     *      otherwise[might include removal of child] return true
     *  Removing Spouse - No documentation needed except for the divorce

     */
    get isDocsNotNeeded(): boolean {
        const docsNotNeeded: boolean = false;
        if (this.mspAccountApp.accountChangeOptions.nameChangeDueToMarriage) {
            if (this.mspAccountApp.updatedChildren && this.mspAccountApp.updatedChildren .length > 0) {
                return false;
            }
            return true;
        }

        if (this.mspAccountApp.accountChangeOptions.statusUpdate || this.mspAccountApp.accountChangeOptions.personInfoUpdate) {
            return false;
        }


        if (this.mspAccountApp.accountChangeOptions.dependentChange) {
            if (this.mspAccountApp.removedSpouse && this.mspAccountApp.removedSpouse.reasonForCancellation ==   CancellationReasonsForSpouse[CancellationReasonsForSpouse.SeparatedDivorced] ) {
                return false;
            }

            if (this.mspAccountApp.addedSpouse && !this.mspAccountApp.addedSpouse.isExistingBeneficiary) {
                return false;
            }
            if (this.mspAccountApp.addedChildren.filter(person => person.isExistingBeneficiary === false)[0]) {
                return false;
            }
            return true;

        }
        return false; //Just default..Never reaches here ideally
    }

    get canContinue(): boolean {

        if (this.isDocsNotNeeded || this.mspAccountApp.documents.length > 0) {
            return true;
        }
        return false;
    }

    continue(): void {
        this._processService.setStep(AccountDocumentsComponent.ProcessStepNum, true);
        this._router.navigate([this._processService.getNextStep(AccountDocumentsComponent.ProcessStepNum, )]);
    }

}
