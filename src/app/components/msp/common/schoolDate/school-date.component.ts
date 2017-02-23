import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
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
  @Output() yearChange = new EventEmitter<number>();
  @Input() month: number;
  @Output() monthChange = new EventEmitter<number>();
  @Input() day: number;
  @Output() dayChange = new EventEmitter<number>();
  @Input() departureDate: boolean = false;

  @Input() required:boolean;

  @Output() onChange = new EventEmitter<any>();

  @ViewChild('formRef') form: NgForm;

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      // console.log('school date value change, %o', values);
      this.onChange.emit(values);
    });
  }


  yearErrorPastFutureCheck() {
    if (this.departureDate) {
      return this.lang('./en/index.js').yearErrorFutureCheck;
    }
    else{
      return this.lang('./en/index.js').yearErrorPastCheck;
    }
  }

  schoolLabel() {
    if (this.departureDate) {
      return this.lang('./en/index.js').schoolDepartureDateLabel;
    }
    else {
      return this.lang('./en/index.js').schoolCompletionDateLabel;
    }
  }

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
    if(!this.year || !this.month || !this.day){
      return false;
    }else{
      let valid = this.inputDate().isValid();
      let diff = this.inputDate().diff(moment(), 'years');

      console.log('diff between now: ', diff);
      console.log(this.inputDate().inspect() + ' is valid? ', this.inputDate().isValid());
      return valid;
    }
  }

  futureCheck(): boolean {

    if (this.departureDate) {
      // Check not in future
      if (this.inputDate().isAfter(this.today)) {
        return false;
      }
    }
    else {
      // Check not in past
      if (this.inputDate().isBefore(this.today)) {
        return false;
      }
    }

    return true;
  }
}
