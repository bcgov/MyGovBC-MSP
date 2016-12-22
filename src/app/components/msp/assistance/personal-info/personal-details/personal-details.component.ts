import { Component, Input, Output, ViewChild, AfterViewInit, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';
import { Person } from "../../../model/person.model";
import DataService from '../../../service/msp-data.service';
import {FinancialAssistApplication} from "../../../model/financial-assist-application.model";

@Component({
  selector: 'msp-assistance-personal-details',
  templateUrl: './personal-details.component.html'
})
export class AssistancePersonalDetailComponent implements AfterViewInit, OnInit {
  lang = require('./i18n');
  private finApp:FinancialAssistApplication;

  @Input() person: Person;
  @ViewChild('formRef') personalDetailsForm: NgForm;
  @Output() onChange = new EventEmitter<any>();

  constructor(private dataService: DataService) {
    this.finApp = this.dataService.finAssistApp;
    this.person = this.dataService.finAssistApp.applicant;
  }
  
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.personalDetailsForm.valueChanges
      .subscribe( values => {
        // console.log('Personal details form value changes saved: ', values);
        this.onChange.emit(values);
      });
  }

} 