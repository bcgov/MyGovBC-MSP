import {Component, Injectable, ViewChild, ViewChildren,
  ChangeDetectorRef, QueryList, AfterViewInit, OnInit} from '@angular/core';
import {MspApplication, MspPerson} from '../../models/application.model';

// import {MspDataService} from '../../service/msp-data.service';
import { MspDataService } from '../../../../services/msp-data.service';

import { Router } from '@angular/router';
import {Relationship} from '../../../msp-core/models/status-activities-documents';
import {NgForm} from '@angular/forms';
import {PersonalDetailsComponent} from '../../components/personal-details/personal-details.component';
import {BaseComponent} from '../../../../models/base.component';
import {ProcessService} from '../../../../services/process.service';
import { StatusInCanada} from '../../../msp-core/models/status-activities-documents';
import { ServicesCardDisclaimerModalComponent } from '../../../msp-core/components/services-card-disclaimer/services-card-disclaimer.component';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';

@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent extends BaseComponent {
  static ProcessStepNum = 1;
  lang = require('./i18n');
  Relationship: typeof Relationship = Relationship;
  public buttonClass: string = 'btn btn-default';

  @ViewChild('formRef') form: NgForm;
  @ViewChild('mspServicesCardModal')
  mspServicesCardModal: ServicesCardDisclaimerModalComponent;
  @ViewChildren(PersonalDetailsComponent) personalDetailsComponent: QueryList<
    PersonalDetailsComponent
  >;

  constructor(
    private dataService: MspDataService,
    private _router: Router,
    private pageStateService: PageStateService,
    private cd: ChangeDetectorRef
  ) {
    super(cd);
  }

  ngOnInit() {
    this.pageStateService.setPageIncomplete(this._router.url, this.dataService.mspApplication.pageStatus);
  }

  onChange(values: any) {
    this.dataService.saveMspApplication();
  }

  get application(): MspApplication {
    return this.dataService.mspApplication;
  }
  get applicant(): MspPerson {
    return this.dataService.mspApplication.applicant;
  }

  get spouse(): MspPerson {
    return this.dataService.mspApplication.spouse;
  }

  addSpouse = () => {
    const sp: MspPerson = new MspPerson(Relationship.Spouse);
    this.dataService.mspApplication.addSpouse(sp);
  }

  addChild(relationship: Relationship): void {
    this.dataService.mspApplication.addChild(relationship);
  }

  get children(): MspPerson[] {
    return this.dataService.mspApplication.children;
  }

  removeChild(event: Object, idx: number): void {
    // console.log('remove child ' + JSON.stringify(event));
    this.dataService.mspApplication.removeChild(idx);
    this.dataService.saveMspApplication();
  }

  removeSpouse(event: Object): void {
    // console.log('remove spouse ' + JSON.stringify(event));
    this.dataService.mspApplication.removeSpouse();
    this.dataService.saveMspApplication();
  }

  documentsReady(): boolean {
    return this.dataService.mspApplication.documentsReady;
  }

  // fix for DEF-90
  isStayinginBCAfterstudies(): boolean {
    let stayingInBc = true;
    if (this.personalDetailsComponent) {
      // initial page load..empty object
      this.personalDetailsComponent.forEach(personalDetailsComponent => {
        if (personalDetailsComponent && personalDetailsComponent.person) {
          //dependent can be empty object..ignore them

          const currentApplicant: MspPerson = personalDetailsComponent.person;
          if (
            currentApplicant.status === StatusInCanada.CitizenAdult ||
            currentApplicant.status === StatusInCanada.PermanentResident
          ) {
            if (
              currentApplicant.fullTimeStudent &&
              currentApplicant.inBCafterStudies === false
            ) {
              stayingInBc = false;
            }
          }
        }
      });
    }

    return stayingInBc;
  }
  canContinue(): boolean {
    return this.isAllValid();
  }

  isValid(): boolean {
    return this.dataService.mspApplication.isUniquePhns;
  }

  checkAnyDependentsIneligible(): boolean {
    const target = [
      this.dataService.mspApplication.applicant,
      this.dataService.mspApplication.spouse,
      ...this.dataService.mspApplication.children
    ];
    return target.filter(x => x).filter(x => x.ineligibleForMSP).length >= 1;
  }

  continue(): void {
    // console.log('personal info form itself valid: %s', this.form.valid);
    console.log(
      'combinedValidationState on personal info: %s',
      this.isAllValid()
    );
    if (!this.isAllValid()) {
      console.log('Please fill in all required fields on the form.');
    }else{
      this.pageStateService.setPageComplete(this._router.url, this.dataService.mspApplication.pageStatus);
      this._router.navigate([ROUTES_ENROL.PERSONAL_INFO.fullpath]);
    }
  }
}
