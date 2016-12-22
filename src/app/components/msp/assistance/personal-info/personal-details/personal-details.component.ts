import { Component, Input, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';
import { Person } from "../../../model/person.model";

@Component({
  selector: 'msp-assistance-personal-details',
  templateUrl: './personal-details.component.html'
})
export class AssistancePersonalDetailComponent implements AfterViewInit, OnInit {
  lang = require('./i18n');

  @Input() person: Person;
  @ViewChild('formRef') personalDetailsForm: NgForm;
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.personalDetailsForm.valueChanges.debounceTime(250)
      .distinctUntilChanged()
      .subscribe( values => {
        console.log('Personal details form value changes: ', values);
      });
  }
} 