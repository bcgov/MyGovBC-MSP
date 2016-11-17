import {Component, Inject, Input} from '@angular/core';

require('./address.component.less');

@Component({
  selector: 'msp-address',
  templateUrl: './address.component.html'
})

export class MspAddressComponent {
    lang = require('./i18n');

    @Input('mailingOnly') mailingOnly: boolean;

    mailingAddressDifferent: boolean;


    constructor(@Inject('appConstants') appConstants: Object) {
        this.mailingAddressDifferent = false;
    }

    useDifferentMailingAddress() {
        this.mailingAddressDifferent = true;
    }

    useSameMailingAddress() {
        this.mailingAddressDifferent = false;
    }
}
