import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NgForm, ControlContainer} from '@angular/forms';
import { CancellationReasons, CancellationReasonsStrings } from '../../../../../models/status-activities-documents';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspAccountApp, AccountChangeOptions } from '../../../models/account.model';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { ErrorMessage } from 'moh-common-lib';

@Component({
  selector: 'msp-remove-child',
  templateUrl: './remove-child.component.html',
  styleUrls: ['./remove-child.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: forwardRef(() => NgForm)
    }
  ]
})

export class RemoveChildComponent implements OnInit {
  constructor( public dataService: MspAccountMaintenanceDataService) { }

  ngOnInit() {
  }

  @Input() accountChangeOptions: AccountChangeOptions;
  @Input() child: MspPerson ;
  @Input() accountApp: MspAccountApp;
  @Input() index: number;
  @Input() phns: string[];
  listofCancellationReasons = [
    {
      'label': 'No longer in full time studies',
      'value': CancellationReasons.NoLongerInFullTimeStudies
    },
    {
      'label': 'Deceased',
      'value': CancellationReasons.Deceased
    },
    {
      'label': 'Out of province / Out of Country',
      'value': CancellationReasons.OutOfProvinceOrCountry
    },
    {
      'label': 'Armed Forces',
      'value': CancellationReasons.ArmedForces
    },
    {
      'label': 'Incarcerated',
      'value': CancellationReasons.Incarcerated
    },
  ];

  cancellationDateErrorMessage: ErrorMessage = {
    invalidRange: 'Date may not be in the future and must be after the child\'s birthday'
  }

  get dateToday(): Date {
    return new Date();
  }

  get cancellationReasons() {
    return this.listofCancellationReasons;
  }

  handleAddressUpdate(evt: any) {
    evt.addressLine1 = evt.street;
    this.dataService.saveMspAccountApp();
  }

  isPhnUniqueInChild() {
    return this.dataService.accountApp.isUniquePhnsinDependents;
  }

  setCancellationStatus(evt: any) {
    this.child.cancellationReason = evt;
    this.child.reasonForCancellation = CancellationReasonsStrings[evt];
    this.dataService.saveMspAccountApp();
  }

  get phnList() {
    const cp = [...this.phns];
    cp.splice(cp.indexOf(this.child.phn), 1);
    return cp;
  }
}
