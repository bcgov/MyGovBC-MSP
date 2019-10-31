import { Component, Input } from '@angular/core';

import { getCountryDescription, getProvinceDescription, Address } from 'moh-common-lib';
import { ColumnClass } from '../../../msp-core/components/review-part/review-part.component';

@Component({
  selector: 'msp-address-review-part',
  templateUrl: './address-review-part.component.html',
  styleUrls: ['./address-review-part.component.scss']
})
export class AddressReviewPartComponent {

  @Input() address: Address;
  @Input() label: string;

  // Formatting for column sizes
  columnClass: ColumnClass = {label: 'col-sm-4', value: 'col-sm-8 font-weight-bold'};

  constructor() {
  }

  // Checks that we have an address
  get hasAddress() {
    return this.address && this.address.isComplete();
  }

  get country() {
    return getCountryDescription( this.address.country );
  }

  get province() {
    return getProvinceDescription( this.address.province );
  }
}
