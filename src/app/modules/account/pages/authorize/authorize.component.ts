import {Component, ViewChild, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router} from '@angular/router';
import {MspDataService} from '../../../../services/msp-data.service';
import {environment} from '../../../../../environments/environment';
import { MspAccountApp } from '../../models/account.model';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspPerson } from '../../../../../app/components/msp/model/msp-person.model';
import { BaseForm } from '../../models/base-form';
import { ACCOUNT_PAGES } from '../../account.constants';
@Component({
  selector: 'msp-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent extends BaseForm implements OnInit {
  lang = require('./i18n');
  mspAccountApp: MspAccountApp;
  captchaApiBaseUrl: string;
  @ViewChild(NgForm) form: NgForm;
  _showUnauthorizedError: boolean = false;

  constructor(private dataService: MspAccountMaintenanceDataService,
              protected router: Router,
              protected containerService: ContainerService,
              protected pageStateService: PageStateService) {
      super(router, containerService, pageStateService);
      this.mspAccountApp = dataService.getMspAccountApp();
      this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
  }

  get showUnauthorizedError() {
    return this._showUnauthorizedError;
  }

  set showUnauthorizedError(val: boolean) {
    this._showUnauthorizedError = val;
  }

  // unused.. logic changed
  get spousesForAuthorisation(): MspPerson[] {
      return [this.mspAccountApp.addedSpouse, this.mspAccountApp.updatedSpouse].filter(spouse => !!spouse);
  }

  // appears to be unused
  get accountPIUrl() {
      return ACCOUNT_PAGES.PERSONAL_INFO.fullpath;
  }

  // appears to be unused
  get accountDependentUrl() {
      return ACCOUNT_PAGES.CHILD_INFO.fullpath;
  }

  get spouseForAuthorisation(): MspPerson {
    if (this.mspAccountApp.accountChangeOptions.dependentChange && this.mspAccountApp.addedSpouse) {
      return this.mspAccountApp.addedSpouse;
    }
    if ((this.mspAccountApp.accountChangeOptions.personInfoUpdate || this.mspAccountApp.accountChangeOptions.statusUpdate) && this.mspAccountApp.updatedSpouse) {
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

  handleFormSubmission($event) {}

  continue(): void {
    if (!this.canContinue() || !this.mspAccountApp.authorizedByApplicant) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      this.showUnauthorizedError = true;
      return;
    }
    this.showUnauthorizedError = false;
    this.navigate(ACCOUNT_PAGES.SENDING.fullpath);
  }
}
