import {Component, Input} from '@angular/core';
import {MspPerson} from '../../model/msp-person.model';
import {Activities, StatusInCanada} from '../../model/status-activities-documents';
import { Router } from '@angular/router';
@Component({
  selector: 'msp-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class MspPersonCardComponent {
  lang = require('./i18n');
  langStatus = require('../status/i18n');
  langActivities = require('../activities/i18n');
  langProvince = require('../province/i18n');

  @Input() person: MspPerson;
  @Input() editRouterLink: string;
  @Input() customTitle: string;
  @Input() customLinkTitle: string;
  @Input() accountCard: boolean = false;
  constructor(private _router: Router) {

  }

  editPersonalInfo() {

    this._router.navigate([this.editRouterLink]);
  }

  get movedFromLabel(): string {
    if (this.person.status === StatusInCanada.TemporaryResident ||
      this.person.currentActivity === Activities.MovingFromCountry) {
      return this.lang('./en/index.js').movedFromCountryLabel;
    }
    else {
      return this.lang('./en/index.js').movedFromProvinceLabel;
    }
  }
}
