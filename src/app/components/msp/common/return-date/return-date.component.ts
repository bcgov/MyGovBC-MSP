import {Component, Input, Output, EventEmitter, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core'
import {NgForm} from "@angular/forms";
import * as moment from 'moment';
import {BaseComponent} from "../base.component";


@Component({
  selector: 'msp-return-date',
  templateUrl: './return-date.component.html',
  styleUrls: ['./return-date.component.less']
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

  @ViewChild('formRef') form:NgForm;

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
    return this.isCorrectFormat() && this.futureCheck();
  }
}
