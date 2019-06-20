import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Person } from 'moh-common-lib';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { MspPerson } from 'app/modules/account/models/account.model';

@Component({
  selector: 'msp-assist-account-holder',
  template: `
    <common-name
      [(ngModel)]="person.firstName"
      label="First name"
    ></common-name>
    <common-name
      [(ngModel)]="person.middleName"
      label="Middle name(optional)"
    ></common-name>
    <common-name [(ngModel)]="person.lastName" label="Last Name"></common-name>
    <msp-birthdate [person]="person" label="Date of Birth"></msp-birthdate>
    <common-phn [(ngModel)]="person.specificMember_phn"></common-phn>
    <common-sin [(ngModel)]="person.sin"></common-sin>
  `,
  styleUrls: ['./assist-account-holder.component.scss']
})
export class AssistAccountHolderComponent implements OnInit {
  @Input() person: MspPerson;
  @Output() dataChange: EventEmitter<Person> = new EventEmitter<Person>();

  constructor() {}

  ngOnInit() {
    // this.assistApp.applicant.
  }
}
