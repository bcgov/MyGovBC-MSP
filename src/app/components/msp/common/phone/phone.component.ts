import {Component, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PhoneNumber} from '../../model/phone.model';
import {BaseComponent} from '../../../../models/base.component';
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'msp-phone',
  templateUrl: './phone.component.html'
})
export class MspPhoneComponent extends BaseComponent {
    lang = require('./i18n');

    @Input() phoneNumber: string = 'Phone number';
    @Output() phoneNumberChange = new EventEmitter<string>();
    @Input('alternative') alternative = false;
    PhoneNumber: typeof PhoneNumber = PhoneNumber;
    @Input() label: string = 'Postal Code';

    @Output() onChange = new EventEmitter<any>();
    @ViewChild('formRef') form: NgForm;

    constructor(private cd: ChangeDetectorRef) {
      super(cd);
    }

    ngAfterViewInit(): void {
      // https://github.com/angular/angular/issues/24818
      this.form.valueChanges.pipe(debounceTime(0)).subscribe((values) => {
        this.onChange.emit(values);
      });
    }

    getLabel() {
      if (this.alternative) {
        return this.lang('./en/index.js').altPhoneLabel;
      }
      else {
        return this.lang('./en/index.js').phoneLabel;
      }
    }
}
