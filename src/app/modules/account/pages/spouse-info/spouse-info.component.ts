import {Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { MspAccountApp, AccountChangeOptions } from '../../models/account.model';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { AbstractForm } from 'moh-common-lib';
import { Router } from '@angular/router';
import { PageStateService } from 'app/services/page-state.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from 'app/models/relationship.enum';



@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html',
  styleUrls: ['./spouse-info.component.scss']
})
export class SpouseInfoComponent extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

  accountApp: MspAccountApp;
  accountChangeOptions: AccountChangeOptions;
  addNewSpouse: boolean;
  showSpouse: boolean;
  showUpdateSpouse: boolean;
  subscriptions: Subscription[];

  constructor( public dataService: MspAccountMaintenanceDataService, protected router: Router,  private pageStateService: PageStateService ) {
    super(router);
    if (this.dataService.getMspAccountApp().hasSpouseAdded) {
      this.addNewSpouse = true;
    } else if (this.dataService.getMspAccountApp().hasSpouseRemoved) {
      this.showSpouse = true;
    } else if ( this.dataService.getMspAccountApp().hasSpouseUpdated) {
      this.showUpdateSpouse = true;
    }
  }

  @ViewChild('formRef') form: NgForm;

  ngOnInit() {
      this.accountApp = this.dataService.accountApp;
      this.accountChangeOptions = this.dataService.accountApp.accountChangeOptions;
      this.pageStateService.setPageIncomplete(this.router.url, this.dataService.accountApp.pageStatus);
  }

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }

  ngAfterViewInit() {
    if (this.form) {
      this.subscriptions = [
        this.form.valueChanges.pipe(
          debounceTime(100)
        ).subscribe(() => {
          this.dataService.saveMspAccountApp();
        })
        ];
    }
  }

addSpouse() {

    this.addNewSpouse = true;
    this.accountApp.hasSpouseAdded = true;
    this.accountChangeOptions.dependentChange = true;
    this.showUpdateSpouse = false;
    this.showSpouse = false;
  //  this.dataService.saveMspAccountApp();
    return this.addNewSpouse;

  }

  removeSpouse() {
    this.showSpouse = true;
    this.accountApp.hasSpouseRemoved = true;
    this.accountChangeOptions.dependentChange = true;
    this.showUpdateSpouse = false;
    this.addNewSpouse = false;

    //this.dataService.saveMspAccountApp();
    return this.showSpouse;

  }

  updateSpouse() {
    this.showUpdateSpouse = true;
    this.accountApp.hasSpouseUpdated = true;

    this.showSpouse = false;
    this.addNewSpouse = false;

    //this.dataService.saveMspAccountApp();
    return this.showUpdateSpouse;
  }

  removedAddedSpouse() {

    this.addNewSpouse = false;
    this.accountApp.hasSpouseAdded = false; 
    this.accountChangeOptions.dependentChange = false;
    this.dataService.accountApp.addedSpouse = new MspPerson(Relationship.Spouse);
}

  removedDeletedSpouse() {
    this.showSpouse = false;
    this.accountApp.hasSpouseRemoved = false;
    this.accountChangeOptions.dependentChange = false;
    this.dataService.accountApp.removedSpouse = new MspPerson(Relationship.Spouse);
  }

  removedUpdatedSpouse() {

    this.showUpdateSpouse = false;
    this.accountApp.hasSpouseUpdated = false; 
    this.dataService.accountApp.updatedSpouse = new MspPerson(Relationship.Spouse);
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

 /* get activities(): CanadianStatusReason[] {
    return ActivitiesRules.activitiesForAccountChange(
        this.removedSpouse.relationship,
        this.removedSpouse.status
    );
  }*/

  get removedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().removedSpouse;
  }

  get addedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().addedSpouse;
  }

  get updatedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().updatedSpouse;
  }

  canContinue(): boolean {
    const valid = super.canContinue();

   /* if ( this.person.hasNameChange ) {
      valid = valid && this.hasNameDocuments;
    }

    if ( this.applicant.fullTimeStudent ) {
      valid = valid && this.applicant.inBCafterStudies;
    }*/
    return valid;
  }



 continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this.pageStateService.setPageComplete(this.router.url, this.dataService.accountApp.pageStatus);
    this.navigate('/deam/child-info');
  }
}
