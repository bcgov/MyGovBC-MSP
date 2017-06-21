import {ChangeDetectorRef, Component, ViewChild, AfterViewInit, OnInit, ViewChildren, QueryList, ElementRef} from '@angular/core';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';

import DataService, {default as MspDataService} from '../../service/msp-data.service';
import CompletenessCheckService from '../../service/completeness-check.service';
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";
import { Router } from '@angular/router';
import {BaseComponent} from "../../common/base.component";
import {MspAddressComponent} from "../../common/address/address.component";
import {MspPhoneComponent} from "../../common/phone/phone.component";
import ProcessService from "../../service/process.service";
import {MspConsentModalComponent} from "../../common/consent-modal/consent-modal.component";
import {MspApplication, Person} from '../../model/application.model';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';


@Component({
    templateUrl: './initial-eligibility-check.component.html'
})

export class AssistanceInitialEligibilityCheckComponent extends BaseComponent /*implements AfterViewInit*//*, OnInit, DoCheck*/{
    static ProcessStepNum = 0
    @ViewChild('formRef') form: NgForm;
    @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;
    @ViewChild('citizenshipQBtn') citizenshipQBtn: ElementRef;
    @ViewChild('notCitizenshipQBtn') notCitizenshipQBtn: ElementRef;
    @ViewChild('incomeTaxQBtn') incomeTaxQBtn: ElementRef;
    @ViewChild('notIncomeTaxQBtn') notIncomeTaxQBtn: ElementRef;


    lang = require('./i18n');
    application: FinancialAssistApplication;
    constructor(private dataService: MspDataService,
                private _router: Router,
                private _processService: ProcessService,
                private cd: ChangeDetectorRef,){
        super(cd);
        this.application = this.dataService.finAssistApp;
    }

    ngOnInit(){
        this.initProcessMembers(AssistanceInitialEligibilityCheckComponent.ProcessStepNum, this._processService);
    }

    continue() {
        this._processService.setStep(AssistanceInitialEligibilityCheckComponent.ProcessStepNum, true);
        this._router.navigate(['/msp/assistance/prepare']);

    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        if (!this.dataService.finAssistApp.infoCollectionAgreement) {
            this.mspConsentModal.showFullSizeView();
        }

        let citizenshipQ$ = Observable.fromEvent<MouseEvent>(this.citizenshipQBtn.nativeElement, 'click')
            .map( x=>{
                this.dataService.finAssistApp.citizenshipQ = true;
            });

        let notCitizenshipQ$ = Observable.fromEvent<MouseEvent>(this.notCitizenshipQBtn.nativeElement, 'click')
            .map( x=>{
                this.dataService.finAssistApp.citizenshipQ = false;
            });
        let incomeTaxQ$ = Observable.fromEvent<MouseEvent>(this.incomeTaxQBtn.nativeElement, 'click')
            .map( x=>{
                this.dataService.finAssistApp.incomeTaxQ = true;
            });

        let notIncomeTaxQBtn$ = Observable.fromEvent<MouseEvent>(this.notIncomeTaxQBtn.nativeElement, 'click')
            .map( x=>{
                this.dataService.finAssistApp.incomeTaxQ = false;
            });
        if(this.form){
            this.form.valueChanges.merge(citizenshipQ$).merge(notCitizenshipQ$)
                .merge(incomeTaxQ$).merge(notIncomeTaxQBtn$)
                .subscribe(values => {
                    this.dataService.saveFinAssistApplication();
                    this.emitIsFormValid();
                });
        }
    }

    canContinue(): boolean {
        return this.dataService.finAssistApp.citizenshipQ && this.dataService.finAssistApp.incomeTaxQ;
    }

}


