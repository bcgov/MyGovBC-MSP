import { ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  StatusInCanada, StatusRules, Activities, ActivitiesRules
} from '../../model/status-activities-documents'
import { Person } from '../../model/person.model';
import { BaseComponent } from "../../common/base.component";

@Component({
  selector: 'msp-status-in-canada-radio',
  templateUrl: './status-in-canada-radio.component.html',
  styleUrls: ['./status-in-canada-radio.component.less']
})
export class StatusInCanadaRadioComponent extends BaseComponent {
  lang = require('./i18n');
  langAccountActivities = require('../../common/account-activities/i18n');

  Activities: typeof Activities = Activities;
  StatusInCanada: typeof StatusInCanada = StatusInCanada;

  @Input() person: Person;
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();

  constructor(cd: ChangeDetectorRef) { 
    super(cd);
  }

  setStatus(value: StatusInCanada, p: Person) {
    p.status = value;
    p.currentActivity = null;

    if (p.status !== StatusInCanada.CitizenAdult) {
      p.institutionWorkHistory = 'No';
    }
    this.onChange.emit();
    this.emitIsFormValid();
  }

  setActivity(value:Activities) {
    this.person.currentActivity = value;
    this.person.movedFromProvinceOrCountry = '';
    this.onChange.emit();
  }

  /**
   * Gets the available activities given the known status
   */
  get activities(): Activities[] {
    return ActivitiesRules.availableActivities(this.person.relationship, this.person.status);
  }

  get statusInCanada(): StatusInCanada[] {
    return StatusRules.availableStatus(this.person.relationship);
  }

  /** Valid as long as user has made a choice. Invalid if it's in its default state with no data. */
  isValid(): boolean {
    return this.person.status !== undefined
  }

}
