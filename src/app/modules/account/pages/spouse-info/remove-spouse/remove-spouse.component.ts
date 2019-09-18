import {ChangeDetectorRef, Component, Injectable , ViewChild, ViewChildren , QueryList, Input } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../.././../../models/base.component';
import {AccountPersonalDetailsComponent} from '../../personal-info/personal-details/personal-details.component';
import { MspPerson } from '../../../models/account.model';
import { Relationship } from '../../../../../models/status-activities-documents';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';
import { legalStatus } from '../../../../../models/msp.contants';
import {
  StatusRules,
  ActivitiesRules,
  StatusInCanada,
  Activities,
  DocumentRules,
  Documents,
  CancellationReasons
} from '../../../../../models/status-activities-documents';

import {

  Gender
} from '../../../../../components/msp/model/msp-person.model';

import { Person } from 'moh-common-lib';


@Component({
  selector: 'msp-remove-spouse',
  templateUrl: './remove-spouse.component.html',
  styleUrls: ['./remove-spouse.component.scss']
})
export class RemoveSpouseComponent extends BaseComponent {
  
  //static ProcessStepNum = 1;
 
  docSelected: string ;
  //langActivities = require('../../../../components/msp/common/activities/i18n');

  langStatus = legalStatus;

  Activities: typeof Activities = Activities;
  @ViewChild('formRef') form: NgForm;
  @ViewChildren(AccountPersonalDetailsComponent) personalDetailsComponent: QueryList<AccountPersonalDetailsComponent>;
  public buttonstyle: string = 'btn btn-default';
  accountApp: MspAccountApp;
  accountChangeOptions: AccountChangeOptions;
  accountHolderTitle: string = 'Account Holder Identification';
  accountHolderSubtitle: string = 'Please provide the Account Holder’s personal information for verification purposes.';
  @Input() spouse: MspPerson;
  updateList: UpdateList[];

  constructor(public dataService: MspAccountMaintenanceDataService, cd: ChangeDetectorRef) {

    super(cd);


  }


  ngOnInit() {
    this.accountApp = this.dataService.accountApp;
    this.accountChangeOptions = this.dataService.accountApp.accountChangeOptions;
    //this.spouse = this.dataService.accountApp.removedSpouse;
  }

  onChange($event){
    console.log($event);
    console.log(this.spouse);
    this.dataService.saveMspAccountApp();
  }

  setCancellationStatus(evt: any) {
    console.log(evt);
    if(evt === 1) {
      this.spouse.reasonForCancellation = evt;
    }
    this.dataService.saveMspAccountApp();

  }

  handleAddressUpdate(evt: any){
    console.log(evt);
    console.log('address update event: %o', evt);
    evt.addressLine1 = evt.street;
    this.dataService.saveMspAccountApp();
  }

  get cancellationReasons() {
    return[
      { 
        "label": "Seperated/Divorced",
        "value": CancellationReasons.DivorcedOrSeperated
      },
      { 
        "label": "Removed From Account but still Married",
        "value": CancellationReasons.RemovedFromAccountButMarried
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


  get spouseCancellationdocs(){

    return[
    { 
      "label": "Divorce Decree",
      "value": Documents.DivorceDecree
    },
    { 
      "label": "Seperation Agreement",
      "value": Documents.SeperationAgreement
    },
    { 
      "label": "Notarized Statement or affidavit",
      "value": Documents.NotrizedStatementOrAffidavit
    },
    { 
      "label": "Other (Dated or signed statement)",
      "value": Documents.Other
    }
  ]};

}
