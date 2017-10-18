import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core'
import { NgForm } from "@angular/forms";
import * as moment from 'moment';
import { BaseComponent } from "../base.component";
import { SimpleDate } from '../../model/simple-date.interface';

@Component({
  selector: 'msp-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.less']

})
export class MspDateComponent extends BaseComponent implements AfterViewInit {

  lang = require('./i18n');

  // Create today for comparison in check later
  today = moment();

  @Input() showError: boolean;
  @Input() required: boolean = true;

  public year:  number;
  public month:  number;
  public day:  number;

  @Input() label: string;
  @Input() date: SimpleDate;
  @Output() dateChange = new EventEmitter<SimpleDate>();

  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }

  // Parse person's date
  inputDate() {
    let y: number = this.year as number;
    let m: number = this.month as number;
    let d: number = this.day as number;
    return moment({
      year: y,
      month: m - 1, // moment use 0 index for month :(
      day: d,
    });
  }

  setYearValueOnModel(value: string) {
    if (value) {
      this.year = parseInt(value);
    } else {
      this.year = NaN;
    }
  }

  setDayValueOnModel(value: string) {
    if (value) {
      this.day = parseInt(value);
    } else {
      this.day = NaN;
    }
  }

  setMonthValueOnModel(value: string) {
    if (value) {
      this.month = parseInt(value);
    } else {
      this.month = NaN;
    }
  }

  /**
   * Determine if date of birth is valid for the given person
   *
   * @returns {boolean}
   */
  isCorrectFormat(): boolean {
    if (this.year && this.month && this.day) {
      return this.inputDate().isValid();
    }
    return false;
  }

  futureCheck(): boolean {

    console.log('today is: ' + this.today.format('DD-MM-YYYY') + '  input date is: ' + this.inputDate().format('DD-MM-YYYY'));
    console.log('isAfter returns ' + this.inputDate().isAfter(this.today));

    // Check not in future
    if (this.inputDate().isAfter(this.today)) {
      return false;
    }

    return true;
  }

  isValid(): boolean {
    if (this.required) {
      if (!this.year || !this.month || !this.day) {
        return false;
      }
    }
    if (this.year || (this.month && this.month != 0) || this.day) {
      let val = this.isCorrectFormat() && this.futureCheck();
      if (!val) { return val; }
    }
    //Only emit the date when it's valid and there are no form errors.
    if (!this.hasFormErrors){
      this.dateChange.emit(this.simpleDate);      
    }
    return true;
  }

  get simpleDate(): SimpleDate {
    return {
      year: this.year,
      month: this.month,
      day: this.day
    }
  }

  /** 
   * Checks for the presence of form errors created by validation directives
   * like calendar-year.validator.ts, which puts the errors directly on the
   * controls. */
  get hasFormErrors(): boolean {
    return [this.form.controls.year.errors,
      this.form.controls.month.errors,
      this.form.controls.day.errors
    ].filter(x => x).length >= 1
  }
}
