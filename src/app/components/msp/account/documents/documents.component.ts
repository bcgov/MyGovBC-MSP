import {ChangeDetectorRef, Component, Injectable, ViewChild} from '@angular/core';

import {MspDataService} from '../../service/msp-data.service';
import {Router} from '@angular/router';
import {BaseComponent} from "../../common/base.component";
import {LocalStorageService} from 'angular-2-local-storage';
import {MspAccountApp, AccountChangeOptions} from '../../model/account.model';
import {AccountDocumentRules, DocumentGroup} from '../../model/account-documents';
import {
    StatusRules, ActivitiesRules, StatusInCanada, Activities,
    DocumentRules, Documents, Relationship
} from "../../model/status-activities-documents";
import {ProcessService,ProcessUrls} from "../../service/process.service";
import {MspImage} from "../../../msp/model/msp-image";
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
import {MspImageErrorModalComponent} from "../../common/image-error-modal/image-error-modal.component";
import {MspIdReqModalComponent} from "../../common/id-req-modal/id-req-modal.component";

@Component({
    templateUrl: './documents.html'
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
    get documents(): DocumentGroup[] {
        return AccountDocumentRules.availiableDocuments();
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

    viewIdReqModal(event:Documents) {
        this.idReqModal.showFullSizeView(event);
    }

    get canContinue(): boolean {
        if (this.mspAccountApp.documents.length > 0) {
            return true;
        }
        return false;
    }

    continue(): void {

        this._processService.setStep(AccountDocumentsComponent.ProcessStepNum, true);
        console.log('this._processService.getNextStep():'+this._processService.getNextStep());
        this._router.navigate([this._processService.getNextStep()]);
    }

}