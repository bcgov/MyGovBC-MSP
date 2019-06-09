import {ChangeDetectorRef, Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MspLogService} from '../../service/log.service';

import {MspAccountApp, AccountChangeOptions} from '../../model/account.model';
import * as _ from 'lodash';


import {Gender, Person} from '../../model/msp-person.model';
import {MspDataService} from '../../service/msp-data.service';
import {ConsentModalComponent} from 'moh-common-lib';

import {ProcessService, ProcessStep} from '../../service/process.service';
import {ProcessUrls} from '../../service/process.service';
import {BaseComponent} from '../../common/base.component';
import {Address} from '../../model/address.model';
import {MspApiService} from '../../service/msp-api.service';
import {environment} from '../../../../../environments/environment';
//import {CheckboxComponent} from '../../../../../../node_modules/moh-common-lib/lib/components/checkbox/checkbox.component';


@Component({
    templateUrl: './prepare.component.html',
    styleUrls: ['./prepare.component.scss']
})
@Injectable()
export class AccountPrepareComponent extends BaseComponent {
    static ProcessStepNum = 0;
    lang = require('./i18n');
    public addressChangeLabel = 'Update Address';
    mspAccountApp: MspAccountApp;
    accountChangeOptions: AccountChangeOptions;
    captchaApiBaseUrl: string;
    addressChangeBCUrl: string;
    @ViewChild('addressChangeChkBx') addressChangeChkBx: ElementRef;
    @ViewChild('personalInfoChangeChkBx') personalInfoChangeChkBx: ElementRef;
    @ViewChild('nameChangeDueToMarriageChkBx') nameChangeDueToMarriageChkBx: ElementRef;
    @ViewChild('dependentChangeChkBx') dependentChangeChkBx: ElementRef;
    @ViewChild('updateStatusInCanadaChkBx') updateStatusInCanadaChkBx: ElementRef;
    @ViewChild('mspConsentModal') mspConsentModal: ConsentModalComponent;
    @ViewChild('formRef') form: NgForm;
    transmissionInProcess: boolean;
    // PI gets automatically ticked and unticked depending on the namechangeduetomarriage option.. this flag is used to idenity if PI is checked by user or by namechange option
    isPICheckedByUser = true;
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

    onAccept(event: boolean) {
        console.log(event);
        this.mspAccountApp.infoCollectionAgreement = event;
        this.dataService.saveMspAccountApp();
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
                    }, 'Account - Address Change Success ');
                    //     this.dataService.removeMspAccountApp();
                    window.location.href = this.addressChangeBCUrl;
                    return;
                }).catch((error: ResponseType | any) => {
                this.logService.log({
                    name: 'Account - Address Change Failure ',
                    error: error._body,
                    request: error._requestBody
                }, 'Account - Address Change Failure');

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

                this.mspAccountApp.updatedChildren.forEach((child: Person) => {
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
        console.log(event);
        console.log(this.accountChangeOptions.addressUpdate);

        this.accountChangeOptions.addressUpdate = event;
        this.dataService.saveMspAccountApp();
    }

    personInfoUpdateOnChange(event: boolean) {
        
        console.log(event);

        this.isPICheckedByUser = true;
        this.accountChangeOptions.personInfoUpdate = event;
        this.dataService.saveMspAccountApp();
    }

    /*
     *  When nameChangeDueToMarriageOnChange -> true
     *           if personInfoUpdate is not already updated by user , make isPICheckedByUser = false
     *          update personInfoUpdate = true
     *
     *
     *  When nameChangeDueToMarriageOnChange -> false
     *          check if personInfoUpdate is updated by user , or else make it false
     */
    nameChangeDueToMarriageOnChange(event: boolean) {
        this.accountChangeOptions.nameChangeDueToMarriage = event;

        if (event === true) {
            if (!this.accountChangeOptions.personInfoUpdate) {
                this.isPICheckedByUser = false ;
            }
            this.accountChangeOptions.personInfoUpdate = true ;
        }
        if (event === false && !this.isPICheckedByUser){ //reset to false if not checked by user
            this.accountChangeOptions.personInfoUpdate = false ;
        }
        this.dataService.saveMspAccountApp();
    }

    dependentChangeOnChange(event: boolean) {
        if (!event) { //unselect nameChangeDueToMarriage and personInfoUpdate
            this.accountChangeOptions.nameChangeDueToMarriage = false ;
            if ( !this.isPICheckedByUser) {  //reset to false if not checked by user
                this.accountChangeOptions.personInfoUpdate = false ;
            }
        }
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

        let stepNumber: number = 1;

        if (this.accountChangeOptions.personInfoUpdate || this.accountChangeOptions.statusUpdate) {
            this._processService.addStep(new ProcessStep(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL), stepNumber);
            stepNumber++;
        }
        if (this.accountChangeOptions.dependentChange) {
            this._processService.addStep(new ProcessStep(ProcessUrls.ACCOUNT_DEPENDENTS_URL), stepNumber);
        }

    }
}
