import {ChangeDetectorRef, Component, Injectable , ViewChild, ViewChildren , QueryList } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../models/base.component';
import {ProcessService, ProcessUrls} from '../../../../services/process.service';
import {AccountPersonalDetailsComponent} from '../personal-info/personal-details/personal-details.component';
import { MspPerson } from '../../models/account.model';
import { Relationship } from '../../../../models/status-activities-documents';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../models/account.model';
import { legalStatus } from '../../../../models/msp.contants';
import {
  StatusRules,
  ActivitiesRules,
  StatusInCanada,
  Activities,
  DocumentRules,
  Documents
} from '../../../../models/status-activities-documents';

import { Gender } from '../../../../components/msp/model/msp-person.model';
import { Person } from 'moh-common-lib';



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

  get activities(): Activities[] {
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
