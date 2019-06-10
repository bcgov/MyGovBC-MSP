import {Component, Input} from '@angular/core';
import {Address} from '../../model/address.model';
import { Router } from '@angular/router';

@Component({
  selector: 'msp-contact-card',
  templateUrl: './contact-card.component.html'
})
export class MspContactCardComponent {
  lang = require('./i18n');

  @Input() residentialAddress: Address;
  @Input() mailingAddress: Address;
  @Input() phone: string;
  @Input() altPhone: string;
  @Input() editRouterLink: string;

  constructor(private _router: Router){

  }

  editPersonalInfo() {
    this._router.navigate([this.editRouterLink]);
  }

}
