import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { MspAccountApp, AccountChangeOptions } from '../../models/account.model';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { Router } from '@angular/router';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from 'app/models/relationship.enum';
import { BaseForm } from '../../models/base-form';
import { CancellationReasons } from '../../../../models/status-activities-documents';
import {ProcessService} from '../../../../services/process.service';

@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html',
  styleUrls: ['./spouse-info.component.scss']
})

export class SpouseInfoComponent extends BaseForm implements OnInit, AfterViewInit, OnDestroy {
  static ProcessStepNum = 1;
  accountApp: MspAccountApp;
  accountChangeOptions: AccountChangeOptions;
  showAddSpouse: boolean;
  showRemoveSpouse: boolean;
  showUpdateSpouse: boolean;
  subscriptions: Subscription[];

  constructor(public dataService: MspAccountMaintenanceDataService,
              protected router: Router,
              protected containerService: ContainerService,
              public _processService: ProcessService) {
    super(router, containerService, _processService);
    if (this.dataService.getMspAccountApp().hasSpouseAdded) {
      this.showAddSpouse = true;
    }
    if (this.dataService.getMspAccountApp().hasSpouseRemoved) {
      this.showRemoveSpouse = true;
    }
    if (this.dataService.getMspAccountApp().hasSpouseUpdated) {
      this.showUpdateSpouse = true;
    }
  }

  @ViewChild('formRef') form: NgForm;

  ngOnInit() {
    this.accountApp = this.dataService.accountApp;
    this.accountChangeOptions = this.dataService.accountApp.accountChangeOptions;
    //this.pageStateService.setPageIncomplete(this.router.url);
    this.initProcessMembers(SpouseInfoComponent.ProcessStepNum, this._processService);
    this._processService.setStep(SpouseInfoComponent.ProcessStepNum, false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(itm => itm.unsubscribe());
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
    this.accountApp.hasSpouseAdded = true;
    this.accountApp.hasSpouseUpdated = false;
    this.accountChangeOptions.dependentChange = true;
    this.showAddSpouse = true;
    this.showUpdateSpouse = false;
    return this.showAddSpouse;
  }

  removeSpouse() {
    this.accountApp.hasSpouseRemoved = true;
    this.accountApp.hasSpouseUpdated = false;
    this.accountChangeOptions.dependentChange = true;
    this.showRemoveSpouse = true;
    this.showUpdateSpouse = false;
    return this.showRemoveSpouse;
  }

  updateSpouse() {
    this.accountApp.hasSpouseAdded = false;
    this.accountApp.hasSpouseRemoved = false;
    this.accountApp.hasSpouseUpdated = true;
    this.showRemoveSpouse = false;
    this.showAddSpouse = false;
    this.showUpdateSpouse = true;
    return this.showUpdateSpouse;
  }

  removedAddedSpouse() {
    this.addedSpouse.documents = null;
    this.showAddSpouse = false;
    this.accountApp.hasSpouseAdded = false;
    this.accountChangeOptions.dependentChange = false;
    this.dataService.accountApp.addedSpouse = new MspPerson(Relationship.Spouse);
}

  removedDeletedSpouse() {
    this.removedSpouse.documents = null;
    this.showRemoveSpouse = false;
    this.accountApp.hasSpouseRemoved = false;
    this.accountChangeOptions.dependentChange = false;
    this.dataService.accountApp.removedSpouse = new MspPerson(Relationship.Spouse);
  }

  removedUpdatedSpouse() {
    this.updatedSpouse.documents = null;
    this.showUpdateSpouse = false;
    this.accountApp.hasSpouseUpdated = false;
    this.dataService.accountApp.updatedSpouse = new MspPerson(Relationship.Spouse);
  }

  get dateToday(): Date {
    return new Date();
  }

  get addedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().addedSpouse;
  }

