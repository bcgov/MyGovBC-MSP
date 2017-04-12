import {Component, Input, ViewChild, Output, EventEmitter, AfterViewInit, OnInit, ChangeDetectorRef} from '@angular/core'
import {NgForm} from "@angular/forms";
import {Person} from "../../model/person.model";
import {Relationship} from "../../model/status-activities-documents";

import * as moment from 'moment';
import {BaseComponent} from "../base.component";

require('./birthdate.component.less');

@Component({
  selector: 'msp-birthdate',
  templateUrl: './birthdate.component.html'
})
export class MspBirthDateComponent extends BaseComponent {

  lang = require('./i18n');

  // Create today for comparison in check later
  today:any;

  constructor() {
    super();
    this.today = moment();
  }

  @Input() person: Person;
  @Input() showError: boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;

  setYearValueOnModel(value:number) {
    if(value){
      let org:string = value + '';
      let trimmed = org.substring(0, 4);


      if(/[^\d]+/.test(trimmed)){
        trimmed = trimmed.replace(/[^\d]/g, '');
      }

      this.person.dob_year = parseInt(trimmed);
    }
  }

  setDayValueOnModel(value:string){
    if(value){
      let org:string = value + '';
      let trimmed = org.substring(0, 2);

      if(/[^\d]+/.test(trimmed)){
        trimmed = trimmed.replace(/[^\d]/g, '');
      }
      this.person.dob_day = parseInt(value);
    }
  }
  /**
   * Determine if date of birth is valid for the given person
   *
   * @returns {boolean}
   */
  isCorrectFormat(): boolean {

    // Validate
    if (this.person &&
        this.person.dob &&
        this.person.dob.isValid()) {
      return true;
    }else{
      return false;
    }

  }

  isInTheFuture(): boolean {
    return this.person.dob.isAfter(this.today);
  }
  tooFarInThePast(): boolean {
    let far = (this.today.get('y') - this.person.dob.get('y')) > 150;

    return far;
  }

  ageCheck(): boolean {
    // Applicant rules
    if (this.person.relationship === Relationship.Applicant) {
      // must be 16 or older for applicant
      let tooYoung = this.person.dob.isAfter(moment().subtract(16, 'years'))
      return !tooYoung;
    }
    // ChildUnder19 rules
    else if (this.person.relationship === Relationship.ChildUnder19) {
      // must be less than 19 if not in school
      let lessThan19 = this.person.dob.isAfter(moment().subtract(19, 'years'))
      return lessThan19;
      
    }
    else if (this.person.relationship === Relationship.Child19To24) {
      // if child student must be between 19 and 24

      let tooYoung = this.person.dob.isAfter(moment().subtract(19, 'years'));
      let tooOld = this.person.dob.isBefore(moment().subtract(24, 'years'));

      if(tooYoung){
        // console.log('This child is less than 19 years old.')
      }
      if(tooOld){
        // console.log('This child is older than 24.')
      }
      let ageInRange = !tooYoung && !tooOld;
      return ageInRange;
    }else{
      return true;
    }
  }

  isValid():boolean {
    return this.isCorrectFormat() && !this.isInTheFuture() && !this.tooFarInThePast() && this.ageCheck();
  }

}
