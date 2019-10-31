import {Component, Input} from '@angular/core';
import {Address} from 'moh-common-lib';
import { Router } from '@angular/router';

// TODO: replace with msp-address-review-card uses the msp-review-part & msp-address-review-part
@Component({
  selector: 'msp-contact-card',
  templateUrl: './contact-card.component.html'
})
export class MspContactCardComponent {

  @Input() residentialAddress: Address;
  @Input() mailingAddress: Address;
  @Input() phone: string;
  @Input() altPhone: string;
  @Input() editRouterLink: string;
  @Input() displayMailingAddress: boolean = false;

  constructor(private _router: Router) {

  }

  editPersonalInfo() {
    this._router.navigate([this.editRouterLink]);
  }

}
