import {ChangeDetectorRef, Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MspLogService} from '../../service/log.service'

import {MspAccountApp, AccountChangeOptions} from '../../model/account.model';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Gender, Person} from "../../model/person.model";
import {MspDataService} from '../../service/msp-data.service';
import {MspConsentModalComponent} from "../../common/consent-modal/consent-modal.component";
import {ProcessService, ProcessStep} from "../../service/process.service";
import {ProcessUrls} from "../../service/process.service";
import {BaseComponent} from "../../common/base.component";
import {Address} from "../../model/address.model";
import {MspApiService} from "../../service/msp-api.service";
import {environment} from '../../../../../environments/environment';

@Component({
    templateUrl: './prepare.component.html'
})
@Injectable()
export class AccountPrepareComponent extends BaseComponent {
    static ProcessStepNum = 0;
    lang = require('./i18n');
    mspAccountApp: MspAccountApp;
    accountChangeOptions: AccountChangeOptions;
    captchaApiBaseUrl: string;
    addressChangeBCUrl: string;
    @ViewChild('addressChangeChkBx') addressChangeChkBx: ElementRef;
    @ViewChild('personalInfoChangeChkBx') personalInfoChangeChkBx: ElementRef;
    @ViewChild('nameChangeDueToMarriageChkBx') nameChangeDueToMarriageChkBx: ElementRef;
    @ViewChild('dependentChangeChkBx') dependentChangeChkBx: ElementRef;
    @ViewChild('updateStatusInCanadaChkBx') updateStatusInCanadaChkBx: ElementRef;
    @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;
    @ViewChild('formRef') form: NgForm;
    transmissionInProcess: boolean;

    constructor(private cd: ChangeDetectorRef, private logService: MspLogService, private apiService: MspApiService, private dataService: MspDataService, private _processService: ProcessService, private _router: Router) {
        super(cd);
        this.mspAccountApp = dataService.getMspAccountApp();
        this.accountChangeOptions = this.mspAccountApp.accountChangeOptions;
        this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
        this.addressChangeBCUrl = environment.appConstants.addressChangeBCUrl;
    }

    get hasOnlyAddressSelected(): boolean {
        return this.accountChangeOptions.hasOnlyAddressSelected();
    }

    ngOnInit() {
        this.initProcessMembers(AccountPrepareComponent.ProcessStepNum, this._processService);
    }

    ngAfterViewInit() {
        if (!this.mspAccountApp.infoCollectionAgreement) {
            this.mspConsentModal.showFullSizeView();
        }

    }

    canContinue(): boolean {
        return this.isAllValid();
    }

    next() {
        if (this.mspAccountApp.infoCollectionAgreement !== true) {
            return this.mspConsentModal.showFullSizeView();
        }


        if (this.accountChangeOptions.hasOnlyAddressSelected()) {
            this.transmissionInProcess = true;
            this.mspAccountApp = this.dataService.getFakeAccountChangeApplication();

            // this.logService.log({
            //    name: 'Account - Address Change Only Request ',
            //    confirmationNumber: this.mspAccountApp.referenceNumber
            //},"Account - Address Change Only Request ");

            this.apiService
                .sendApplication(this.mspAccountApp)
                .then((mspAccountApp: MspAccountApp) => {
                    this.logService.log({
                        name: 'Account - Address Change Success ',
                        confirmationNumber: this.mspAccountApp.referenceNumber
                    },"Account - Address Change Success ");
                    //     this.dataService.removeMspAccountApp();
                    window.location.href = this.addressChangeBCUrl;
                    return;
                }).catch((error: ResponseType | any) => {
                this.logService.log({
                    name: 'Account - Address Change Failure ',
                    error: error._body,
                    request: error._requestBody
                },"Account - Address Change Failure");

                //     this.dataService.removeMspAccountApp();
                window.location.href = this.addressChangeBCUrl;
                return;
            });
            return;
        }

        /*
              Account holder section is shared between PI update,Status Update and Add/Remove Dependent
              If some body selects Status update ; the value always persisted even if he goes back and unticks Status Update option and selects a different option
              Status value shouldnt be sent unless Update status in canada option is selected.

         */
        if (!this.accountChangeOptions.statusUpdate) {
            if (this.mspAccountApp.applicant) {
                this.mspAccountApp.applicant.status = null;
                this.mspAccountApp.applicant.currentActivity = null;
            }
            if (this.mspAccountApp.updatedSpouse) {
                this.mspAccountApp.updatedSpouse.status = null;
                this.mspAccountApp.updatedSpouse.currentActivity = null;
            }
            if (this.mspAccountApp.updatedChildren){

                this.mspAccountApp.updatedChildren.forEach((child:Person) => {
                    if (child) {
                        child.status = null;
                        child.currentActivity = null;
                    }
                });


            }
        }


        this.setupProcessStepsFromSelection();
        this._processService.setStep(0, true);
        this.dataService.emptyMspProgressBar();
        this.dataService.saveMspAccountApp();
        this._router.navigate([this._processService.getNextStep(AccountPrepareComponent.ProcessStepNum)]);


    }


    addressUpdateOnChange(event: boolean) {
        this.accountChangeOptions.addressUpdate = event;
        this.dataService.saveMspAccountApp();
    }

    personInfoUpdateOnChange(event: boolean) {
        this.accountChangeOptions.personInfoUpdate = event;
        this.dataService.saveMspAccountApp();
    }

    nameChangeDueToMarriageOnChange(event: boolean) {
        this.accountChangeOptions.nameChangeDueToMarriage = event;
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

    isValid(): boolean {
        //make sure at least one checkbox is selected
        if (this.accountChangeOptions.hasAnyOptionSelected()) {

            if (this.accountChangeOptions.hasOnlyAddressSelected() && !this.mspAccountApp.authorizationToken) {
                return false;
            }
            return true;
        }

        return false;
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
}