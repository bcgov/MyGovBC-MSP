import {Component, Input} from '@angular/core';
import {MspPerson} from '../../model/msp-person.model';
import {Activities, StatusInCanada} from '../../../../models/status-activities-documents';
import { Router } from '@angular/router';
import { LegalStatus, StatusActivites } from '../../../../models/msp.contants';

@Component({
  selector: 'msp-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class MspPersonCardComponent {



  lang = require('./i18n');
  langStatus = LegalStatus;
  langActivities = StatusActivites;

  @Input() person: MspPerson;
  @Input() editRouterLink: string;
  @Input() customTitle: string;
  @Input() customLinkTitle: string;
  @Input() accountCard: boolean = false;
  constructor(private _router: Router) {

  }

  editPersonalInfo() {
    console.log(this.editRouterLink);
    this._router.navigate([this.editRouterLink]);
  }

  get movedFromLabel(): string {
    if (this.person.status === StatusInCanada.TemporaryResident ||
      this.person.currentActivity === Activities.MovingFromCountry) {
      return 'Moved from country:';
    }
    else {
      return 'Moved from province:';
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
