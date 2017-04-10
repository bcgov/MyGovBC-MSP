import {Component, Input, Output, EventEmitter, ViewChild, OnInit} from '@angular/core'
import {NgForm} from "@angular/forms";
import * as moment from 'moment';

require('./return-date.component.less');

@Component({
  selector: 'msp-return-date',
  templateUrl: './return-date.component.html'
})
export class MspReturnDateComponent implements OnInit{

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

  @Output() onChange = new EventEmitter<any>();
  @Output() isFormValid = new EventEmitter<boolean>();

  @ViewChild('formRef') form: NgForm;

  ngOnInit(){
    this.form.valueChanges.subscribe(
      (values) => {
        this.onChange.emit(values);
        this.isFormValid.emit(this.form.valid);
      }
    );
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

    // Validate
    if (!this.inputDate().isValid()) {
      return false;
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
