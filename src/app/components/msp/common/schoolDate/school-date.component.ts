import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import * as moment from 'moment';
import {BaseComponent} from "../base.component";

require('./school-date.component.less');

@Component({
  selector: 'msp-school-date',
  templateUrl: './school-date.component.html'
})
export class MspSchoolDateComponent extends BaseComponent {

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
  @Input() showError: boolean;

  @ViewChild('formRef') form: NgForm;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.form.valueChanges.subscribe(values => {
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
   * Determine if school date is valid for the given person
   *
   * @returns {boolean}
   */
  isCorrectFormat(): boolean {
    if(!this.year || !this.month || !this.day){
      return false;
    }else{
      let valid = this.inputDate().isValid();

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

  isValid(): boolean {
    return this.isCorrectFormat() && this.futureCheck();
  }
}
