import {Component, Input} from '@angular/core';
import {MspPerson} from '../../model/msp-person.model';
import { Router } from '@angular/router';
import { StatusInCanada, CanadianStatusReason, CanadianStatusStrings, CanadianStatusReasonStrings, statusInCanadaStrings, statusInCanadaReasonStrings } from '../../../../modules/msp-core/models/canadian-status.enum';

@Component({
  selector: 'msp-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class MspPersonCardComponent {

  lang = require('./i18n');
  langStatus = statusInCanadaStrings;
  langActivities = statusInCanadaReasonStrings;

  @Input() person: MspPerson;
  @Input() editRouterLink: string;
  @Input() customTitle: string;
  @Input() customLinkTitle: string;
  @Input() accountCard: boolean = false;
  constructor(private _router: Router) {

  }
  
  ngOnInit() {
    console.log('Has DOB?: ' + this.person.hasDob + '    DOB:' + this.person.dob + '    DOB MONTH:' + this.person.dob_month);
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
}
