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


const DOM_REFRESH_TIMEOUT = 50;

@Component({
  selector: 'msp-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.scss']
})

export class ChildInfoComponent extends BaseForm implements OnInit, AfterViewInit, OnDestroy {
 // children: MspPerson[];

  constructor(public dataService: MspAccountMaintenanceDataService,
              protected router: Router,
              protected containerService: ContainerService,
              protected pageStateService: PageStateService) {
    super(router, containerService, pageStateService);
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
    this.updatedChildren.forEach(function (child) {
      if (child.updateStatusInCanada === true) {
        valid = valid && child.updateStatusInCanadaDocType.images.length > 0
      }

      if (child.updateNameDueToNameChange == true) {
        valid = valid && child.updateNameDueToNameChangeDocType.images.length > 0
      }

      if (child.updateGender === true) {
        valid = valid
          && child.updateGenderDocType.images !== undefined
          && child.updateGenderDocType.images.length > 0
        if (child.updateGenderAdditionalDocs === true) {
          valid = valid && child.updateGenderDocType2.images.length > 0
        }
      }

      if (child.updateNameDueToError === true) {
        valid = valid
          && child.updateNameDueToErrorDocType.images !== undefined
          && child.updateNameDueToErrorDocType.images.length > 0
      }

      if (child.updateBirthdate === true) {
        valid = valid
          && child.updateBirthdateDocType.images !== undefined
          && child.updateBirthdateDocType.images.length > 0
      }

      if (child.updateGenderDesignation == true) {
        valid = valid
          && child.updateGenderDesignationDocType.images !== undefined
          && child.updateGenderDesignationDocType.images.length > 0
      }
    });
    return valid;
  }

