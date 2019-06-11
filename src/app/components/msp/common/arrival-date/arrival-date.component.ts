import {Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';
import {BaseComponent} from '../../../../models/base.component';
import {SimpleDate} from 'moh-common-lib';



@Component({
  selector: 'msp-arrival-date',
  templateUrl: './arrival-date.component.html',
  styleUrls: ['./arrival-date.component.scss']

})
export class MspArrivalDateComponent extends BaseComponent implements AfterViewInit {

  lang = require('./i18n');

  // Create today for comparison in check later
  today = moment();

  @Input() showError: boolean;
  @Input() required: boolean = true;
  @Input() year: number | string;
  @Output() yearChange = new EventEmitter<number|string>();
  @Input() month: number;
  @Output() monthChange = new EventEmitter<number>();
  @Input() day: number | string;
  @Output() dayChange = new EventEmitter<number|string>();
  @Input() arrivalLabel: string = this.lang('./en/index.js').arrivalDateLabel;

  //approach changed
  // @Input() notBeforeDate: SimpleDate;
 //   @Input() notBeforeDateErrorLabel: string;

    public hasErrorBeforeDate: boolean;

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


  setYearValueOnModel(value: string){
    if (value){
      this.year = parseInt(value);
    }else{
      this.year = value;
    }
    this.yearChange.emit(this.year);
  }

  setDayValueOnModel(value: string){
    if (value){
      this.day = parseInt(value);
    }else{
      this.day = value;
    }
    this.dayChange.emit(this.day);
  }

  setMonthValueOnModel(value: string){
    if (value){
      this.month = parseInt(value);
    }else{
      this.month = NaN;
    }
    this.monthChange.emit(this.month);

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

   // Check not in future
    if (this.inputDate().isAfter(this.today)) {
      return false;
    }

    return true;
  }

   /* notBeforeDateCheck(): boolean {

        if (this.notBeforeDate && this.inputDate().isSameOrBefore( this.toDate(this.notBeforeDate))){
            this.hasErrorBeforeDate = true;
            return false;
        }
        this.hasErrorBeforeDate = false;
        return true;
    }*/
  isValid(): boolean {
    if (this.required) {
      if (!this.year || !this.month || !this.day) {
        return false;
      }
    }
    if (this.year || (this.month && this.month != 0) || this.day) {
      return this.isCorrectFormat() && this.futureCheck();
    }


    return true;
  }
}
