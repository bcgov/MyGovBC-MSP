import {Component, OpaqueToken, Inject} from '@angular/core'
require('./index.less')
@Component({
  selector: 'msp-address',
  templateUrl: './index.html'
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