  checkAdd() {
    let valid = true;
    this.addedChildren.forEach(addedChild => {
      // Ticked "How old is the child?"
      valid = valid && addedChild.relationship !== undefined
        && addedChild.relationship !== null
        // Ticked "Does your child have active MSP coverage?"
        && addedChild.hasActiveMedicalServicePlan !== undefined
        && addedChild.hasActiveMedicalServicePlan !== null
        // Ticked "Gender"
        && addedChild.gender !== undefined
        && addedChild.gender !== null
        // Ticked "Is this child newly adopted?"
        && addedChild.newlyAdopted !== undefined
        && addedChild.newlyAdopted !== null
        // Ticked "Is this a permanent move to BC for this child?"
        && addedChild.madePermanentMoveToBC !== undefined
        && addedChild.madePermanentMoveToBC !== null
        // Ticked "more than 30 days in the last 12 months"
        && addedChild.declarationForOutsideOver30Days !== undefined
        && addedChild.declarationForOutsideOver30Days !== null
        // Ticked "more than 30 days in the next 6 months"
        && addedChild.declarationForOutsideOver60Days !== undefined
        && addedChild.declarationForOutsideOver60Days !== null
        // Ticked "Has this child been released from the Canadian Armed Forces?"
        && addedChild.hasBeenReleasedFromArmedForces !== undefined
        && addedChild.hasBeenReleasedFromArmedForces !== null;

      // Ticked "19 - 24" under "How old is the child?"
      if (addedChild.relationship === Relationship.Child19To24) {
        // Filled out school name
        valid = valid && addedChild.schoolName !== undefined
          && addedChild.schoolName !== null
          && typeof addedChild.schoolName === 'string'
          && addedChild.schoolName.length > 0
          // Ticked "Is this school outside British Columbia?"
          && addedChild.schoolOutsideOfBC !== undefined
          && addedChild.schoolOutsideOfBC !== null
          // Filled out school address (common-address handles finer validation here)
          && addedChild.schoolAddress !== undefined
          && addedChild.schoolAddress !== null
          // Filled out "Date studies will begin"
          && addedChild.studiesBeginDate !== undefined
          && addedChild.studiesBeginDate !== null
          // Filled out "Date studies will finish"
          && addedChild.studiesFinishedDate !== undefined
          && addedChild.studiesFinishedDate !== null
          // Ticked "reside in BC after completing study in this school?"
          && addedChild.inBCafterStudies !== undefined
          && addedChild.inBCafterStudies !== null

        if (addedChild.schoolOutsideOfBC === true) {
          valid = valid && !!addedChild.studiesDepartureDate;
        }
      }

      // Ticked no to "active MSP coverage"
      if (addedChild.hasActiveMedicalServicePlan === false) {
        // Check that they uploaded at least one supporting doc
        valid = valid && addedChild.status !== undefined
          && addedChild.status !== null
          && addedChild.updateStatusInCanadaDocType.images !== undefined
          && addedChild.updateStatusInCanadaDocType.images !== null
          && addedChild.updateStatusInCanadaDocType.images.length > 0
          && addedChild.hasNameChange !== undefined
          && addedChild.hasNameChange !== null;

          if (addedChild.hasNameChange === true) {
          valid = valid && addedChild.nameChangeDocs
          && addedChild.nameChangeDocs.images !== undefined
          && addedChild.nameChangeDocs.images !== null
          && addedChild.nameChangeDocs.images.length > 0;
        }
      }

      // No to "lived in BC since birth"
      if (addedChild.livedInBCSinceBirth === false) {
        // Check they inputted the province or country they came from and the date
        valid = valid && addedChild.arrivalToBCDate !== undefined
          && addedChild.arrivalToBCDate !== null
          && addedChild.movedFromProvinceOrCountry !== undefined
          && addedChild.movedFromProvinceOrCountry !== null
          && typeof addedChild.movedFromProvinceOrCountry === 'string'
          && addedChild.movedFromProvinceOrCountry.length > 0;
      }

      // Yes to "newly adopted"
      if (addedChild.newlyAdopted === true) {
        // Check they inputted the province or country they came from and the date
        valid = valid && addedChild.adoptedDate !== undefined
        && addedChild.adoptedDate !== null
      }

      // Yes to "more than 30 days in the last 12 months"
      if (addedChild.declarationForOutsideOver30Days === true) {
        valid = valid && addedChild.departureDateDuring12MonthsDate !== undefined
          && addedChild.departureDateDuring12MonthsDate !== null
          && addedChild.returnDateDuring12MonthsDate !== undefined
          && addedChild.returnDateDuring12MonthsDate !== null
          && addedChild.departureReason12Months !== undefined
          && addedChild.departureReason12Months !== null
          && addedChild.departureDestination12Months !== undefined
          && addedChild.departureDestination12Months !== null;
      }

      // Yes to "more than 30 days in the next 6 months"
      if (addedChild.declarationForOutsideOver60Days === true) {
        valid = valid && addedChild.departureDateDuring6MonthsDate !== undefined
          && addedChild.departureDateDuring6MonthsDate !== null
          && addedChild.returnDateDuring6MonthsDate !== undefined
          && addedChild.returnDateDuring6MonthsDate !== null
          && addedChild.departureReason !== undefined
          && addedChild.departureReason !== null
          && addedChild.departureDestination !== undefined
          && addedChild.departureDestination !== null;
      }


      // Yes to "released from Canadian Armed Forces"
      if (addedChild.hasBeenReleasedFromArmedForces === true) {
        valid = valid && addedChild.dischargeDate !== undefined
          && addedChild.dischargeDate !== null
          && addedChild.nameOfInstitute !== undefined
          && addedChild.nameOfInstitute !== null;
      }
    })

    return valid;
  }

  checkRemove() {
    let valid = true;
    this.removedChildren.forEach(removedChild => {
      valid = valid && removedChild.cancellationReason !== undefined;
      valid = valid && removedChild.cancellationReason != null;

      // For these options there is only a mandatory date
      if (removedChild.cancellationReason === CancellationReasons.ArmedForces
      || removedChild.cancellationReason === CancellationReasons.Deceased
      || removedChild.cancellationReason === CancellationReasons.Incarcerated) {
        valid = valid && removedChild.cancellationDate instanceof Date;
      }

      // For this option there is a mandatory date and radio button
      if (removedChild.cancellationReason === CancellationReasons.NoLongerInFullTimeStudies) {
        valid = valid && removedChild.cancellationDate instanceof Date && removedChild.hasCurrentMailingAddress !== undefined;
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
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this.navigate('/deam/contact-info');
  }
}
