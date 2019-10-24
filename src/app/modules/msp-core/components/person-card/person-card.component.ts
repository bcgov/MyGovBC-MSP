import {Component, Input} from '@angular/core';
import {MspPerson} from '../../../../components/msp/model/msp-person.model';
import { Router } from '@angular/router';
import { StatusInCanada, CanadianStatusReason } from '../../models/canadian-status.enum';
import { getCountryDescription, getProvinceDescription } from 'moh-common-lib';
import { getStatusStrings, getStatusReasonStrings } from '../canadian-status/canadian-status.component';
import { Relationship } from '../../../../models/relationship.enum';
import { format } from 'date-fns';


/* TO BE REPLACED when remaining apps are refactored to have own application  model definitions
 * built off the base classes ( base-person.model, base-application.model, base-msp-data.service,
 * base-msp-api.service)
 */
@Component({
  selector: 'msp-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class MspPersonCardComponent {

  public dateFormat = 'MMMM d, yyyy';

  lang = require('./i18n');

  status: string[] = getStatusStrings();

  statusReason: string[] = getStatusReasonStrings();


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

  formatDateField( dt: Date ) {
    return format( dt, this.dateFormat );
  }

  get hasMarriageDate(): boolean {
    return !!this.person.marriageDate && this.person.relationship === Relationship.Spouse;
  }
}
