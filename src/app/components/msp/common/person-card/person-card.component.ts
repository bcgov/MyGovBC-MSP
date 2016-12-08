import {Component, Input} from '@angular/core'
import {Person, Gender} from "../../model/person.model";
import {Relationship} from "../../model/status-activities-documents";
import * as moment from 'moment';
require('./person-card.component.less');

@Component({
  selector: 'msp-person-card',
  templateUrl: './person-card.component.html'
})
export class MspPersonCardComponent {
  lang = require('./i18n');
  langStatus = require('../status/i18n');
  langActivities = require('../activities/i18n');

  @Input() person: Person;

  constructor() {
  }

  // Parse person's date
  dob() {
    return moment({
      year: this.person.dob_year,
      month: this.person.dob_month - 1, // moment use 0 index for month :(
      day: this.person.dob_day,
    });
  }

  get dobDisplay(): string {
    return this.dob().format("MMMM Do, YYYY");
  }
}
