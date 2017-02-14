import {Component, Input, ViewChild, Output, EventEmitter, AfterViewInit, OnInit} from '@angular/core'
import {NgForm} from "@angular/forms";
import {Person} from "../../model/person.model";
import {Relationship, Activities} from "../../model/status-activities-documents";
import * as moment from 'moment';

require('./birthdate.component.less');

@Component({
  selector: 'msp-birthdate',
  templateUrl: './birthdate.component.html'
})
export class MspBirthDateComponent implements AfterViewInit, OnInit{

  lang = require('./i18n');
  dobYearValidationError:string;

  // Create today for comparison in check later
  today:any;

  constructor(){
    this.today = moment();
  }

  @Input() person: Person;
  @Output() onChange = new EventEmitter<any>();

  @ViewChild('formRef') form: NgForm;


  ngOnInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }
  
  ngAfterViewInit():void {

  }

  dobYearChange(evt:number):void {
    if(!this.isValid()){
      console.log('dob not valid, %s', this.dobYearValidationError);
      
      this.dobYearValidationError = this.lang('./en/index.js').yearErrorBadFormat
    }else if(this.isInTheFuture()){
      this.dobYearValidationError = this.lang('./en/index.js').yearErrorFutureCheck
    }else if(!this.ageCheck()){
      console.log('dob failed age check, %s', this.dobYearValidationError);
      
      this.dobYearValidationError = this.lang('./en/index.js').yearErrorAgeCheck
    }else{
      console.log('reset error to null, %s', this.dobYearValidationError);
      this.dobYearValidationError = null;
    }
  }

  /**
   * Determine if date of birth is valid for the given person
   *
   * @returns {boolean}
   */
  isValid(): boolean {

    // Validate
    if (!this.person.dob.isValid()) {
      return false;
    }else{
      return true;
    }

  }

  isInTheFuture(): boolean {
    return this.person.dob.isAfter(this.today);
  }

  ageCheck(): boolean {
    // ChildUnder19 rules
    if (this.person.relationship === Relationship.ChildUnder19) {
      // must be less than 19 if not in school
      let lessThan19 = this.person.dob.isAfter(moment().subtract(19, 'years'))
      return lessThan19;
      
    }else if (this.person.relationship === Relationship.Child19To24) {
      // if child student must be between 19 and 24

      let tooYoung = this.person.dob.isAfter(moment().subtract(19, 'years'));
      let tooOld = this.person.dob.isBefore(moment().subtract(24, 'years'));

      if(tooYoung){
        console.log('This child is less than 19 years old.')
      }
      if(tooOld){
        console.log('This child is older than 24.')
      }
      let ageInRange = !tooYoung && !tooOld;
      return ageInRange;
    }else{
      return true;
    }

  }

}
