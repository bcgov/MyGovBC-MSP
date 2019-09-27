import { Component, OnInit, Input, AfterViewInit, OnDestroy, ChangeDetectorRef, Injectable , ViewChild, ViewChildren , QueryList } from '@angular/core';
import { nameChangeSupportDocuments } from '../../../../msp-core/components/support-documents/support-documents.component';
import { AbstractForm } from 'moh-common-lib';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../../models/base.component';
import {ProcessService, ProcessUrls} from '../../../../../services/process.service';
//import { AccountPersonalDetailsComponent}  from './personal-details/personal-details.component';
import { MspPerson } from '../../../models/account.model';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';
import { PersonDocuments } from '../../../../../components/msp/model/person-document.model';

import {
  
  ActivitiesRules,
 
} from '../../../../../models/status-activities-documents';

import {
  Gender
} from '../../../../../components/msp/model/msp-person.model';
import { Person } from 'moh-common-lib';
import { SupportDocuments } from 'app/modules/msp-core/models/support-documents.enum';



@Component({
  selector: 'msp-update-child',
  templateUrl: './update-child.component.html',
  styleUrls: ['./update-child.component.scss']
})
export class UpdateChildComponent implements OnInit {

  constructor( public dataService: MspAccountMaintenanceDataService) { }

  @Input() accountChangeOptions: AccountChangeOptions;
  @Input() child: MspPerson ;
  @Input() accountApp: MspAccountApp;
  @Input() index: number;

  ngOnInit() {
  }


  get accountUpdateList(): UpdateList[] {
        
    return [{
        "label": "Update status in Canada",
        "value": this.child.updateStatusInCanada
      },
      {
        "label": "Update name - due to marriage or other",
        "value": this.child.updateNameDueToMarriage
      },
      {
        "label": "Correct name - due to error",
        "value": this.child.updateNameDueToError
      },
      {
        "label": "Correct birthdate",
        "value": this.child.updateBirthdate
      },
      {
        "label": "Correct gender",
        "value": this.child.updateGender
      },
      {
        "label": "Change gender designation",
        "value": this.child.updateGenderDesignation
      }

    ];
  }

 /* get activitiesTable() {
    console.log(this.activities);
    if (!this.activities) return;
    return this.activities.map(itm => {
      const label = this.activityStatus[itm];
      console.log(itm);
      console.log(label);
      return {
      label,
      value: itm
      };
    });
  }*/

}
