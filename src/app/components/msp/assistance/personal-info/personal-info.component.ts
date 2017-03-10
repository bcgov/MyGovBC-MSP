import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';

import DataService from '../../service/msp-data.service';
import CompletenessCheckService from '../../service/completeness-check.service';
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";
import { Router } from '@angular/router';

@Component({
  templateUrl: './personal-info.component.html'
})
export class AssistancePersonalInfoComponent implements AfterViewInit, OnInit{
  lang = require('./i18n');
  @ViewChild('formRef') personalInfoForm: NgForm;

  financialAssistApplication: FinancialAssistApplication;

  constructor(private dataService: DataService, 
    private completenessCheck: CompletenessCheckService,
    private _router: Router) {
    this.financialAssistApplication = this.dataService.finAssistApp;
  }

  ngOnInit() {
    // console.log('personalInfoForm: ', this.personalInfoForm);
  }
  ngAfterViewInit() {
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
    return this.completenessCheck.finAppPersonalInfoCompleted();
  }
  
}