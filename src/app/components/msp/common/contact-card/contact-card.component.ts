import {Component, Input} from '@angular/core'
import {Address} from "../../model/address.model";
require('./contact-card.component.less');

@Component({
  selector: 'msp-contact-card',
  templateUrl: './contact-card.component.html'
})
export class MspContactCardComponent {
  lang = require('./i18n');

  @Input() residentialAddress: Address;
  @Input() mailingAddress: Address;
  @Input() phone: string;
  @Input() editRouterLink: string;

  constructor() {
  }

}
