import {Component, Input} from '@angular/core'
import {Address} from "../../model/address.model";
require('./address-card-part.component.less');

@Component({
  selector: 'msp-address-card-part',
  templateUrl: './address-card-part.component.html'
})
export class MspAddressCardPartComponent {
  lang = require('./i18n');
  langProvince = require('../province/i18n');

  @Input() address: Address;
  @Input() label: string;

  constructor() {
  }

}
