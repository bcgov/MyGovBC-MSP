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

@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html',
  styleUrls: ['./spouse-info.component.scss']
})

export class SpouseInfoComponent extends BaseForm implements OnInit, AfterViewInit, OnDestroy {

  accountApp: MspAccountApp;
  accountChangeOptions: AccountChangeOptions;
  showAddSpouse: boolean;
  showRemoveSpouse: boolean;
  showUpdateSpouse: boolean;
  subscriptions: Subscription[];

  constructor(public dataService: MspAccountMaintenanceDataService,
              protected router: Router,
              protected containerService: ContainerService,
              protected pageStateService: PageStateService) {
    super(router, containerService, pageStateService);
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
    this.pageStateService.setPageIncomplete(this.router.url);
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
    if (this.accountApp.hasSpouseAdded === true) {
      // Checking radio buttons have been ticked
      valid = valid && this.addedSpouse.immigrationStatusChange !== undefined
        && this.addedSpouse.immigrationStatusChange !== null
        && this.addedSpouse.gender !== undefined
        && this.addedSpouse.gender !== null
        && this.addedSpouse.updateNameDueToMarriage !== undefined
        && this.addedSpouse.updateNameDueToMarriage !== null;

        console.log('beginning passes:', valid);

      if (this.addedSpouse.updateStatusInCanada === true) {
        // Check that they have at least one document to support the status change
        valid = valid && this.addedSpouse.updateStatusInCanadaDocType !== undefined
          && this.addedSpouse.updateStatusInCanadaDocType !== null
          && this.addedSpouse.updateStatusInCanadaDocType.images !== undefined
          && this.addedSpouse.updateStatusInCanadaDocType.images !== null
          && this.addedSpouse.updateStatusInCanadaDocType.images.length > 0;
      }

      console.log(
        'updateStatus passes',
        valid,
        this.addedSpouse.updateStatusInCanadaDocType !== null,
        this.addedSpouse.updateStatusInCanadaDocType.images !== undefined,
        this.addedSpouse.updateStatusInCanadaDocType.images !== null
      );

      if (this.addedSpouse.updateNameDueToMarriage === true) {
        // Check that they inputted a requested lastname and that they uploaded at least one supporting doc
        valid = valid && this.addedSpouse.updateNameDueToMarriageRequestedLastName !== undefined
          && this.addedSpouse.updateNameDueToMarriageRequestedLastName !== null
          && typeof this.addedSpouse.updateNameDueToMarriageRequestedLastName === 'string'
          && this.addedSpouse.updateNameDueToMarriageRequestedLastName.length > 0
          && this.addedSpouse.updateNameDueToMarriageRequestedLastName.match(/\d+/g) === null
          && this.addedSpouse.updateNameDueToMarriageDocType.images !== undefined
          && this.addedSpouse.updateNameDueToMarriageDocType.images !== null
          && this.addedSpouse.updateNameDueToMarriageDocType.images.length > 0;
      }

      console.log('updateName passes:', valid, this.addedSpouse.updateNameDueToMarriageRequestedLastName !== undefined,
        this.addedSpouse.updateNameDueToMarriageRequestedLastName !== null,
        typeof this.addedSpouse.updateNameDueToMarriageRequestedLastName === 'string',
        typeof this.addedSpouse.updateNameDueToMarriageRequestedLastName === 'string' && this.addedSpouse.updateNameDueToMarriageRequestedLastName.length > 0,
        this.addedSpouse.updateNameDueToMarriageDocType.images !== undefined,
        this.addedSpouse.updateNameDueToMarriageDocType.images !== null,
        this.addedSpouse.updateNameDueToMarriageDocType.images && this.addedSpouse.updateNameDueToMarriageDocType.images.length > 0
      );

      if (this.addedSpouse.immigrationStatusChange === true) {
        valid = valid && this.addedSpouse.livedInBCSinceBirth !== undefined
        && this.addedSpouse.livedInBCSinceBirth !== null;

        if (this.addedSpouse.livedInBCSinceBirth === false) {
          // Check they inputted the province or country they came from
          valid = valid && this.addedSpouse.movedFromProvinceOrCountry !== undefined
          && this.addedSpouse.movedFromProvinceOrCountry !== null
            && this.addedSpouse.movedFromProvinceOrCountry.length > 0
            && this.addedSpouse.arrivalToBCDate !== undefined
            && this.addedSpouse.arrivalToBCDate !== null;
        }

        console.log('inBC passes:', valid, this.addedSpouse.movedFromProvinceOrCountry !== undefined,
          this.addedSpouse.movedFromProvinceOrCountry !== null,
          typeof this.addedSpouse.movedFromProvinceOrCountry === 'string',
          typeof this.addedSpouse.movedFromProvinceOrCountry === 'string' && this.addedSpouse.movedFromProvinceOrCountry.length > 0,
          this.addedSpouse.arrivalToBCDate !== undefined,
          this.addedSpouse.arrivalToBCDate !== null
        );

        valid = valid && this.addedSpouse.madePermanentMoveToBC !== undefined
          && this.addedSpouse.madePermanentMoveToBC !== null;

        valid = valid && this.addedSpouse.declarationForOutsideOver30Days !== undefined
          && this.addedSpouse.declarationForOutsideOver30Days !== null;
        console.log('Y/N declarations passes:', valid);

        if (this.addedSpouse.declarationForOutsideOver30Days === true) {
          valid = valid && this.addedSpouse.departureDateDuring12MonthsDate !== undefined
            && this.addedSpouse.departureDateDuring12MonthsDate !== null;
          valid = valid && this.addedSpouse.returnDateDuring12MonthsDate !== undefined
            && this.addedSpouse.returnDateDuring12MonthsDate !== null;
          valid = valid && this.addedSpouse.departureReason12Months !== undefined
            && this.addedSpouse.departureReason12Months !== null;
          valid = valid && this.addedSpouse.departureDestination12Months !== undefined
            && this.addedSpouse.departureDestination12Months !== null;
        }
        console.log('over30passes:', valid);

        valid = valid && this.addedSpouse.declarationForOutsideOver60Days !== undefined
          && this.addedSpouse.declarationForOutsideOver60Days !== null;
        if (this.addedSpouse.declarationForOutsideOver60Days === true) {
          valid = valid && this.addedSpouse.departureDateDuring6MonthsDate !== undefined
            && this.addedSpouse.departureDateDuring6MonthsDate !== null;
          valid = valid && this.addedSpouse.returnDateDuring6MonthsDate !== undefined
            && this.addedSpouse.returnDateDuring6MonthsDate !== null;
          valid = valid && this.addedSpouse.departureReason !== undefined
            && this.addedSpouse.departureReason !== null;
          valid = valid && this.addedSpouse.departureDestination !== undefined
            && this.addedSpouse.departureDestination !== null;
        }
        console.log('over60passes:', valid);

        valid = valid && this.addedSpouse.hasBeenReleasedFromArmedForces !== undefined
        && this.addedSpouse.hasBeenReleasedFromArmedForces !== null;
        if (this.addedSpouse.hasBeenReleasedFromArmedForces === true) {
          valid = valid && this.addedSpouse.dischargeDate !== undefined
            && this.addedSpouse.dischargeDate !== null;
          valid = valid && this.addedSpouse.nameOfInstitute !== undefined
            && this.addedSpouse.nameOfInstitute !== null;
        }
        console.log('armedforces passes:', valid);
      }
    }
    return valid;
  }

