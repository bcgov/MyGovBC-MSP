import { Component, ViewChild, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { ServicesCardDisclaimerModalComponent } from '../services-card-disclaimer/services-card-disclaimer.component';
import { ControlContainer, NgForm } from '@angular/forms';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { StatusInCanada, CanadianStatusStrings, CanadianStatusReasonStrings, CanadianStatusReason } from '../../models/canadian-status.enum';
import { Relationship } from '../../models/relationship.enum';

/**
 * TODO: May be able to remove once re-factor done
 * @param relationship
 */
export function statusRules( relationship: Relationship ): StatusInCanada[] {
  switch (relationship) {
    default:
      return [
        StatusInCanada.CitizenAdult,
        StatusInCanada.PermanentResident,
        StatusInCanada.TemporaryResident
      ];
  }
}

/**
 * Default rules for activities related to status in Canada
 * @param relationship
 * @param status
 */
export function statusReasonRules( relationship: Relationship,
                                   status: StatusInCanada ): CanadianStatusReason[] {
  switch (status) {
    case StatusInCanada.CitizenAdult:
    case StatusInCanada.PermanentResident:
      if (relationship === Relationship.Child19To24 ||
          relationship === Relationship.ChildUnder19 ||
          relationship === Relationship.ChildUnder24) {
        return [
          CanadianStatusReason.MovingFromProvince,
          CanadianStatusReason.MovingFromCountry,
          CanadianStatusReason.LivingInBCWithoutMSP
        ];
      }
      else {
        return [
          CanadianStatusReason.MovingFromProvince,
          CanadianStatusReason.MovingFromCountry,
          CanadianStatusReason.LivingInBCWithoutMSP
        ];
      }
    case StatusInCanada.TemporaryResident:
      if (relationship === Relationship.Applicant) {
        return [
          CanadianStatusReason.WorkingInBC,
          CanadianStatusReason.StudyingInBC,
          CanadianStatusReason.ReligiousWorker,
          CanadianStatusReason.Diplomat];
      } else {
        return [
          CanadianStatusReason.WorkingInBC,
          CanadianStatusReason.StudyingInBC,
          CanadianStatusReason.ReligiousWorker,
          CanadianStatusReason.Diplomat,
          CanadianStatusReason.Visiting];
      }
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
export class CanadianStatusComponent implements OnInit {

  @ViewChild('mspServicesCardModal')
    servicesCardDisclaimerModalComponent: ServicesCardDisclaimerModalComponent;

  @Input() statusReasonList: CanadianStatusReason[];
  @Input() label: String = 'Your immigration status in Canada';

  @Input() person: MspPerson;
  @Output() personChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

  statusOpts: string[] = Object.keys(CanadianStatusStrings).map( x  => CanadianStatusStrings[x] );
  showServicesCardModal: boolean;

  private _reasonList: CanadianStatusReason[] = [];
  private _reasonOpts: string[] = Object.keys(CanadianStatusReasonStrings).map( x  => CanadianStatusReasonStrings[x] );


  constructor() { }

  ngOnInit() {
  }

  /**
   * Gets status available to the current person
   */
  getStatusInCanada() {
    return this.person.status !== undefined ? this.statusOpts[this.person.status] : undefined;
  }

  setStatusInCanada($event) {

    const status = Object.keys(CanadianStatusStrings).find( x => CanadianStatusStrings[x] === $event );

    this.person.status = StatusInCanada[status];

    // Get the status reason list available for the selected status
    if ( !this.statusReasonList ) {
      this._reasonList = statusReasonRules( this.person.relationship, this.person.status );
    } else {
      this._reasonList = this.statusReasonList;
    }

    // initialize activity
    this.person.currentActivity = null;

    if (this.person.status !== StatusInCanada.CitizenAdult) {
      this.person.institutionWorkHistory = 'No';
    }
    this.showServicesCardModal = true;
    this.personChange.emit(this.person);
  }

  /**
   * Set the reason for the Status in Canada
   * @param value
   */
  setReason(value: CanadianStatusReason) {
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
  get availableStatusReasons() {

    if ( this._reasonList ) {
      return this._reasonList.map(itm => {
        return {
          label: this._reasonOpts[itm],
          value: itm
        };
      });
    }
  }
}
