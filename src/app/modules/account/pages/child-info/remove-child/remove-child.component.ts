import { Component, OnInit, Input, AfterViewInit, OnDestroy, ChangeDetectorRef, Injectable , ViewChild, ViewChildren , QueryList, forwardRef } from '@angular/core';
import { nameChangeSupportDocuments } from '../../../../msp-core/components/support-documents/support-documents.component';
import { AbstractForm } from 'moh-common-lib';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {NgForm, ControlContainer} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../../models/base.component';
import {ProcessService, ProcessUrls} from '../../../../../services/process.service';
//import { AccountPersonalDetailsComponent}  from './personal-details/personal-details.component';
import { MspPerson } from '../../../models/account.model';
import {  CancellationReasons } from '../../../../../models/status-activities-documents';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';



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
        "label": "No Longer in full Studies",
        "value": CancellationReasons.NoLongerInFullTimeStudies
      },
      { 
        "label": "Deceased",
        "value": CancellationReasons.Deceased
      },
      { 
        "label": "Out of province/ Out of Country move",
        "value": CancellationReasons.OutOfProvinceOrCountry
      },
      { 
        "label": "Armed Forces",
        "value": CancellationReasons.ArmedForces
      },
      { 
        "label": "Incarcerated",
        "value": CancellationReasons.Incarcerated
      },
  ]};

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
