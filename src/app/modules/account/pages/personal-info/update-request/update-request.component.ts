import {ChangeDetectorRef, EventEmitter, Output, Component, Injectable , ViewChild, ViewChildren , QueryList, Input } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../../models/base.component';
import {ProcessService, ProcessUrls} from '../../../../../services/process.service';
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
  Documents
} from '../../../../../models/status-activities-documents';

@Component({
  selector: 'msp-update-request',
  templateUrl: './update-request.component.html',
  styleUrls: ['./update-request.component.scss']
})
export class UpdateRequestComponent  {

  @Input() person: MspPerson;
 // @Input() activitiesTable: any[];
  @Input() items: string[];
  @Input() langStatus: string[];
  @Input() accountApp: MspAccountApp;
  @Input() label: string = 'Update';
  @Input() title: string;
  @Input() subtitle: string;
  @Input() status: boolean;
  @Input() updateList: UpdateList[];
  @Output() statusChange: EventEmitter<boolean>; //  = new EventEmitter<boolean>();
  mspAccountApp: MspAccountApp;
  statusValue: number;





 //  = legalStatus;



  constructor(private dataService: MspAccountMaintenanceDataService) { 
    this.mspAccountApp = dataService.getMspAccountApp();
    this.person = this.dataService.getMspAccountApp().applicant ;
  }

  ngOnInit() {
  }

  setStatus(evt: any) {
    //console.log(this.statusValue);
    console.log(evt);
    //this.statusValue = evt ;
    this.person.status = evt ; //this.statusValue;

    // if the status is temporary work permit, show the activity table
    if(this.person.status === StatusInCanada.TemporaryResident) {
      console.log("working");
    }
    
    this.person.currentActivity = null;

    if ( this.person.status !== StatusInCanada.CitizenAdult) {
      this.person.institutionWorkHistory = 'No';
    }
    this.dataService.saveMspAccountApp();

  }

  checkStatus(evt : boolean) {
    console.log(evt);
    console.log(this.person.updateStatusInCanada);
    this.dataService.saveMspAccountApp();
    //this.statusChange.emit(evt);

  }

  get activities(): Activities[] {
    console.log( this.person.relationship);
    console.log( this.person.status);
    return ActivitiesRules.activitiesForAccountChange(
        this.person.relationship,
        this.person.status
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

get permanentResidentDocs(): string[] {
  return [
    'Confirmation Of Permanent Residence',
    'Permanent Resident Card (front and back)',
    'Record Of Landing'
  ]
}

get workPermitDocs(): string[] {
  return [
    'Work Permit',
   'Study Permit' ,
    'Acceptance to work in Canada',
    'Acceptance foil from your Diplomatic Passport',
    'Notice of Decision',
    'Permit indicating Religious Worker'
  ]

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

}

 /**
 * Various statuses in Canada
 */
enum canadaStatus {
  CitizenAdult, // adult
  PermanentResident,
  TemporaryResident
  
}
