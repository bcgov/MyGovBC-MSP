import {ChangeDetectorRef, Component, OnInit, Injectable , ViewChild, ViewChildren , QueryList, Input } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../.././../../models/base.component';
import {AccountPersonalDetailsComponent} from '../../../components/personal-details/personal-details.component';
import { MspPerson } from '../../../models/account.model';
import { Relationship } from '../../../../../models/status-activities-documents';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';
//import { legalStatus } from '../../../../../models/msp.contants';
import {
  StatusRules,
  ActivitiesRules,
  StatusInCanada,
  Activities,
  DocumentRules,
  Documents
} from '../../../../../models/status-activities-documents';
import { MspBenefitDataService } from 'app/modules/benefit/services/msp-benefit-data.service';

@Component({
  selector: 'msp-update-spouse',
  templateUrl: './update-spouse.component.html',
  styleUrls: ['./update-spouse.component.scss']
})
export class UpdateSpouseComponent extends BaseComponent implements OnInit {
  
  @Input() spouse: MspPerson;
  @Input() accountApp: MspAccountApp;
  Activities: typeof Activities = Activities;
  //langActivities = require('../../../../../components/msp/common/activities/i18n');
  
  
  constructor(public dataService: MspAccountMaintenanceDataService, cd: ChangeDetectorRef) {

    super(cd);
  }

  ngOnInit() {
    this.accountApp = this.dataService.accountApp;
    //this.accountChangeOptions = this.dataService.accountApp.accountChangeOptions;
   
  }

  onChange($event){
    console.log($event);
    console.log(this.spouse);
    //this.dataService.saveMspAccountApp();
  }

  get accountUpdateList(): UpdateList[] {
        
    return [{
        "label": "Update status in Canada",
        "value": this.spouse.updateStatusInCanada
      },
      {
        "label": "Update name - due to marriage or other",
        "value": this.spouse.updateNameDueToMarriage
      },
      {
        "label": "Correct name - due to error",
        "value": this.spouse.updateNameDueToError
      },
      {
        "label": "Correct birthdate",
        "value": this.spouse.updateBirthdate
      },
      {
        "label": "Correct gender",
        "value": this.spouse.updateGender
      },
      {
        "label": "Change gender designation",
        "value": this.spouse.updateGenderDesignation
      }

    ];}

    get activities(): Activities[] {
      return ActivitiesRules.activitiesForAccountChange(
          this.spouse.relationship,
          this.spouse.status
      );
  }


  get activitiesTable() {
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
  }

  activityStatus  =  {
    0: 'Not new to B.C. but need to apply for MSP',
    1: 'Moved to B.C. from another province',
    2: 'Moved to B.C. from another country',
    3: 'Working in B.C.',
    4: 'Studying in B.C.',
    5: 'Religious worker',
    6: 'Diplomat',
    7: 'Visiting'
  };


  get items()   {
        return[
        { 
          "label": "Canadian birth certificate",
          "value": Documents.CanadianBirthCertificate
        },
        { 
          "label": "Canadian Passport",
          "value": Documents.CanadianPassport
        },
        { 
          "label": "Canadian citizenship card or certificate",
          "value": Documents.CanadianCitizenCard
        }
    ]};

}
