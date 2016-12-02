import {Component, Input} from '@angular/core'
import {Person} from "../../model/person.model";
import {Relationship, Activities} from "../../model/status-activities-documents";
import * as moment from 'moment';

require('./birthdate.component.less');

@Component({
  selector: 'msp-birthdate',
  templateUrl: './birthdate.component.html'
})
export class MspBirthDateComponent {

  lang = require('./i18n');

  // Create today for comparison in check later
  today = moment();

  // Parse person's date
  dob() {
    return moment({
      year: this.person.dob_year,
      month: this.person.dob_month - 1, // moment use 0 index for month :(
      day: this.person.dob_day,
    });
  }


  @Input() person: Person;

  /**
   * Determine if date of birth is valid for the given person
   *
   * @returns {boolean}
   */
  isValid(): boolean {

    // Validate
    if (!this.dob().isValid()) {
      return false;
    }

    return true;
  }

  futureCheck(): boolean {

    // Check not in future
    if (this.dob().isAfter(this.today)) {
      return false;
    }

    return true;
  }

  ageCheck(): boolean {

    // Child rules
    if (this.person.relationship === Relationship.Child) {

      // if child student must be between 19 and 24
      if (this.person.currentActivity === Activities.StudyingInBC) {
        if (!this.dob().isBetween(this.today.subtract(19, 'years'), this.today.subtract(24,'years'))) {
          return false;
        }
      }
      else {
        // must be less than 19 if not in school
        if (!this.dob().isAfter(this.today.subtract(19, 'years'))) {
          return false;
        }
      }
    }

    return true;
  }

}
