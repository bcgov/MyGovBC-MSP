import {Component, Input} from '@angular/core'
import * as moment from 'moment';

require('./school-date.component.less');

@Component({
  selector: 'msp-school-date',
  templateUrl: './school-date.component.html'
})
export class MspSchoolDateComponent {

  lang = require('./i18n');

  // Create today for comparison in check later
  today = moment();

  @Input() year: number;
  @Input() month: number;
  @Input() day: number;
  @Input() schoolLabel: string = this.lang('./en/index.js').schoolDateLabel;

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

    // Check not in past
    if (this.inputDate().isBefore(this.today)) {
      return false;
    }

    return true;
  }
}
