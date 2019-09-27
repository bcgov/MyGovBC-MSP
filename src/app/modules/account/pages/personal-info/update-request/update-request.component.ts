import {EventEmitter, Output, Component, Input } from '@angular/core';
import { MspPerson } from '../../../models/account.model';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
/*import { MspAccountApp, AccountChangeOptions, UpdateList, ItemList } from '../../../models/account.model';
import {
  StatusRules,
  ActivitiesRules,
  StatusInCanada,
  Activities,
  DocumentRules,
  Documents
} from '../../../../../models/status-activities-documents';*/

import { MspAccountApp, UpdateList } from '../../../models/account.model';
import { ActivitiesRules } from '../../../../../models/status-activities-documents';
import { StatusInCanada, CanadianStatusReason, CanadianStatusRules } from '../../../../msp-core/models/canadian-status.enum';


@Component({
  selector: 'msp-update-request',
  templateUrl: './update-request.component.html',
  styleUrls: ['./update-request.component.scss']
})
export class UpdateRequestComponent  {

  @Input() person: MspPerson;
  @Input() activitiesTable: any[];
 // @Input() items: string[];
 /*
  @Input() langStatus: ItemList[] = [{
       "label": "Canadian Citizen",
       "value": StatusInCanada.CitizenAdult
      },
      {
        "label": "Permanent Resident",
        "value": StatusInCanada.PermanentResident
      },
      {
        "label": "Temporary Permit Holder or Diplomat",
        "value": StatusInCanada.TemporaryResident
      }];*/

  @Input() accountApp: MspAccountApp;
  @Input() label: string = 'Update';
  @Input() title: string;
  @Input() subtitle: string;
  @Input() status: boolean;
  @Input() updateList: UpdateList[] ; /* = [
      {
        "label": "Update status in Canada",
        "value": this.person.updateStatusInCanada
      },
      {
        "label": "Update name - due to marriage or other",
        "value": this.person.updateNameDueToMarriage
      },
      {
        "label": "Correct name - due to error",
        "value": this.person.updateNameDueToError
      },
      {
        "label": "Correct birthdate",
        "value": this.person.updateBirthdate
      },
      {
        "label": "Correct gender",
        "value": this.person.updateGender
      },
      {
        "label": "Change gender designation",
        "value": this.person.updateGenderDesignation
      }];*/

  //itemList: ItemList[];
  @Output() statusChange: EventEmitter<boolean>; //  = new EventEmitter<boolean>();
  mspAccountApp: MspAccountApp;
  //statusValue: number;
 //  = legalStatus;
  constructor(private dataService: MspAccountMaintenanceDataService) { 
    this.mspAccountApp = dataService.getMspAccountApp();
    this.person = this.dataService.getMspAccountApp().applicant ;

  }

  ngOnInit() {
    if (this.person.status >= 0 &&  this.person.status !== undefined) {
      //this.itemList = this.item(this.person.status);
    }
  }

  setStatus(evt: any) {
    console.log(evt);
    //this.statusValue = evt ;
    this.person.status = evt ; //this.statusValue;
    this.person.currentActivity = null;
    //this.itemList = this.item(evt);
    //console.log(this.itemList);
    if ( this.person.status !== StatusInCanada.CitizenAdult) {
      this.person.institutionWorkHistory = 'No';
    }

    this.dataService.saveMspAccountApp();

  }

  selectDocStatus(evt: any) {
    //this.person.updateNameDueToMarriageDocType = evt;
   // this.accountApp.documents = evt;
    this.dataService.saveMspAccountApp();
  }

  uploadDocument(evt: Array<any>) {
    console.log(evt);
    this.person.updateNameDueDoc = evt;
    this.dataService.saveMspAccountApp();
  }

  checkStatus(evt : boolean) {
    console.log(evt);
    console.log(this.person.updateStatusInCanada);
    this.dataService.saveMspAccountApp();
    //this.statusChange.emit(evt);

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
  }

  get activities(): Activities[] {
    console.log( this.person.relationship);
    console.log( this.person.status);
    // todo review correctness, had to modify after merge.
    return CanadianStatusRules.statusesForRelationship(
        this.person.relationship,
        this.person.status
    );
  }*/



  // get activities(): CanadianStatusReason[] {
  //   console.log( this.person.relationship);
  //   console.log( this.person.status);
  //   return ActivitiesRules.availableActivities(
  //       this.person.relationship,
  //       this.person.status
  //   );
  // }

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
}

 /**
 * Various statuses in Canada
 */
enum canadaStatus {
  CitizenAdult, // adult
  PermanentResident,
  TemporaryResident
  
}

