import {Component, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef} from '@angular/core'
import { NgForm } from '@angular/forms';

import * as moment from 'moment';
import {BaseComponent} from "../base.component";


@Component({
  selector: 'msp-discharge-date',
  templateUrl: './discharge-date.component.html',
  styleUrls: ['./discharge-date.component.less']
  
})
export class MspDischargeDateComponent extends BaseComponent {

  lang = require('./i18n');
  @Output() onChange = new EventEmitter<any>();
  @Input() showError:boolean;
  @Input() year: number;
  @Output() yearChange = new EventEmitter<number>();
  @Input() month: number;
  @Output() monthChange = new EventEmitter<number>();
  @Input() day: number;
  @Output() dayChange = new EventEmitter<number>();

  @ViewChild('formRef') form: NgForm;
  
  // Create today for comparison in check later
  today = moment();

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }

  // Parse person's date
  date() {
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
    if (!this.date().isValid()) {
      return false;
    }

    return true;
  }

  futureCheck(): boolean {

    // Check not in future
    if (this.date().isAfter(this.today)) {
      return false;
    }

    return true;
  }

  isValid(): boolean {
    return this.isCorrectFormat() && this.futureCheck();
  }
}
