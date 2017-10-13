import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  StatusInCanada, StatusRules, Activities, ActivitiesRules
} from '../../model/status-activities-documents'
import { Person } from '../../model/person.model';

@Component({
  selector: 'msp-status-in-canada-radio',
  templateUrl: './status-in-canada-radio.component.html',
  styleUrls: ['./status-in-canada-radio.component.less']
})
export class StatusInCanadaRadioComponent {
  lang = require('./i18n');
  langAccountActivities = require('../../common/account-activities/i18n');

  Activities: typeof Activities = Activities;
  StatusInCanada: typeof StatusInCanada = StatusInCanada;

  @Input() person: Person;
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  setStatus(value: StatusInCanada, p: Person) {
    p.status = value;
    p.currentActivity = null;

    if (p.status !== StatusInCanada.CitizenAdult) {
      p.institutionWorkHistory = 'No';
    }
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

}
