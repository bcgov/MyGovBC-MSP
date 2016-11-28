import {Component, Inject, Input} from '@angular/core'

require('./phone.component.less')
@Component({
  selector: 'msp-phone',
  templateUrl: './phone.component.html'
})
export class MspPhoneComponent {
    lang = require('./i18n');

    @Input() phoneNumber: String;
    @Input('alternative') alternative = false;

    constructor(@Inject('appConstants') appConstants: Object) {
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
