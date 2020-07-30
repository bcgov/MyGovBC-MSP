import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { OperationActionType, MspPerson } from '../../../../components/msp/model/msp-person.model';
import { scrollTo, ContainerService, PageStateService } from 'moh-common-lib';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Relationship } from 'app/models/relationship.enum';
import { StatusInCanada } from 'app/modules/msp-core/models/canadian-status.enum';
import { SupportDocumentTypes } from 'app/modules/msp-core/models/support-documents.enum';
import { BaseForm } from '../../models/base-form';
import { CancellationReasons } from '../../../../models/status-activities-documents';
import {ProcessService} from '../../../../services/process.service';

const DOM_REFRESH_TIMEOUT = 50;

@Component({
  selector: 'msp-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.scss']
})

export class ChildInfoComponent extends BaseForm implements OnInit, AfterViewInit, OnDestroy {
 // children: MspPerson[];
  static ProcessStepNum = 2;

  constructor(public dataService: MspAccountMaintenanceDataService,
              protected router: Router,
              protected containerService: ContainerService,
              protected pageStateService: PageStateService,
              protected _processService: ProcessService) {
    super(router, containerService, pageStateService, _processService);
  }
  subscriptions: Subscription[];
  @ViewChild('formRef') form: NgForm;

  showChild: boolean = false;
  operation: OperationActionType;

  child: MspPerson ;
  showRemoveChild: boolean = false;
  showUpdateChild: boolean = false;
  canadianCitizenDocList: SupportDocumentTypes[] = [
    SupportDocumentTypes.CanadianCitizenCard,
    SupportDocumentTypes.PermanentResidentCard,
    SupportDocumentTypes.PermanentResidentConfirmation
  ];
  permanentResidentDocList: SupportDocumentTypes[] = [
    SupportDocumentTypes.PermanentResidentConfirmation,
    SupportDocumentTypes.RecordOfLanding,
    SupportDocumentTypes.PermanentResidentCard
  ];

