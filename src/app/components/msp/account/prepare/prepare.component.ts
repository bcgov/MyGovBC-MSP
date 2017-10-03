import {ChangeDetectorRef, Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';


import {MspAccount,AccountChangeOptions} from '../../model/account.model';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { MspDataService } from '../../service/msp-data.service';
import {MspConsentModalComponent} from "../../common/consent-modal/consent-modal.component";
import {ProcessService, ProcessStep, ProcessUrls} from "../../service/process.service";
import {BaseComponent} from "../../common/base.component";


@Component({
    templateUrl: './prepare.component.html'
})
@Injectable()
export class AccountPrepareComponent extends BaseComponent {
    static ProcessStepNum = 0;
    lang = require('./i18n');
    mspAccount: MspAccount;
    accountChangeOptions:AccountChangeOptions;

    @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

    constructor(private cd: ChangeDetectorRef, private dataService: MspDataService, private _processService: ProcessService ,private _router: Router) {
        super(cd);
        this.mspAccount = dataService.getMspAccount();
        this.accountChangeOptions = this.mspAccount.accountChangeOptions;
    }

    ngOnInit() {
        this.initProcessMembers(AccountPrepareComponent.ProcessStepNum, this._processService);
    }
    ngAfterContentInit() {
        if (!this.mspAccount.infoCollectionAgreement) {
            this.mspConsentModal.showFullSizeView();
        }
    }



    canContinue(): boolean {
        return true;
    }

    next() {
        if (this.mspAccount.infoCollectionAgreement !== true) {
            return this.mspConsentModal.showFullSizeView();
        }
        if (this.accountChangeOptions.addressUpdate && !(this.accountChangeOptions.personInfoUpdate ||this.accountChangeOptions.depdendentChange || this.accountChangeOptions.statusUpdate ) ) {
            window.location.href = "https://www.addresschange.gov.bc.ca/";
            return;
        }

        // Resets  te process
        this._processService.init([
            new ProcessStep(ProcessUrls.ACCOUNT_PREPARE_URL),
            new ProcessStep(ProcessUrls.ACCOUNT_FILE_UPLOADER_URL),
            new ProcessStep(ProcessUrls.ACCOUNT_REVIEW_URL),
            new ProcessStep(ProcessUrls.ACCOUNT_SENDING_URL)]);

        this.setupProcessStepsFromSelection();
        this._processService.setStep(0, true);
        this.dataService.emptyMspProgressBar();
        this._router.navigate([this._processService.getNextStep()]);

    }
    /*
    Depending on users selection , second and third steps will be introduced.
        user selects PI Update OR Update status in canada ==> first step=personal-info
        user selects Dependent Change  ==>  Next step=Dependent change
    */
    private setupProcessStepsFromSelection() : void {
           var stepNumber:number = 1 ;

        if (this.accountChangeOptions.personInfoUpdate || this.accountChangeOptions.statusUpdate) {
                this._processService.addStep(new ProcessStep(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL), stepNumber);
                stepNumber++;
            }
            if (this.accountChangeOptions.depdendentChange) {
                this._processService.addStep(new ProcessStep(ProcessUrls.ACCOUNT_DEPENDENTS_URL), stepNumber);
            }
    }
    isValid(): boolean {
        //make sure at least one checkbox is selected
        if (!(this.accountChangeOptions.personInfoUpdate || this.accountChangeOptions.depdendentChange || this.accountChangeOptions.statusUpdate || this.accountChangeOptions.addressUpdate)) {
            return false;
        }

        return true;
    }
}