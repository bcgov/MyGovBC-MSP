import {Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core'
import {NgForm} from "@angular/forms";
import * as moment from 'moment';
import * as _ from 'lodash';
import {ValidationStatus} from "../../common/validation-status.interface";

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
  @Input() year: number;
  @Output() yearChange = new EventEmitter<number>();
  @Input() month: number;
  @Output() monthChange = new EventEmitter<number>();
  @Input() day: number;
  @Output() dayChange = new EventEmitter<number>();
  @Input() arrivalLabel: string = this.lang('./en/index.js').arrivalDateLabel;

  @Output() onChange = new EventEmitter<any>();
  @Output() isFormValid = new EventEmitter<ValidationStatus>();
  @Output() registerArrivalDateComponent = new EventEmitter<MspArrivalDateComponent>();

  @ViewChild('formRef') form: NgForm;

  ngOnChanges(changes: SimpleChanges):void{
    // console.log('changes on input for msp-arrival-date: ', changes);
  }

  ngOnInit(){
    this.registerArrivalDateComponent.emit(this);
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
      this.isFormValid.emit( {name: 'arrival date component', value: this.form.valid});
    });
  }
  ngAfterViewInit(): void {

  }

  // Parse person's date
  inputDate() {
    return moment({
      year: this.year,
      month: this.month - 1, // moment use 0 index for month :(
      day: this.day,
    });
  }

  setYearValueOnModel(value:string){
    this.year = parseInt(value);
    this.yearChange.emit(this.year);
    
  }

  setDayValueOnModel(value:string){
    this.day = parseInt(value);
    this.dayChange.emit(this.day);
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
