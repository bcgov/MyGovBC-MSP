import {Component, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef} from '@angular/core'
import {NgForm} from "@angular/forms";
import {PhoneNumber} from "../../model/phone.model";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'msp-phone',
  templateUrl: './phone.component.html'
})
export class MspPhoneComponent extends BaseComponent {
    lang = require('./i18n');

    @Input() phoneNumber: string;
    @Output() phoneNumberChange = new EventEmitter<string>();
    @Input('alternative') alternative = false;
    PhoneNumber: typeof PhoneNumber = PhoneNumber;

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
    
    getLabel() {
      if (this.alternative) {
        return this.lang('./en/index.js').altPhoneLabel;
      }
      else {
        return this.lang('./en/index.js').phoneLabel;
      }
    }
}
