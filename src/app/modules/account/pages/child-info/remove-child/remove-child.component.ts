import { Component, OnInit, Input, forwardRef } from '@angular/core';
import {NgForm, ControlContainer} from '@angular/forms';
import {  CancellationReasons } from '../../../../../models/status-activities-documents';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspAccountApp, AccountChangeOptions } from '../../../models/account.model';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';



@Component({
  selector: 'msp-remove-child',
  templateUrl: './remove-child.component.html',
  styleUrls: ['./remove-child.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
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

  get cancellationReasons() {
    return[
      {
        'label': 'No Longer in full Studies',
        'value': CancellationReasons.NoLongerInFullTimeStudies
      },
      {
        'label': 'Deceased',
        'value': CancellationReasons.Deceased
      },
      {
        'label': 'Out of province/ Out of Country move',
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
  ]; }

  handleAddressUpdate(evt: any){
    console.log(evt);
    console.log('address update event: %o', evt);
    evt.addressLine1 = evt.street;
    this.dataService.saveMspAccountApp();
  }


  isPhnUniqueInChild() {
    return this.dataService.accountApp.isUniquePhnsinDependents;
  }
}
