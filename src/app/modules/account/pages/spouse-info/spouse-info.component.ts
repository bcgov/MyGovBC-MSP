import {Component } from '@angular/core';
import { MspAccountApp, AccountChangeOptions, MspPerson } from '../../models/account.model';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { Activities } from 'app/models/status-activities-documents';
import { ActivitiesRules } from 'app/modules/msp-core/models/status-activities-documents';
import { CanadianStatusReason } from 'app/modules/msp-core/models/canadian-status.enum';




@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html',
  styleUrls: ['./spouse-info.component.scss']
})
export class SpouseInfoComponent {

  accountApp: MspAccountApp;
  accountChangeOptions: AccountChangeOptions;
  
  constructor( public dataService: MspAccountMaintenanceDataService ) { }
  addNewSpouse: boolean = false;
  showSpouse: boolean = false;
  showUpdateSpouse: boolean = false;
  
  ngOnInit() {
      this.accountApp = this.dataService.accountApp;
      this.accountChangeOptions = this.dataService.accountApp.accountChangeOptions;
  }

  addSpouse() {
    
    this.addNewSpouse = true;
    this.accountApp.hasSpouseAdded = true;

    this.showUpdateSpouse = false;
    this.showSpouse = false;
    this.dataService.saveMspAccountApp();
    return this.addNewSpouse;

  }

  removeSpouse() {
    this.showSpouse = true;
    this.accountApp.hasSpouseRemoved = true;

    this.showUpdateSpouse = false;
    this.addNewSpouse = false;

    this.dataService.saveMspAccountApp();
    return this.showSpouse;

  }

  updateSpouse() {
    this.showUpdateSpouse = true;
    this.accountApp.hasSpouseUpdated = true;
 
    this.showSpouse = false;
    this.addNewSpouse = false;

    this.dataService.saveMspAccountApp();
    return this.showUpdateSpouse;
  }


 /* get activitiesTable() {
    if (!this.activities) return;
    return this.activities.map(itm => {
      const label = this.langActivities('./en/index.js')[itm];
      return {
      label,
      value: itm
      };
    });
  }*/

  get activities(): CanadianStatusReason[] {
    return ActivitiesRules.activitiesForAccountChange(
        this.removedSpouse.relationship,
        this.removedSpouse.status
    );
  }

  get removedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().removedSpouse;
  }
  
  get addedSpouse(): MspPerson {
   
    return this.dataService.getMspAccountApp().addedSpouse;
  }

  get updatedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().updatedSpouse;
  }

  
}
