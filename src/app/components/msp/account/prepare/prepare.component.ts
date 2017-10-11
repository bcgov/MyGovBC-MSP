import {ChangeDetectorRef, Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';


import {MspAccountApp, AccountChangeOptions} from '../../model/account.model';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import {MspDataService} from '../../service/msp-data.service';
import {MspConsentModalComponent} from "../../common/consent-modal/consent-modal.component";
import {ProcessService,ProcessStep} from "../../service/process.service";
import {ProcessUrls} from "../../service/process.service";
import {BaseComponent} from "../../common/base.component";


@Component({
    templateUrl: './prepare.component.html'
})
@Injectable()
export class AccountPrepareComponent extends BaseComponent {
    static ProcessStepNum = 0;
    lang = require('./i18n');
    mspAccountApp: MspAccountApp;
    accountChangeOptions: AccountChangeOptions;

    @ViewChild('addressChangeChkBx') addressChangeChkBx: ElementRef;
    @ViewChild('personalInfoChangeChkBx') personalInfoChangeChkBx: ElementRef;
    @ViewChild('dependentChangeChkBx') dependentChangeChkBx: ElementRef;
    @ViewChild('updateStatusInCanadaChkBx') updateStatusInCanadaChkBx: ElementRef;
    @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;
    @ViewChild('formRef') form: NgForm;

    constructor(private cd: ChangeDetectorRef, private dataService: MspDataService, private _processService: ProcessService, private _router: Router) {
        super(cd);
        this.mspAccountApp = dataService.getMspAccountApp();
        this.accountChangeOptions = this.mspAccountApp.accountChangeOptions;
    }

    ngOnInit() {
        this.initProcessMembers(AccountPrepareComponent.ProcessStepNum, this._processService);
    }

    ngAfterViewInit() {
        if (!this.mspAccountApp.infoCollectionAgreement) {
            this.mspConsentModal.showFullSizeView();
        }

    }

    get hasOnlyAddressSelected(): boolean {
       return this.accountChangeOptions.hasOnlyAddressSelected();
    }


    canContinue(): boolean {
        return this.isAllValid();
    }

    next() {
        if (this.mspAccountApp.infoCollectionAgreement !== true) {
            return this.mspConsentModal.showFullSizeView();
        }
        if (this.accountChangeOptions.hasOnlyAddressSelected()) {
            window.location.href = "https://www.addresschange.gov.bc.ca/";
            return;
        }
        this.setupProcessStepsFromSelection();
        this._processService.setStep(0, true);
        this.dataService.emptyMspProgressBar();
        this.dataService.saveMspAccountApp();
        this._router.navigate([this._processService.getNextStep()]);

    }

    addressUpdateOnChange(event: boolean) {
        this.accountChangeOptions.addressUpdate = event;
        this.dataService.saveMspAccountApp();
    }

    personInfoUpdateOnChange(event: boolean) {
        this.accountChangeOptions.personInfoUpdate = event;
        this.dataService.saveMspAccountApp();
    }

    dependentChangeOnChange(event: boolean) {
        this.accountChangeOptions.dependentChange = event;
        this.dataService.saveMspAccountApp();
    }

    statusUpdateOnChange(event: boolean) {
        this.accountChangeOptions.statusUpdate = event;
        this.dataService.saveMspAccountApp();
    }

    /*
    Depending on users selection , second and third steps will be introduced.
        user selects PI Update OR Update status in canada ==> first step=personal-info
        user selects Dependent Change  ==>  Next step=Dependent change
    */
    private setupProcessStepsFromSelection(): void {

        // Resets  te process
        this._processService.init([
            new ProcessStep(ProcessUrls.ACCOUNT_PREPARE_URL),
            new ProcessStep(ProcessUrls.ACCOUNT_FILE_UPLOADER_URL),
            new ProcessStep(ProcessUrls.ACCOUNT_REVIEW_URL),
            new ProcessStep(ProcessUrls.ACCOUNT_SENDING_URL)]);

        var stepNumber: number = 1;

        if (this.accountChangeOptions.personInfoUpdate || this.accountChangeOptions.statusUpdate) {
            this._processService.addStep(new ProcessStep(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL), stepNumber);
            stepNumber++;
        }
        if (this.accountChangeOptions.dependentChange) {
            this._processService.addStep(new ProcessStep(ProcessUrls.ACCOUNT_DEPENDENTS_URL), stepNumber);
        }

    }

    isValid(): boolean {
        //make sure at least one checkbox is selected
        if (this.accountChangeOptions.hasAnyOptionSelected()) {
            return true;
        }

        return false;
    }
}