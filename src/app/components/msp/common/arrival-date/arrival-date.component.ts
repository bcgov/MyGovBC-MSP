import {Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core'
import {NgForm} from "@angular/forms";
import * as moment from 'moment';
import * as _ from 'lodash';
// import {ValidationStatus} from "../../common/validation-status.interface";

require('./arrival-date.component.less');

@Component({
  selector: 'msp-arrival-date',
  templateUrl: './arrival-date.component.html'
})
export class MspArrivalDateComponent implements OnInit, AfterViewInit, OnChanges{

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

  @Output() onChange = new EventEmitter<any>();
  @Output() isFormValid = new EventEmitter<boolean>();
  @Output() registerArrivalDateComponent = new EventEmitter<MspArrivalDateComponent>();

  @ViewChild('formRef') form: NgForm;

  ngOnChanges(changes: SimpleChanges):void{
    // console.log('changes on input for msp-arrival-date: ', changes);
  }

  ngOnInit(){
    
  }
  ngAfterViewInit(): void {
    this.registerArrivalDateComponent.emit(this);

    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
      if(this.required){
        this.isFormValid.emit(this.form.valid);
      }else{
        if(!this.month && !this.day && !this.year){
          this.isFormValid.emit(true);
        }else{
          this.isFormValid.emit(this.form.valid);
        }
      }
    });
    this.isFormValid.emit(this.form.valid);
  }

  // Parse person's date
  inputDate() {
    let y:number = this.year as number;
    let m:number = this.month as number;
    let d:number = this.month as number;
    return moment({
      year: y,
      month: m - 1, // moment use 0 index for month :(
      day: d,
    });
  }

  setYearValueOnModel(value:string){
    if(value){
      this.year = parseInt(value);
    }else{
      this.year = value;
    }
    this.yearChange.emit(this.year);
  }

  setDayValueOnModel(value:string){
    if(value){
      this.day = parseInt(value);
    }else{
      this.day = value;
    }
    this.dayChange.emit(this.day);
  }

  setMonthValueOnModel(value:string){
    if(value){
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
  isValid(): boolean {
    // Validate, only if provided
    if (this.year != null ||
        _.isNaN(this.month) ||
        this.day != null) {

      if (!this.inputDate().isValid()) {
        return false;
      }
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
