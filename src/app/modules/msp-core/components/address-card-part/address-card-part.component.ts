import {Component, Input} from '@angular/core';
import { Address, getCountryDescription, getProvinceDescription } from 'moh-common-lib';

@Component({
  selector: 'msp-address-card-part',
  templateUrl: './address-card-part.component.html'
})
export class MspAddressCardPartComponent {
  @Input() address: Address;
  @Input() label: string;

  constructor() {
  }

  get country(){
    return getCountryDescription(this.address.country);
  }

  get province(){
    return getProvinceDescription(this.address.province);
  }

}
