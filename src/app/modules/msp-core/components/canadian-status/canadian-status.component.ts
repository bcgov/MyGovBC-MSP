import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { StatusInCanada, CanadianStatusStrings, CanadianStatusReasonStrings, CanadianStatusReason } from '../../models/canadian-status.enum';
import { Relationship } from '../../../../models/relationship.enum';
import { Base } from 'moh-common-lib';

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

export function getStatusStrings(): string[] {
  return Object.keys(CanadianStatusStrings).map( x  => CanadianStatusStrings[x] );
}

export function getStatusReasonStrings(): string[] {
  return Object.keys(CanadianStatusReasonStrings).map( x  => CanadianStatusReasonStrings[x] );
}

/**
 * Component requires these fields.
 * Component Generic as each application could have different requirements for a person
 */
export interface ICanadianStatus {
  status: StatusInCanada;
  currentActivity: CanadianStatusReason;
  relationship: Relationship;
  clearData?(x: any): void;
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
export class CanadianStatusComponent<T extends ICanadianStatus> extends Base {

  //List of statuses to be displayed, if not provided, the default uses statusReasonRules().
  @Input() statusReasonList: CanadianStatusReason[];
  @Input() label: String = 'Your immigration status in Canada';

  @Input() displayStatusInCanada: boolean = true;
  // List of statuses where the status reasons show not be shown
  @Input() hideStatusReasons: StatusInCanada[] = [];

  @Input() person: T;
  @Output() personChange: EventEmitter<T> = new EventEmitter<T>();

  statusOpts: string[] = getStatusStrings();

  private _reasonOpts: string[] = getStatusReasonStrings();

  constructor() {
    super();
  }

  /**
   * Gets status available to the current person
   */
  get statusInCanada(): string {
    return this.person.status !== undefined ? this.statusOpts[this.person.status] : undefined;
  }

  set statusInCanada( val: string ) {

    const status = Object.keys(CanadianStatusStrings).find( x => CanadianStatusStrings[x] === val );

    this.person.status = StatusInCanada[status];

    // not activity at this point - mark as undefined
    this.person.currentActivity = undefined;
    this.personChange.emit(this.person);
  }

  get displayStatusReasons() {
    let show = (this.statusInCanada !== undefined);
    if ( show && this.hideStatusReasons.length > 0 ) {
      const tmp = this.hideStatusReasons.find( x => x === this.person.status );
      show = tmp === undefined ? true : false;
    }
    return show;
  }

  /**
   * Display available activities for status
   */
  get availableStatusReasons() {
    if ( this.reasonList ) {
      return this.reasonList.map(itm => {
        return {
          label: this._reasonOpts[itm],
          value: itm
        };
      });
    }
  }

  get reasonList() {
      // Get the status reason list available for the selected status
      if ( !this.statusReasonList ) {
        return statusReasonRules( this.person.relationship, this.person.status );
      }
      return this.statusReasonList;
  }

  get statusReason() {
    return this.person.currentActivity;
  }

  set statusReason( reason: CanadianStatusReason ) {
    this.person.currentActivity = reason;

    if ( this.person.clearData ) {
      // Clear data
      this.person.clearData( this.person );
    }
    this.personChange.emit(this.person);
  }
}
