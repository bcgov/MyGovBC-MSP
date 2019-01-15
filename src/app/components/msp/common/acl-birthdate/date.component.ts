import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Base } from '../base/base.class';
import * as moment from 'moment';
import { SimpleDate } from '../../model/simple-date.interface';

export enum MonthName {
  Jan = 'January',
  Feb = 'February',
  Mar = 'March',
  Apr = 'April',
  May = 'May',
  Jun = 'June',
  July = 'July',
  Aug = 'August',
  Sep = 'September',
  Oct = 'October',
  Nov = 'November',
  Dec = 'December'
};

@Component({
  selector: 'acl-birthdate',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class ACLDateComponent extends Base implements OnInit {

  @Input() showError: boolean;
  @Input() required = true;
  /** Sets the default values to the client-side current date. */
  @Input() useCurrentDate = false;
  @Input() disabled: boolean;
  @Input() label: string = 'date';

  @Input() date: SimpleDate;
  @Output() onDateChange: EventEmitter<SimpleDate> = new EventEmitter<SimpleDate>();

  /** Can be one of: "future", "past". "future" includes today, "past" does not. */
  @Input() restrictDate: string;

  @ViewChild('formRef') form: NgForm;


  constructor(private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    // Can toggle to show all errors for design/dev purposes
    // this.showError = true;

    if (this.useCurrentDate) {
      this.setToToday();
    }
  }

  /**
   * Get names of the months to display on the page
   * @returns {any[]}
   */
  get monthNames() {
    return Object.keys( MonthName ).map( x => MonthName[x] );
  }

  setYearValueOnModel(value: string) {
    if (value) {
      this.date.year = parseInt(value, 10);
    } else {
      this.date.year = null;
    }
    this.triggerDayValidation();
    this.onDateChange.emit(this.date);
  }

  setDayValueOnModel(value: string) {
    if (value) {
      this.date.day = parseInt(value, 10);
    } else {
      this.date.day = null;
    }
    this.onDateChange.emit(this.date);
  }

  setMonthValueOnModel(value: string) {

    const parsed = parseInt(value, 10);
    this.date.month = (isNaN( parsed ) ? null : parsed);
    this.triggerDayValidation();
    this.onDateChange.emit(this.date);
  }

  /**
   * Sets the default values to the current clientside date.
   */
  setToToday(): void {
    this.date.month = moment().month() + 1; //0 is blank/unselected in options list
    this.date.day = moment().date();
    this.date.year = moment().year();
  }

  isValid(): boolean {
    if (this.required) {
      if (!this.date.year || !this.date.month || !this.date.day) {
        return false;
      }
    }
    else {
      //Non-required components are okay if all fields are blank.
      if (!this.date.year && !this.date.month && !this.date.day) {
        return true;
      }
    }

    //Month indices start at 1 for Jan, so 0 is unselected.
    if (!(this.date.month && this.date.month > 0 && this.date.month <= 12)) {
      return false;
    }

    if (this.date.month && (!this.date.day || !this.date.year)) {
      return false;
    }


    /**
     * Ensure that the validation from CalendarFutureDates influences isValid.
     */
    if (this.restrictDate && this.form.errors){
      const option = this.restrictDate.toLowerCase();
      if ((option === 'future' && this.form.errors.dateNotInPast)
      || (option === 'past' && this.form.errors.dateNotInFuture)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Force the `day` input to run it's directives again. Important in cases
   * where user fills fields out of order, e.g. sets days to 31 then month to
   * Februrary.
   */
  triggerDayValidation(){
    // We have to wrap this in a timeout, otherwise it runs before Angular has updated the values
    setTimeout( () => {
      if (!this.form.controls['day']) return;
      this.form.controls['day'].updateValueAndValidity();
      this.cd.detectChanges();
    }, 0);
  }

  private get moment() {
    return moment({
      year: this.date.year,
      month: this.date.month - 1, //Moment starts month indice at 0.
      day: this.date.day
    });
  }

}
