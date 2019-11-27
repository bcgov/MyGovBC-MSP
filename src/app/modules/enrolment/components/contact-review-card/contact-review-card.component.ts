import { Component, Input } from '@angular/core';
import { Address } from 'moh-common-lib';
import { ColumnClass } from '../../../msp-core/components/review-part/review-part.component';

@Component({
  selector: 'msp-contact-review-card',
  templateUrl: './contact-review-card.component.html',
  styleUrls: ['./contact-review-card.component.scss']
})
export class ContactReviewCardComponent {

  @Input() residentialAddress: Address;
  @Input() mailingAddress: Address;
  @Input() phoneNumber: string;
  @Input() editRouterLink: string;

  // Formatting for column sizes
  columnClass: ColumnClass = {label: 'col-sm-4', value: 'col-sm-8 font-weight-bold'};

  constructor() { }

}
