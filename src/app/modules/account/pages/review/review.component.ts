import {Component, ViewChild, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import { MspAccountApp } from '../../models/account.model';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { BaseForm } from '../../models/base-form';
import { ACCOUNT_PAGES } from '../../account.constants';

@Component({
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class AccountReviewComponent extends BaseForm implements OnInit {
  lang = require('./i18n');
  static ProcessStepNum = 4;
  mspAccountApp: MspAccountApp;
  captchaApiBaseUrl: string;
  @ViewChild(NgForm) form: NgForm;

  // routes
  personal_info = ACCOUNT_PAGES.PERSONAL_INFO.fullpath;
  spouse_info = ACCOUNT_PAGES.SPOUSE_INFO.fullpath;
  address_info = ACCOUNT_PAGES.CONTACT_INFO.fullpath;
  child_info = ACCOUNT_PAGES.CHILD_INFO.fullpath;

  constructor(public dataService: MspAccountMaintenanceDataService,
          protected router: Router,
          protected containerService: ContainerService,
          protected pageStateService: PageStateService,) {
    super(router, containerService, pageStateService);
    this.mspAccountApp = dataService.getMspAccountApp();
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
  }

  ngOnInit() {
    this.pageStateService.setPageIncomplete(this.router.url);
  }

  get hasSpouse() {
    return this.mspAccountApp.spouse ? true : false;
  }

  // unused.. logic changed
  get spousesForAuthorisation(): MspPerson[] {
    return [this.mspAccountApp.addedSpouse, this.mspAccountApp.updatedSpouse].filter(spouse => !!spouse);
  }

  get accountPIUrl() {
    return this.personal_info;
  }

  get accountSpouseUrl() {
    return this.spouse_info;
  }

  get accountDependentUrl() {
    return this.child_info;
  }

  get accountChildInfoUrl() {
    return this.child_info;
  }

  get accountContactInfoUrl() {
    return this.address_info;
  }

  get addChildTitle() {
    return 'Add Child Information #';
  }

  get removeChildTitle() {
    return 'Remove Child Information #';
  }

  get updateChildTitle() {
    return 'Update Child Information #';
  }

  get spouseForAuthorisation(): MspPerson {
    if (this.mspAccountApp.accountChangeOptions.dependentChange && this.mspAccountApp.addedSpouse) {
      return this.mspAccountApp.addedSpouse;
    }
    if ((this.mspAccountApp.accountChangeOptions.personInfoUpdate || this.mspAccountApp.accountChangeOptions.statusUpdate ) && this.mspAccountApp.updatedSpouse) {
      return this.mspAccountApp.updatedSpouse;
    }
    return undefined;
  }

  get questionApplicant() {
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.applicantName);
  }

  get applicantName() {
    return this.mspAccountApp.applicant.firstName + ' ' + this.mspAccountApp.applicant.lastName;
  }

  applicantAuthorizeOnChange(event: boolean) {
    this.mspAccountApp.authorizedByApplicant = event;
    if (this.mspAccountApp.authorizedByApplicant) {
      this.mspAccountApp.authorizedByApplicantDate = new Date();
    }
    this.dataService.saveMspAccountApp();
  }

  spouseUpdateAuthorizeOnChange(event: boolean) {
    this.mspAccountApp.authorizedBySpouse = event;
    this.dataService.saveMspAccountApp();
  }

  questionSpouse() {
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.spouseName());
  }

  spouseName() {
    return this.spouseForAuthorisation.firstName + ' ' + this.spouseForAuthorisation.lastName;
  }

  printPage() {
    window.print();
    return false;
  }

  canContinue(): boolean {
    const valid = super.canContinue();
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this.navigate(ACCOUNT_PAGES.AUTHORIZE.fullpath);
  }
}
