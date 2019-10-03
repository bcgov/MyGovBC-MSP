import { Component, OnInit, Input } from '@angular/core';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';





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
        // tslint:disable-next-line: quotemark
        "label": "Update status in Canada",
        'value': this.child.updateStatusInCanada
      },
      {
        'label': 'Update name - due to marriage or other',
        'value': this.child.updateNameDueToMarriage
      },
      {
        'label': 'Correct name - due to error',
        'value': this.child.updateNameDueToError
      },
      {
        'label': 'Correct birthdate',
        'value': this.child.updateBirthdate
      },
      {
        'label': 'Correct gender',
        'value': this.child.updateGender
      },
      {
        'label': 'Change gender designation',
        'value': this.child.updateGenderDesignation
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
