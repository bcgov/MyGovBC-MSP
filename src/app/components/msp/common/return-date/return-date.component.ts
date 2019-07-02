import {Component, Input, Output, EventEmitter, ViewChild, OnInit, ChangeDetectorRef, SimpleChange} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';
import {BaseComponent} from '../../../../models/base.component';


@Component({
  selector: 'msp-return-date',
  templateUrl: './return-date.component.html',
  styleUrls: ['./return-date.component.scss']
})
export class MspReturnDateComponent extends BaseComponent {

  lang = require('./i18n');

  // Create today for comparison in check later
  today = moment();

  @Input() showError: boolean;
  @Input() year: number;
  @Output() yearChange = new EventEmitter<number>();
  @Input() month: number;
  @Output() monthChange = new EventEmitter<number>();
  @Input() day: number;
  @Output() dayChange = new EventEmitter<number>();
  @Input() returnLabel: string = this.lang('./en/index.js').returnLabel;
  @Input() futureDate: boolean;
  @Input() mustBeAfter: moment.Moment;

    // departure date might have restirctions on the months. ie have you returned in the last 12 months.pass 12 here then
    @Input() minMonthsRange: number;
    @Input() minMonthsRangeErrorMsg: string;

  @ViewChild('formRef') form: NgForm;

  @Output() onChange = new EventEmitter<any>();

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  // Parse person's date
  inputDate() {
    return moment({
      year: this.year,
      month: this.month - 1, // moment use 0 index for month :(
      day: this.day,
    });
  }

    // deaprture date has months restriction. It could be either six months or 12 months depenidng on the question.
    isWithinNMonths(): boolean {
        if (!this.minMonthsRange || this.minMonthsRange == 0) {
            return true;
        }
        const datebeforeNMonths = moment().subtract(this.minMonthsRange, 'months') ;
        if (this.inputDate().isBefore(datebeforeNMonths)) {
            return false;
        }
        return true;
    }

  /**
   * Determine if date of birth is valid for the given person
   *
   * NOTE: This function will return true even if the user has only filled out
   * one field, e.g. month. This is because Moment will fill in the the blanks
   * with the current date.
   *
   * @returns {boolean}
   */
  isCorrectFormat(): boolean {

    // Validate
    if (!this.inputDate().isValid()) {
      return false;
    }

    return true;
  }

  futureCheck(): boolean {

    if (this.futureDate) {
      return true;
    }
    // Check not in future
    if (this.inputDate().isAfter(this.today)) {
      return false;
    }

    return true;
  }

  /**
   * Check that departure date is before return date, or equal.
   */
  dateOrderCheck(): boolean {
    //Don't do validation if input isn't set. Currently, this validation is used everywhere.
    if (this.mustBeAfter === null){
      return true;
    }
    return this.mustBeAfter.isBefore(this.inputDate());
  }

  get showDateOrderError(): boolean {
    if (!this.allFieldsValid()){
      return false;
    }

    return this.dateOrderCheck() === false;
  }

  /**
   * Similar idea to 'isValid', but also makes sure all fields are filled.
   * Currently isValid returns true even if just month is full, since Moment
   * will create a valid date object with just one property.
   */
  private allFieldsValid(): boolean {
    return this.year !== null
      && this.day !== null
      && this.month !== null
      && this.inputDate().isValid();
  }

 // the date order validation with return and departure date is moved to out of bc component
  isValid(): boolean {
    return this.isCorrectFormat() && this.futureCheck()  && this.isWithinNMonths();
  }
}
