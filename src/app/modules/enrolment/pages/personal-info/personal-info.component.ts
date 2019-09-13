import {Component, Injectable, ViewChild, ViewChildren,
  ChangeDetectorRef, QueryList} from '@angular/core';
// import {MspDataService} from '../../service/msp-data.service';
import { MspDataService } from '../../../../services/msp-data.service';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import {PersonalDetailsComponent} from '../../components/personal-details/personal-details.component';
import {BaseComponent} from '../../../../models/base.component';
import { ServicesCardDisclaimerModalComponent } from '../../../msp-core/components/services-card-disclaimer/services-card-disclaimer.component';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { MspApplication } from '../../models/application.model';
import { MspPerson } from '../../../account/models/account.model';
import { StatusInCanada } from '../../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../msp-core/models/relationship.enum';
import { statusReasonRules } from '../../../msp-core/components/canadian-status/canadian-status.component';


@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent extends BaseComponent {

  lang = require('./i18n');
  Relationship: typeof Relationship = Relationship;

  @ViewChild('formRef') form: NgForm;
  @ViewChild('mspServicesCardModal')
  mspServicesCardModal: ServicesCardDisclaimerModalComponent;
  @ViewChildren(PersonalDetailsComponent) personalDetailsComponent: QueryList<
    PersonalDetailsComponent
  >;

  constructor( private dataService: MspDataService,
               private _router: Router,
               private pageStateService: PageStateService,
               cd: ChangeDetectorRef ) {
    super(cd);
  }

  ngOnInit() {
    this.pageStateService.setPageIncomplete(this._router.url, this.dataService.mspApplication.pageStatus);
  }

  onChange($event) {

    console.log( 'onChange: ', $event );
    this.dataService.saveMspApplication();
  }

  get application(): MspApplication {
    return this.dataService.mspApplication;
  }
  get applicant(): MspPerson {
    return this.dataService.mspApplication.applicant;
  }


  addChild(relationship: Relationship): void {
    this.dataService.mspApplication.addChild(relationship);
  }

  get children(): MspPerson[] {
    return this.dataService.mspApplication.children;
  }

  removeChild(idx: number): void {
    // console.log('remove child ' + JSON.stringify(event));
    this.dataService.mspApplication.removeChild(idx);
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

  canContinue(): boolean {
    const valid = !(!this.isStayinginBCAfterstudies() ||
    this.checkAnyDependentsIneligible() || !this.isAllValid());

    //console.log('canContinue(): ', valid, this.form );
    return valid;
  }
}
