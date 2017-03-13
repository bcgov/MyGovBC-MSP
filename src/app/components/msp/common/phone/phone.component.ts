import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core'
import {NgForm} from "@angular/forms";
import {PhoneNumber} from "../../model/phone.model";

@Component({
  selector: 'msp-phone',
  templateUrl: './phone.component.html'
})
export class MspPhoneComponent {
    lang = require('./i18n');

    @Input() phoneNumber: string;
    @Output() phoneNumberChange = new EventEmitter<string>();
    @Input('alternative') alternative = false;
    PhoneNumber: typeof PhoneNumber = PhoneNumber;

    @Output() onChange = new EventEmitter<any>();
    @ViewChild('formRef') form: NgForm;
    ngAfterViewInit(): void {
      this.form.valueChanges.subscribe(values => {
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
