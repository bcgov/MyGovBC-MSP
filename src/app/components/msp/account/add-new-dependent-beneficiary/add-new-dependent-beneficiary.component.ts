import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from '../../model/person.model';
import { Relationship, StatusInCanada } from '../../model/status-activities-documents';

@Component({
  selector: 'msp-add-new-dependent-beneficiary',
  templateUrl: './add-new-dependent-beneficiary.component.html',
  styleUrls: ['./add-new-dependent-beneficiary.component.less']
})
export class AddNewDependentBeneficiaryComponent implements OnInit {
  Relationship: typeof Relationship = Relationship;
  StatusInCanada: typeof StatusInCanada = StatusInCanada;
  @Input() person: Person;
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
  lang = require('./i18n');
  public showHasBeenReleasedFromArmedForces: boolean;

  constructor() { }

  ngOnInit() {
  }

}