  checkRemove() {
    let valid = true;
    valid = valid && this.removedSpouse.cancellationReason !== undefined;
    if (this.removedSpouse.cancellationReason === CancellationReasons.SeparatedDivorced) {
      valid = valid && this.removedSpouse.hasCurrentMailingAddress !== undefined
        && this.removedSpouse.removedSpouseDueToDivorceDoc.images
        && this.removedSpouse.removedSpouseDueToDivorceDoc.images.length > 0;
    }
    if (this.removedSpouse.cancellationReason !== undefined
      && this.removedSpouse.cancellationReason !== CancellationReasons.OutOfProvinceOrCountry) {
      valid = valid && this.removedSpouse.cancellationDate !== undefined
        && this.removedSpouse.cancellationDate !== null;
    }
    if (this.removedSpouse.cancellationReason === CancellationReasons.OutOfProvinceOrCountry){
      valid = false;
    }
    if (this.removedSpouse.cancellationDate) {
      const currentDate = new Date();
      valid = valid && this.removedSpouse.cancellationDate <= currentDate && this.removedSpouse.cancellationDate >= this.removedSpouse.dateOfBirth;
    }
    return valid;
  }

  checkUpdate() {
    let valid = true;
    if (this.updatedSpouse.updateStatusInCanada === true) {
      valid = valid && this.updatedSpouse.updateStatusInCanadaDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateNameDueToMarriage === true) {
      valid = valid && this.updatedSpouse.updateNameDueToMarriageDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateNameDueToNameChange === true) {
      valid = valid && this.updatedSpouse.updateNameDueToNameChangeDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateGender === true) {
      valid = valid && this.updatedSpouse.updateGenderDocType.images.length > 0
        && this.updatedSpouse.updateGenderDocType2.images.length > 0;
      if (this.updatedSpouse.updateGenderAdditionalDocs === true) {
        valid = valid && this.updatedSpouse.updateGenderDocType3.images.length > 0;
      }
    }
    if (this.updatedSpouse.updateNameDueToError === true) {
      valid = valid && this.updatedSpouse.updateNameDueToErrorDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateBirthdate === true) {
      valid = valid && this.updatedSpouse.updateBirthdateDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateGenderDesignation === true) {
      valid = valid && this.updatedSpouse.updateGenderDesignationDocType.images.length > 0;
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
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this.navigate('/deam/child-info');
  }
}
