import { Component, ViewChild, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { ServicesCardDisclaimerModalComponent } from '../services-card-disclaimer/services-card-disclaimer.component';
import { LangActivities,
         Relationship,
         Activities} from '../../models/status-activities-documents';
import { ControlContainer, NgForm } from '@angular/forms';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { StatusInCanada } from '../../models/canadian-status.enum';

/**
 * TODO: May be able to remove once re-factor done
 * @param relationship
 */
export function statusRules(relationship: Relationship): StatusInCanada[] {
  switch (relationship) {
    default:
      return [
        StatusInCanada.CitizenAdult,
        StatusInCanada.PermanentResident,
        StatusInCanada.TemporaryResident
      ];
  }
}

@Component({
  selector: 'msp-canadian-status',
  templateUrl: './canadian-status.component.html',
  styleUrls: ['./canadian-status.component.scss'],

  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})
export class CanadianStatusComponent {

  @ViewChild('mspServicesCardModal')
    servicesCardDisclaimerModalComponent: ServicesCardDisclaimerModalComponent;

  @Input() activityList: Activities[] = [];
  @Input() label: String = 'Your immigration status in Canada';

  @Input() person: MspPerson;
  @Output() personChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

  CanadianStatusStrings = {
    CitizenAdult: 'Canadian citizen',
    PermanentResident: 'Permanent resident',
    TemporaryResident: 'Temporary permit holder or diplomat'
  };

  statusOpts: string[] = Object.keys(this.CanadianStatusStrings).map( x  => this.CanadianStatusStrings[x] );
  activitiesOpts: string[] = Object.keys(LangActivities).map( x  => LangActivities[x] );
  showServicesCardModal: boolean;

  constructor() { }

  /**
   * Gets status available to the current person
   */
  getStatusInCanada() {
    return this.person.status !== undefined ? this.statusOpts[this.person.status] : undefined;
  }

  setStatusInCanada($event) {
    const status = Object.keys(this.CanadianStatusStrings).find( x => this.CanadianStatusStrings[x] === $event );

    this.person.status = StatusInCanada[status];

    // initialize activity
    this.person.currentActivity = null;

    if (this.person.status !== StatusInCanada.CitizenAdult) {
      this.person.institutionWorkHistory = 'No';
    }
    this.showServicesCardModal = true;
    this.personChange.emit(this.person);
  }

  /**
   * Set the activity for the Status in Canada
   * @param value
   */
  setActivity(value: Activities) {
    if (
      this.showServicesCardModal &&
      this.person.bcServiceCardShowStatus &&
      this.person.relationship !== Relationship.ChildUnder19
    ) {
      this.servicesCardDisclaimerModalComponent.showModal();
      this.showServicesCardModal = false;
    }

    this.person.currentActivity = value;
    this.person.movedFromProvinceOrCountry = '';
    this.personChange.emit(this.person);
  }

  /**
   * Display available activities for status
   */
  get availableActivties() {
    return this.activityList.map(itm => {
      return {
        label: this.activitiesOpts[itm],
        value: itm
      };
    });
  }
}
