import {Component, Input, EventEmitter, Output} from '@angular/core'

@Component({
  selector: 'msp-phone',
  templateUrl: './phone.component.html'
})
export class MspPhoneComponent {
    lang = require('./i18n');

    @Input() phoneNumber: string;
    @Output() phoneNumberChange = new EventEmitter<string>();
    @Input('alternative') alternative = false;

    getLabel() {
      if (this.alternative) {
        return this.lang('./en/index.js').altPhoneLabel;
      }
      else {
        return this.lang('./en/index.js').phoneLabel;
      }
    }
}
