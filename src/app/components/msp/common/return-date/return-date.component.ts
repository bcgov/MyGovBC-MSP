import {Component, Input, Output, EventEmitter, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core'
import {NgForm} from "@angular/forms";
import * as moment from 'moment';
import {BaseComponent} from "../base.component";

require('./return-date.component.less');

@Component({
  selector: 'msp-return-date',
  templateUrl: './return-date.component.html'
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

  @ViewChild('formRef') form:NgForm;

  @Output() onChange = new EventEmitter<any>();

  constructor() {
    super();
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
  isCorrectFormat(): boolean {

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

  isValid(): boolean {
    return this.isCorrectFormat() && this.futureCheck();
  }
}
