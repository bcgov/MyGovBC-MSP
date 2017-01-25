import {Component, Input, EventEmitter, Output, ViewChild, AfterViewInit} from '@angular/core';
import {NgForm, NgControl, FormControl, ValidatorFn} from "@angular/forms";

@Component({
  selector: 'msp-phn',
  templateUrl: './phn.component.html',

})

export class MspPhnComponent implements AfterViewInit{
  lang = require('./i18n');

  @Input() required: boolean = false;
  @Input() phnLabel: string = this.lang("./en/index.js").phnLabel;
  @Input() phn: string;
  @Output() phnChange = new EventEmitter<string>();
  @Input() bcPhn: boolean = false;

  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }
}