  get removedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().removedSpouse;
  }

  get updatedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().updatedSpouse;
  }

  get showAddedSpouseBottomButtons(): boolean {
    return this.accountApp.addedSpouse.immigrationStatusChange !== undefined;
  }

  get phns(): string[] {
    return this.dataService.accountApp.allPersons
      .filter(x => x)
      .map(x => x.phn)
      .filter(x => x)
      .filter(x => x.length >= 10);
  }

  checkAdd() {
    let valid = true;

    // Don't bother checking if they aren't adding a spouse
    if (this.accountApp.hasSpouseAdded === true) {
      // Ticked "...active Medical Services Plan coverage?"
      valid = valid && this.isSet(this.addedSpouse.immigrationStatusChange)
        // Ticked gender radio
        && this.isSet(this.addedSpouse.gender)
        // Ticked "Has your spouse's name changed due to marriage?"
        && this.isSet(this.addedSpouse.updateNameDueToMarriage)

      // Ticked yes to name changed due to marriage
      if (this.addedSpouse.updateNameDueToMarriage === true) {
        // Check that they inputted a requested lastname and that they uploaded at least one supporting doc
        valid = valid && this.isSet(this.addedSpouse.updateNameDueToMarriageRequestedLastName)
          && typeof this.addedSpouse.updateNameDueToMarriageRequestedLastName === 'string'
          && this.addedSpouse.updateNameDueToMarriageRequestedLastName.length > 0
          && this.addedSpouse.updateNameDueToMarriageRequestedLastName.match(/\d+/g) === null
          && this.isSet(this.addedSpouse.updateNameDueToMarriageDocType.images)
          && this.addedSpouse.updateNameDueToMarriageDocType.images.length > 0;
      }

      // If they don't have existing coverage
      if (this.addedSpouse.immigrationStatusChange === false) {
        // All radio buttons visible at this point have been ticked, and one update doc has been uploaded
        valid = valid && this.isSet(this.addedSpouse.updateStatusInCanadaDocType)
          && this.isSet(this.addedSpouse.updateStatusInCanadaDocType.images)
          && this.addedSpouse.updateStatusInCanadaDocType.images.length > 0
          && this.isSet(this.addedSpouse.hasNameChange)
          && this.isSet(this.addedSpouse.livedInBCSinceBirth)
          // Disable continue if they are going to live in BC permanently
          && this.addedSpouse.madePermanentMoveToBC !== false
          && this.isSet(this.addedSpouse.madePermanentMoveToBC)
          // Disable continue if they are not going to live in BC permanently
          && this.addedSpouse.madePermanentMoveToBC === true
          && this.isSet(this.addedSpouse.declarationForOutsideOver30Days)
          && this.isSet(this.addedSpouse.declarationForOutsideOver60Days)
          && this.isSet(this.addedSpouse.hasBeenReleasedFromArmedForces)
        // Yes to name change "due to legal name change"
        if (this.addedSpouse.hasNameChange === true) {
          valid = valid && this.isSet(this.addedSpouse.nameChangeDocs)
            && this.isSet(this.addedSpouse.nameChangeDocs.images)
            && this.addedSpouse.nameChangeDocs.images.length > 0
            && this.isSet(this.addedSpouse.hasNameChangeAdditional);
          // Yes to an additional document
          if (this.addedSpouse.hasNameChangeAdditional === true) {
            valid = valid && this.isSet(this.addedSpouse.nameChangeAdditionalDocs)
              && this.isSet(this.addedSpouse.nameChangeAdditionalDocs.images)
              && this.addedSpouse.nameChangeAdditionalDocs.images.length > 0;
          }
        }

        // No to "lived in BC since birth"
        if (this.addedSpouse.livedInBCSinceBirth === false) {
          // Check they inputted the province or country they came from and the date
          valid = valid && this.isSet(this.addedSpouse.arrivalToBCDate)
            && this.isSet(this.addedSpouse.movedFromProvinceOrCountry)
            && typeof this.addedSpouse.movedFromProvinceOrCountry === 'string'
            && this.addedSpouse.movedFromProvinceOrCountry.length > 0
        }

        // Yes to "more than 30 days in the last 12 months"
        if (this.addedSpouse.declarationForOutsideOver30Days === true) {
          valid = valid && this.isSet(this.addedSpouse.departureDateDuring12MonthsDate)
            && this.isSet(this.addedSpouse.returnDateDuring12MonthsDate)
            && this.isSet(this.addedSpouse.departureReason12Months)
            && this.isSet(this.addedSpouse.departureDestination12Months)
        }

        // Yes to "more than 30 days in the next 6 months"
        if (this.addedSpouse.declarationForOutsideOver60Days === true) {
          valid = valid && this.isSet(this.addedSpouse.departureDateDuring6MonthsDate)
            && this.isSet(this.addedSpouse.returnDateDuring6MonthsDate)
            && this.isSet(this.addedSpouse.departureReason)
            && this.isSet(this.addedSpouse.departureDestination)
        }

        // Yes to "released from Canadian Armed Forces"
        if (this.addedSpouse.hasBeenReleasedFromArmedForces === true) {
          valid = valid && this.isSet(this.addedSpouse.dischargeDate)
            && this.isSet(this.addedSpouse.nameOfInstitute)
        }
      }
    }
    return valid;
  }

  checkRemove() {
    let valid = true;
    // Must choose a cancellation reason
    valid = valid && this.isSet(this.removedSpouse.cancellationReason)

    // If they are divorced/separated they must upload at least one document
    if (this.removedSpouse.cancellationReason === CancellationReasons.SeparatedDivorced) {
      valid = valid && this.isSet(this.removedSpouse.hasCurrentMailingAddress) && this.isSet(this.removedSpouse.cancellationDate);
      if (valid && this.removedSpouse.cancellationDate.getMonth() !== this.dateToday.getMonth()){
        valid = valid && this.removedSpouse.removedSpouseDueToDivorceDoc
        && this.removedSpouse.removedSpouseDueToDivorceDoc.images
        && this.removedSpouse.removedSpouseDueToDivorceDoc.images.length > 0;
      }
      valid = valid && this.removedSpouse.cancellationDate < this.dateToday
      && this.removedSpouse.cancellationDate >= this.removedSpouse.dateOfBirth;
    }

    // For these selections they must include a valid cancellation date
    if (this.removedSpouse.cancellationReason === CancellationReasons.ArmedForces
      || this.removedSpouse.cancellationReason === CancellationReasons.Deceased
      || this.removedSpouse.cancellationReason === CancellationReasons.Incarcerated
      || this.removedSpouse.cancellationReason === CancellationReasons.RemoveFromAccountButStillMarriedOrCommomLaw) {
      valid = valid && this.isSet(this.removedSpouse.cancellationDate)
        && this.removedSpouse.cancellationDate < this.dateToday
        && this.removedSpouse.cancellationDate >= this.removedSpouse.dateOfBirth;
    }

    // They cannot proceed if this is their option
    if (this.removedSpouse.cancellationReason === CancellationReasons.OutOfProvinceOrCountry){
      valid = false;
    }

    return valid;
  }

  checkUpdate() {
    let valid = true;

    // Each update type selected must have at least one document
    if (this.updatedSpouse.updateStatusInCanada === true) {
      valid = valid && this.isSet(this.updatedSpouse.updateStatusInCanadaDocType.images)
        && this.updatedSpouse.updateStatusInCanadaDocType.images.length > 0;
    }

    if (this.updatedSpouse.updateNameDueToMarriage === true) {
      valid = valid && this.isSet(this.updatedSpouse.updateNameDueToMarriageDocType.images)
        && this.updatedSpouse.updateNameDueToMarriageDocType.images.length > 0;
    }

    if (this.updatedSpouse.updateNameDueToNameChange === true) {
      valid = valid && this.isSet(this.updatedSpouse.updateNameDueToNameChangeDocType.images)
        && this.updatedSpouse.updateNameDueToNameChangeDocType.images.length > 0;
    }

    // gender "due to change" one as opposed to update
    if (this.updatedSpouse.updateGender === true) {
      valid = valid && this.isSet(this.updatedSpouse.updateGenderDocType.images)
        && this.updatedSpouse.updateGenderDocType.images.length > 0
        // "Need a second document" radio button is mandatory
        && this.isSet(this.updatedSpouse.updateGenderAdditionalDocs)
      // If "need a second document?" radio is clicked yes
      if (this.updatedSpouse.updateGenderAdditionalDocs === true) {
        valid = valid && this.isSet(this.updatedSpouse.updateGenderDocType2.images)
          && this.updatedSpouse.updateGenderDocType2.images.length > 0
        // "Need a third document" radio button mandatory
          && this.isSet(this.updatedSpouse.updateGenderAdditionalDocs2)
        // If "need a third document?" radio is clicked yes
        if (this.updatedSpouse.updateGenderAdditionalDocs2 === true) {
          valid = valid && this.isSet(this.updatedSpouse.updateGenderDocType3.images)
            && this.updatedSpouse.updateGenderDocType3.images.length > 0
        }
      }
    }

    if (this.updatedSpouse.updateNameDueToError === true) {
      valid = valid && this.isSet(this.updatedSpouse.updateNameDueToErrorDocType.images)
        && this.updatedSpouse.updateNameDueToErrorDocType.images.length > 0;
    }

    if (this.updatedSpouse.updateBirthdate === true) {
      valid = valid && this.isSet(this.updatedSpouse.updateBirthdateDocType.images)
        && this.updatedSpouse.updateBirthdateDocType.images.length > 0;
    }

    if (this.updatedSpouse.updateGenderDesignation === true) {
      valid = valid && this.isSet(this.updatedSpouse.updateGenderDesignationDocType.images)
        && this.updatedSpouse.updateGenderDesignationDocType.images.length > 0;
    }

    if (!this.updatedSpouse.updateGenderDesignation
      && !this.updatedSpouse.updateBirthdate
      && !this.updatedSpouse.updateNameDueToError
      && !this.updatedSpouse.updateGender
      && !this.updatedSpouse.updateNameDueToNameChange
      && !this.updatedSpouse.updateNameDueToMarriage
      && !this.updatedSpouse.updateStatusInCanada
    ) {
      // at least one update must be requested
      valid = false;
    }

    return valid;
  }

  canContinue(): boolean {
    let valid = super.canContinue();
    if (this.accountApp.hasSpouseAdded === true) {
      valid = valid && this.checkAdd();
    }
    if (this.accountApp.hasSpouseRemoved === true) {
      valid = valid && this.checkRemove();
    }
    if (this.accountApp.hasSpouseUpdated === true) {
      valid = valid && this.checkUpdate();
    }
    if (valid === false){
      this._processService.setStep(SpouseInfoComponent.ProcessStepNum, false);
    }
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this._processService.setStep(SpouseInfoComponent.ProcessStepNum, true);
    this.navigate('/deam/child-info');
  }
}
