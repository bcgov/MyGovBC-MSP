import {ChangeDetectorRef, Component, ViewChild, AfterViewInit, OnInit, ViewChildren, QueryList} from '@angular/core';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';

import DataService from '../../service/msp-data.service';
import CompletenessCheckService from '../../service/completeness-check.service';
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";
import { Router } from '@angular/router';
import {BaseComponent} from "../../common/base.component";
import {AssistancePersonalDetailComponent} from "./personal-details/personal-details.component";
import {MspAddressComponent} from "../../common/address/address.component";
import {MspPhoneComponent} from "../../common/phone/phone.component";
import ProcessService from "../../service/process.service";

@Component({
  templateUrl: './personal-info.component.html'
})
export class AssistancePersonalInfoComponent extends BaseComponent{
  static ProcessStepNum = 1;

  lang = require('./i18n');

  @ViewChild('formRef') personalInfoForm: NgForm;
  @ViewChildren(AssistancePersonalDetailComponent) personalDetailsComponent: QueryList<AssistancePersonalDetailComponent>;
  @ViewChild('address') address: MspAddressComponent;
  @ViewChild('phone') phone: MspPhoneComponent;

  financialAssistApplication: FinancialAssistApplication;

  constructor(private dataService: DataService,
    private _router: Router,
    private _processService:ProcessService,
    private cd:ChangeDetectorRef) {
    super(cd);
    this.financialAssistApplication = this.dataService.finAssistApp;
  }

  ngOnInit(){
    this.initProcessMembers(AssistancePersonalInfoComponent.ProcessStepNum, this._processService);
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.personalInfoForm.valueChanges.debounceTime(250)
      .distinctUntilChanged().subscribe( values => {
        // console.log('Personal info form change triggering save: ', values);
        this.dataService.saveFinAssistApplication();
      });
  }

  onChange(values:any) {
    // console.log('changes from child component triggering save: ', values);
    this.dataService.saveFinAssistApplication();
  }
  
  onSubmit(form: NgForm){
    this._router.navigate(['/msp/assistance/retro']);
  }

  get canContinue():boolean{
    return this.isAllValid();
  }
  
}