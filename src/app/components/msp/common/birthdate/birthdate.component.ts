import {Component, Input, ViewChild, Output, EventEmitter, AfterViewInit} from '@angular/core'
import {NgForm} from "@angular/forms";
import {Person} from "../../model/person.model";
import {Relationship, Activities} from "../../model/status-activities-documents";
import * as moment from 'moment';

require('./birthdate.component.less');

@Component({
  selector: 'msp-birthdate',
  templateUrl: './birthdate.component.html'
})
export class MspBirthDateComponent implements AfterViewInit{

  lang = require('./i18n');

  // Create today for comparison in check later
  today = moment();

  @Input() person: Person;
  @Output() onChange = new EventEmitter<any>();

  @ViewChild('formRef') form: NgForm;
  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
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
    }

    return true;
  }

  futureCheck(): boolean {

    // Check not in future
    if (this.person.dob.isAfter(this.today)) {
      return false;
    }

    return true;
  }

  ageCheck(): boolean {

    // ChildUnder19 rules
    if (this.person.relationship === Relationship.ChildUnder19) {
      // must be less than 19 if not in school
      if (!this.person.dob.isAfter(this.today.subtract(19, 'years'))) {
        return false;
      }
    }
    else if (this.person.relationship === Relationship.Child19To24) {
      // if child student must be between 19 and 24
      if (!this.person.dob.isBetween(this.today.subtract(19, 'years'), this.today.subtract(24,'years'))) {
        return false;
      }
    }

    return true;
  }

}
