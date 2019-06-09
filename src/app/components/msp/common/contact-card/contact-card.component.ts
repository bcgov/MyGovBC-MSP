import {Component, Input} from '@angular/core';
import {Address} from '../../model/address.model';
import {Person} from '../../model/msp-person.model';
import * as moment from 'moment';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

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
