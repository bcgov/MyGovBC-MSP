import {Component, Inject} from '@angular/core'
require('./address.component.less')
@Component({
  selector: 'msp-address',
  templateUrl: './address.component.html'
})
export class MspAddressComponent {
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
