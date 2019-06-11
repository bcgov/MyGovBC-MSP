import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { BaseComponent } from '../../../../models/base.component';
import { SimpleDate } from '../../model/simple-date.interface';
import { SimpleDateTools } from '../../model/simple-date.tools';

@Component({
  selector: 'msp-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']

})
export class MspDateComponent extends BaseComponent implements AfterViewInit {

  lang = require('./i18n');

  // Create today for comparison in check later
  today = moment();

  @Input() showError: boolean;
  /** Is this date component required? If false, it can be left blank and it will pass validation. */
  @Input() required: boolean = true;
  @Input() futureDate: boolean;

  public year:  number;
  public month:  number;
  public day:  number;

  @Input() label: string;
  @Input() date: SimpleDate;
  @Output() dateChange = new EventEmitter<SimpleDate>();

  //no longer user.valdiation moved to component classes
 /* @Input() notBeforeDate: SimpleDate;
  @Input() notBeforeDtaeErrorLabel: string;*/

  public hasErrorBeforeDate: boolean;

  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit(){
    /**
     * 'Required' should be a boolean, but it is possible to pass it a string
     * which leads to a difficult to debug issue. Ideally, pass a raw boolean,
     * but regar.scss code will make sure both work.
     *
     * BAD:   <msp-date required="false">
     * GOOD:  <msp-date required=false>
     */
    if (typeof this.required === 'string'){
      this.required = (<any>this.required === 'true' ? true : false);
    }
    if (this.date) {
      this.year = this.date.year ;
      this.month = this.date.month;
      this.day = this.date.day;
    }
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }

  // Parse person's date
  inputDate() {
    const y: number = this.year as number;
    const m: number = this.month as number;
    const d: number = this.day as number;
    return moment({
      year: y,
      month: m - 1, // moment use 0 index for month :(
      day: d,
    });
  }

    // Parse person's date
    toDate(simpleDate: SimpleDate) {
        return moment({
            year: simpleDate.year,
            month: simpleDate.month - 1, // moment use 0 index for month :(
            day: simpleDate.day,
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

 /* notBeforeDateCheck(): boolean {
    if (this.inputDate().isSameOrBefore(this.toDate(this.notBeforeDate))){
      this.hasErrorBeforeDate = true;
      return false;
    }
    this.hasErrorBeforeDate = false;
    return true;
  }*/

  futureCheck(): boolean {

    // console.log('today is: ' + this.today.format('DD-MM-YYYY') + '  input date is: ' + this.inputDate().format('DD-MM-YYYY'));
    // console.log('isAfter returns ' + this.inputDate().isAfter(this.today));
    if (this.futureDate) {
      return true;
    }
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
    } else {
      //If input isn't required, section is valid only if all inputs are blank.
      //Partially filled out sections will fail validation. (Don't want users to
      //accidentally miss out a field)
      if (!this.year && !this.month && !this.day){
        return true;
      }
    }


    if (this.year || (this.month && this.month != 0) || this.day) {
      const val = this.isCorrectFormat() && this.futureCheck();

     /* if (this.notBeforeDate){
        val = val && this.notBeforeDateCheck();
      }*/

      if (!val) {
        return val;
      }
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
    };
  }

  /**
   * Checks for the presence of form errors created by validation directives
   * like calendar-year.validator.ts, which puts the errors directly on the
   * controls.
   * */
  get hasFormErrors(): boolean {
    return [
      this.form.controls.year ? this.form.controls.year.errors : null,
      this.form.controls.month ? this.form.controls.month.errors : null,
      this.form.controls.day ? this.form.controls.day.errors : null
    ].filter(x => x).length >= 1;
  }
}
