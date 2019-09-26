import {Component, Input} from '@angular/core';
import {MspPerson} from '../../model/msp-person.model';
import { Router } from '@angular/router';
import { StatusInCanada,
  CanadianStatusReason,
  CanadianStatusStrings,
  CanadianStatusReasonStrings } from '../../../../modules/msp-core/models/canadian-status.enum';
import { getCountryDescription, getProvinceDescription } from 'moh-common-lib';

@Component({
  selector: 'msp-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class MspPersonCardComponent {

  lang = require('./i18n');

  status: string[] = Object.keys(CanadianStatusStrings).map( x  => CanadianStatusStrings[x] );

  statusReason: string[] = Object.keys(CanadianStatusReasonStrings).map( x  => CanadianStatusReasonStrings[x] );


  @Input() person: MspPerson;
  @Input() editRouterLink: string;
  @Input() customTitle: string;
  @Input() customLinkTitle: string;
  @Input() accountCard: boolean = false;
  constructor(private _router: Router) {
  }

  ngOnInit() {
  }

  editPersonalInfo() {
    console.log(this.editRouterLink);
    this._router.navigate([this.editRouterLink]);
  }

  get movedFromLabel(): string {
    if (this.person.status === StatusInCanada.TemporaryResident ||
      this.person.currentActivity === CanadianStatusReason.MovingFromCountry) {
      return 'Moved from country';
    }
    else {
      return 'Moved from province';
    }
  }

  get fileLabel(): string {

    if (this.person.assistYearDocs !== null && this.person.assistYearDocs.length > 0 ) {
      if (this.person.assistYearDocs.length > 1) {
        return 'Files';
      } else if (this.person.assistYearDocs.length < 2) {
        return 'File';
      }
    }
  }

  get movedFromProvinceOrCountry() {
    if (this.person.currentActivity === CanadianStatusReason.MovingFromCountry ) {
      return getCountryDescription( this.person.movedFromProvinceOrCountry );
    }
    return getProvinceDescription( this.person.movedFromProvinceOrCountry );
  }
}
