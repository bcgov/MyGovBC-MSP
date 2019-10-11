import {ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import {BaseComponent} from '../../.././../../models/base.component';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspAccountApp, UpdateList } from '../../../models/account.model';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';

@Component({
  selector: 'msp-update-spouse',
  templateUrl: './update-spouse.component.html',
  styleUrls: ['./update-spouse.component.scss']
})
export class UpdateSpouseComponent extends BaseComponent implements OnInit {
  
  @Input() spouse: MspPerson;
  @Input() accountApp: MspAccountApp;
  //langActivities = require('../../../../../components/msp/common/activities/i18n');
  
  
  constructor(public dataService: MspAccountMaintenanceDataService, cd: ChangeDetectorRef) {

    super(cd);
  }

  ngOnInit() {
   // this.spouse = this.dataService.accountApp.spouse;
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

   /* get activities(): Activities[] {
      return ActivitiesRules.activitiesForAccountChange(
          this.spouse.relationship,
          this.spouse.status
      );*/
  }


  /*get activitiesTable() {
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
 