  ngOnInit() {
    this.pageStateService.setPageIncomplete(this.router.url);
    //this.children = this.dataService.accountApp.children;
    if (this.dataService.accountApp.addedChildren.length > 0) {
        this.showChild = true;
    } else if (this.dataService.accountApp.removedChildren.length > 0) {
        this.showRemoveChild = true;
    } else if (this.dataService.accountApp.updatedChildren.length > 0) {
        this.showUpdateChild = true;
    }
    this.initProcessMembers(ChildInfoComponent.ProcessStepNum, this._processService);
    this._processService.setStep(ChildInfoComponent.ProcessStepNum, false);
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

  addChildBtnClick(): void {
    this.showChild = true;
    this.showRemoveChild = false;
    this.showUpdateChild = false;
    this.dataService.accountApp.addChild(Relationship.Unknown);

    setTimeout(() => {
      this.scrollToChild('.add-child');
    }, DOM_REFRESH_TIMEOUT);
  }

  removeChildBtnClick(): void {
    this.showChild = false;
    this.showRemoveChild = true;
    this.showUpdateChild = false;
    this.dataService.accountApp.addRemovedChild(Relationship.Unknown);

    setTimeout(() => {
      this.scrollToChild('.remove-child');
    }, DOM_REFRESH_TIMEOUT);
  }

  updateChildBtnClick(): void {
    this.showChild = false;
    this.showRemoveChild = false;
    this.showUpdateChild = true;
    this.dataService.accountApp.addUpdatedChild(Relationship.Unknown);

    setTimeout(() => {
      this.scrollToChild('.update-child');
    }, DOM_REFRESH_TIMEOUT);
  }

  getDocList() {
    if (this.child.status === StatusInCanada.CitizenAdult){
      return this.canadianCitizenDocList;
    }
    else if (this.child.status === StatusInCanada.PermanentResident){
      return this.permanentResidentDocList;
    }
  }

  get dateToday() {
    return new Date();
  }

  get phns(): string[] {
    const phns = this.dataService.accountApp.allPersons
      .filter(x => x)
      .map(x => x.phn)
      .filter(x => x)
      .filter(x => x.length >= 10);
    return phns;
  }

  get children(): MspPerson[] {
    return this.dataService.accountApp.addedChildren;
  }

  get hasChild(): boolean {
    if (this.dataService.accountApp.addedChildren.length > 0
      || this.dataService.accountApp.removedChildren.length > 0
      || this.dataService.accountApp.updatedChildren.length > 0 ) {
      return true;
    } else {
      return false;
    }
  }

  get removedChildren(): MspPerson[] {
    return this.dataService.accountApp.removedChildren;
  }

  get updatedChildren(): MspPerson[] {
    return this.dataService.accountApp.updatedChildren;
  }

  get addedChildren(): MspPerson[] {
    return this.dataService.accountApp.addedChildren;
  }

  removeChild(idx: number, op: OperationActionType): void {
    this.dataService.accountApp.removeChild(idx, op);
  }

  get accountApp() {
    return this.dataService.accountApp;
  }

  scrollToChild(section: string) {
    const elements = document.querySelectorAll(section);
    if (elements.length > 0) {
      const el: Element = elements[0];
      const top: number = el.getBoundingClientRect().top + window.pageYOffset - 75;
      scrollTo(top);
    }
  }

  checkUpdate() {
    let valid = true;

    this.updatedChildren.forEach((child) => {
      // Must upload at least one doc for all updates
      if (child.updateStatusInCanada === true) {
        valid = valid && this.isSet(child.updateStatusInCanadaDocType.images)
          && child.updateStatusInCanadaDocType.images.length > 0
      }

      if (child.updateNameDueToNameChange === true) {
        valid = valid && this.isSet(child.updateNameDueToNameChangeDocType.images)
          && child.updateNameDueToNameChangeDocType.images.length > 0
      }

      // This is the "due to change" gender one
      if (child.updateGender === true) {
        valid = valid
          // Check upload
          && this.isSet(child.updateGenderDocType.images)
          && child.updateGenderDocType.images.length > 0
          // Check radio button
          && this.isSet(child.updateGenderAdditionalDocs);

        if (child.updateGenderAdditionalDocs === true) {
          // Check upload
          valid = valid && this.isSet(child.updateGenderDocType2.images)
            && child.updateGenderDocType2.images.length > 0
            // Check radio button
            && this.isSet(child.updateGenderAdditionalDocs2)

          if (child.updateGenderAdditionalDocs2 === true) {
            // Check upload
            valid = valid && this.isSet(child.updateGenderDocType3.images)
              && child.updateGenderDocType3.images.length > 0
          }
        }
      }

      if (child.updateNameDueToError === true) {
        valid = valid
          && this.isSet(child.updateNameDueToErrorDocType.images)
          && child.updateNameDueToErrorDocType.images.length > 0
      }

      if (child.updateBirthdate === true) {
        valid = valid
          && this.isSet(child.updateBirthdateDocType.images)
          && child.updateBirthdateDocType.images.length > 0
      }

      if (child.updateGenderDesignation === true) {
        valid = valid
          && this.isSet(child.updateGenderDesignationDocType.images)
          && child.updateGenderDesignationDocType.images.length > 0
      }

      if (!child.updateGenderDesignation
        && !child.updateBirthdate
        && !child.updateNameDueToError
        && !child.updateGender
        && !child.updateNameDueToNameChange
        && !child.updateStatusInCanada
      ) {
        // at least one update must be requested
        valid = false;
      }
    });

    return valid;
  }

  checkAdd() {
    let valid = true;
    this.addedChildren.forEach(addedChild => {
      // Ticked "How old is the child?"
      valid = valid && this.isSet(addedChild.relationship)
        // Ticked "Does the child have active MSP coverage?"
        && this.isSet(addedChild.hasActiveMedicalServicePlan)
        // Ticked "Gender"
        && this.isSet(addedChild.gender)

      // Ticked "19 - 24" under "How old is the child?"
      if (addedChild.relationship === Relationship.Child19To24) {
        // Filled out school name
        valid = valid && this.isSet(addedChild.schoolName)
          && typeof addedChild.schoolName === 'string'
          && addedChild.schoolName.length > 0
          // Ticked "Is this school outside British Columbia?"
          && this.isSet(addedChild.schoolOutsideOfBC)
          // Filled out school address (common-address handles finer validation here)
          && this.isSet(addedChild.schoolAddress)
          // Filled out "Date studies will begin"
          && this.isSet(addedChild.studiesBeginDate)
          // Filled out "Date studies will finish"
          && this.isSet(addedChild.studiesFinishedDate)
          // Ticked "reside in BC after completing study in this school?"
          && this.isSet(addedChild.inBCafterStudies) && addedChild.inBCafterStudies === true

        if (addedChild.schoolOutsideOfBC === true) {
          valid = valid && !!addedChild.studiesDepartureDate;
        }
      }

      // Ticked no to "active MSP coverage"
      if (addedChild.hasActiveMedicalServicePlan === false) {
        // Check that they uploaded at least one supporting doc
        valid = valid && this.isSet(addedChild.status)
          && this.isSet(addedChild.updateStatusInCanadaDocType.images)
          && addedChild.updateStatusInCanadaDocType.images.length > 0
          // Ticked "Has this child's name changed?"
          && this.isSet(addedChild.hasNameChange)
          // Ticked "Is this child newly adopted?"
          && this.isSet(addedChild.newlyAdopted)
          // Ticked "Is this a permanent move to BC for this child?"
          && this.isSet(addedChild.madePermanentMoveToBC)
          // Disable continue if they are going to live in BC permanently
          && addedChild.madePermanentMoveToBC !== false
          // Ticked "more than 30 days in the last 12 months"
          && this.isSet(addedChild.declarationForOutsideOver30Days)
          // Ticked "more than 30 days in the next 6 months"
          && this.isSet(addedChild.declarationForOutsideOver60Days)
          // Ticked "Has this child been released from the Canadian Armed Forces?"
          && this.isSet(addedChild.hasBeenReleasedFromArmedForces)
          
        // Yes to name change
        if (addedChild.hasNameChange === true) {
          // Check they uploaded at least 1 doc
          valid = valid && addedChild.nameChangeDocs
          && this.isSet(addedChild.nameChangeDocs.images)
          && addedChild.nameChangeDocs.images.length > 0;
        }

        // No to "lived in BC since birth"
        if (addedChild.livedInBCSinceBirth === false) {
          // Check they inputted the province or country they came from and the date
          valid = valid && this.isSet(addedChild.arrivalToBCDate)
            && this.isSet(addedChild.movedFromProvinceOrCountry)
            && typeof addedChild.movedFromProvinceOrCountry === 'string'
            && addedChild.movedFromProvinceOrCountry.length > 0;
        }

        // Yes to "newly adopted"
        if (addedChild.newlyAdopted === true) {
          // Check they inputted the province or country they came from and the date
          valid = valid && this.isSet(addedChild.adoptedDate)
        }

        // Yes to "more than 30 days in the last 12 months"
        if (addedChild.declarationForOutsideOver30Days === true) {
          valid = valid && this.isSet(addedChild.departureDateDuring12MonthsDate)
            && this.isSet(addedChild.returnDateDuring12MonthsDate)
            && this.isSet(addedChild.departureReason12Months)
            && this.isSet(addedChild.departureDestination12Months)
        }

        // Yes to "more than 30 days in the next 6 months"
        if (addedChild.declarationForOutsideOver60Days === true) {
          valid = valid && this.isSet(addedChild.departureDateDuring6MonthsDate)
            && this.isSet(addedChild.returnDateDuring6MonthsDate)
            && this.isSet(addedChild.departureReason)
            && this.isSet(addedChild.departureDestination)
        }

        // Yes to "released from Canadian Armed Forces"
        if (addedChild.hasBeenReleasedFromArmedForces === true) {
          valid = valid && this.isSet(addedChild.dischargeDate)
            && this.isSet(addedChild.nameOfInstitute)
        }
      }
    })

    return valid;
  }

  checkRemove() {
    let valid = true;
    this.removedChildren.forEach(removedChild => {
      // Must choose a cancellation reason
      valid = valid && this.isSet(removedChild.cancellationReason);

      // For these options there is only a mandatory date
      if (removedChild.cancellationReason === CancellationReasons.ArmedForces
      || removedChild.cancellationReason === CancellationReasons.Deceased
      || removedChild.cancellationReason === CancellationReasons.Incarcerated) {
        valid = valid && this.isSet(removedChild.cancellationDate)
          && removedChild.cancellationDate instanceof Date;
      }

      // For this option there is a mandatory date and radio button
      if (removedChild.cancellationReason === CancellationReasons.NoLongerInFullTimeStudies) {
        valid = valid && this.isSet(removedChild.cancellationDate)
          && removedChild.cancellationDate instanceof Date
          // mailing address validation is handled by the common component
          && this.isSet(removedChild.hasCurrentMailingAddress);
      }

      // Cannot proceed with this option
      if (removedChild.cancellationReason === CancellationReasons.OutOfProvinceOrCountry) {
        valid = false;
      }
    })

    return valid;
  }

  canContinue(): boolean {
    let valid = super.canContinue();
    if (this.addedChildren.length > 0) {
      valid = valid && this.checkAdd();
    }
    if (this.removedChildren.length > 0) {
      valid = valid && this.checkRemove();
    }
    if (this.updatedChildren.length > 0) {
      valid = valid && this.checkUpdate();
    }
    if (valid === false){
      this._processService.setStep(ChildInfoComponent.ProcessStepNum, false);
    }
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this._processService.setStep(ChildInfoComponent.ProcessStepNum, true);
    this.navigate('/deam/contact-info');
  }
}
