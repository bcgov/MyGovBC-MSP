import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
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
    this.subscriptions.forEach( itm => itm.unsubscribe());
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
    this.accountApp.hasSpouseRemoved = false;
    this.accountApp.hasSpouseUpdated = false;
    this.accountChangeOptions.dependentChange = true;
    this.showUpdateSpouse = false;
    this.showSpouse = false;
  //this.dataService.saveMspAccountApp();
    return this.addNewSpouse;
  }

  removeSpouse() {
    this.showSpouse = true;
    this.accountApp.hasSpouseRemoved = true;
    this.accountApp.hasSpouseAdded = false;
    this.accountApp.hasSpouseUpdated = false;
    this.accountChangeOptions.dependentChange = true;
    this.showUpdateSpouse = false;
    this.addNewSpouse = false;
    //this.dataService.saveMspAccountApp();
    return this.showSpouse;
  }

  updateSpouse() {
    this.showUpdateSpouse = true;
    this.accountApp.hasSpouseUpdated = true;
    this.accountApp.hasSpouseAdded = false;
    this.accountApp.hasSpouseRemoved = false;
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

  get removedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().removedSpouse;
  }

  get addedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().addedSpouse;
  }

  get updatedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().updatedSpouse;
  }

  checkDocumentsForUpdatedSpouse(){
    let valid = true;
    if (this.updatedSpouse.updateStatusInCanada  === true){
      valid = valid && this.updatedSpouse.updateStatusInCanadaDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateNameDueToMarriage === true){
      valid = valid && this.updatedSpouse.updateNameDueToMarriageDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateNameDueToNameChange === true){
      valid = valid && this.updatedSpouse.updateNameDueToNameChangeDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateGender === true){
      valid = valid && this.updatedSpouse.updateGenderDocType.images.length > 0 && this.updatedSpouse.updateGenderDocType2.images.length > 0;
      if (this.updatedSpouse.updateGenderAdditionalDocs === true){
        valid = valid && this.updatedSpouse.updateGenderDocType3.images.length > 0;
      }
    }
    if (this.updatedSpouse.updateNameDueToError === true){
      valid = valid && this.updatedSpouse.updateNameDueToErrorDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateBirthdate === true){
      valid = valid && this.updatedSpouse.updateBirthdateDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateGenderDesignation === true){
      valid = valid && this.updatedSpouse.updateGenderDesignationDocType.images.length > 0;
    }
    return valid;
  }

  canContinue(): boolean {
    let valid = super.canContinue();
    if (this.accountApp.hasSpouseUpdated === true){
      valid = valid && this.checkDocumentsForUpdatedSpouse();
    }
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
