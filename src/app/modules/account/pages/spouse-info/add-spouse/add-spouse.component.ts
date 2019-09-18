import { Component, OnInit, Input } from '@angular/core';
import { AccountChangeOptions, MspPerson, MspAccountApp, UpdateList } from 'app/modules/account/models/account.model';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import {
  StatusRules,
  ActivitiesRules,
  StatusInCanada,
  Activities,
  DocumentRules,
  Documents
} from '../../../../../models/status-activities-documents';
@Component({
  selector: 'msp-add-spouse',
  templateUrl: './add-spouse.component.html',
  styleUrls: ['./add-spouse.component.scss']
})
export class AddSpouseComponent implements OnInit {

  @Input() accountChangeOptions: AccountChangeOptions;
  @Input() spouse: MspPerson;
  @Input() accountApp: MspAccountApp;

  constructor( public dataService: MspAccountMaintenanceDataService) { }

  ngOnInit() {
  }

  onChange($event){
    console.log($event);
    console.log(this.spouse);
    this.dataService.saveMspAccountApp();
  }

  get items()   {

    return[
      { 
        "label": "Marriage certificate",
        "value": Documents.MarriageCertificate
      },
      { 
        "label": "Legal Name Change Certificate",
        "value": Documents.ChangeOfNameCertificate
      }
    ]
  };

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

  get activities(): Activities[] {
    return ActivitiesRules.activitiesForAccountChange(
        this.spouse.relationship,
        this.spouse.status
    );
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

    ]

}

}
