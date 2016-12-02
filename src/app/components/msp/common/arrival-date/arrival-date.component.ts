import {Component, Input} from '@angular/core'
import * as moment from 'moment';

require('./arrival-date.component.less');

@Component({
  selector: 'msp-arrival-date',
  templateUrl: './arrival-date.component.html'
})
export class MspArrivalDateComponent {

  lang = require('./i18n');

  // Create today for comparison in check later
  today = moment();

  @Input() year: number;
  @Input() month: number;
  @Input() day: number;
  @Input() arrivalLabel: string = this.lang('./en/index.js').arrivalDateLabel;

  // Parse person's date
  inputDate() {
    return moment({
      year: this.year,
      month: this.month - 1, // moment use 0 index for month :(
      day: this.day,
    });
  }

  /**
   * Determine if date of birth is valid for the given person
   *
   * @returns {boolean}
   */
  isValid(): boolean {

    // Validate
    if (!this.inputDate().isValid()) {
      return false;
    }

    return true;
  }

  futureCheck(): boolean {

    // Check not in future
    if (this.inputDate().isAfter(this.today)) {
      return false;
    }

    return true;
  }
}
