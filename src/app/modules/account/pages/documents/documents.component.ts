import {ChangeDetectorRef, Component, Injectable, ViewChild, ElementRef} from '@angular/core';

import {MspDataService} from '../../../../services/msp-data.service';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../models/base.component';
import {LocalStorageService} from 'angular-2-local-storage';

import {MspImage} from '../../../../models/msp-image';
//import {FileUploaderComponent} from 'moh-common-lib/lib/components';
import {MspImageErrorModalComponent} from '../../../../modules/msp-core/components/image-error-modal/image-error-modal.component';
import {MspIdReqModalComponent} from '../../../../modules/msp-core/components/id-req-modal/id-req-modal.component';
import { MspAccountApp } from '../../models/account.model';
import { DocumentGroup, LangAccountDocuments } from '../../../../models/account-documents';
import { AccountDocumentHelperService } from '../../../benefit/services/account-document-helper.service';
import { Documents, CancellationReasonsForSpouse } from '../../../../models/status-activities-documents';
import { LegalStatus, StatusActivites } from '../../../../models/msp.contants';

@Component({
    templateUrl: './documents.component.html'
})
@Injectable()
export class AccountDocumentsComponent extends BaseComponent {

    static ProcessStepNum = 1;
    lang = require('./i18n');
    mspAccountApp: MspAccountApp;
    @ViewChild('fileUploader') fileUploader: ElementRef;
    @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;
    @ViewChild('idReqModal') idReqModal: MspIdReqModalComponent;

    langStatus = LegalStatus;
    langActivities = StatusActivites
    documentsList: DocumentGroup[] ;

    langAccountDocuments = LangAccountDocuments;

    constructor(private dataService: MspDataService,
                private _router: Router,
                //private _processService: ProcessService,
                private accountDocumentHelperService: AccountDocumentHelperService ,
                private cd: ChangeDetectorRef, private localStorageService: LocalStorageService) {

        super(cd);
        this.mspAccountApp = dataService.getMspAccountApp();
    }

    ngOnInit() {

       // AccountDocumentsComponent.ProcessStepNum = this._processService.getStepNumber(ProcessUrls.ACCOUNT_FILE_UPLOADER_URL);
       // this.initProcessMembers(AccountDocumentsComponent.ProcessStepNum, this._processService);
        this.documentsList = this.accountDocumentHelperService.getApplicableDocuments() ;
    }

    /**
     * Gets the available documents given the known status and activity
     */


    get documentsApplicable(): DocumentGroup[] {
        return this.documentsList;
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
        return Object.keys(this.documentsList).map(x => parseInt(x, 10));
    }

    onImagesChange(doc: Document, img: MspImage) {
        console.log('onImagesChanges', img);
       // this.documentsChange.emit( this.documents ); // Not sure this will work
    }

    /*addDoc(doc: MspImage) {
        this.mspAccountApp.documents = this.mspAccountApp.documents.concat(doc);
        //this.fileUploader.forceRender();
        this.dataService.saveMspAccountApp();
    }*/

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
        // reduntant logic.. the option moved to dependent change checkbox.
        /*if (this.mspAccountApp.accountChangeOptions.nameChangeDueToMarriage) {
            if (this.mspAccountApp.updatedChildren && this.mspAccountApp.updatedChildren .length > 0) {
                return false;
            }
            return true;
        }*/

        if (this.mspAccountApp.accountChangeOptions.statusUpdate || this.mspAccountApp.accountChangeOptions.personInfoUpdate) {
            return false;
        }


        if (this.mspAccountApp.accountChangeOptions.dependentChange) {
            if (this.mspAccountApp.removedSpouse && this.mspAccountApp.removedSpouse.reasonForCancellation === CancellationReasonsForSpouse[CancellationReasonsForSpouse.SeparatedDivorced] ) {
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
        //this._processService.setStep(AccountDocumentsComponent.ProcessStepNum, true);
       // this._router.navigate([this._processService.getNextStep(AccountDocumentsComponent.ProcessStepNum, )]);
        this._router.navigate(['/account/review']);
    }

}
