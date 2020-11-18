import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProcessService, ProcessUrls } from '../../../../services/process.service';
import { environment } from '../../../../../environments/environment';
import { MspAccountApp } from '../../models/account.model';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspPerson } from '../../../../../app/components/msp/model/msp-person.model';
import { BaseForm } from '../../models/base-form';
import { MspLogService } from '../../../../services/log.service';

@Component({
  selector: 'msp-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent extends BaseForm implements OnInit {
  lang = require('./i18n');
  static ProcessStepNum = 5;
  mspAccountApp: MspAccountApp;
  captchaApiBaseUrl: string;
  @ViewChild(NgForm) form: NgForm;
  _showUnauthorizedError: boolean = false;

  constructor(private dataService: MspAccountMaintenanceDataService,
              private _router: Router,
              private logService: MspLogService,
              protected containerService: ContainerService,
              protected pageStateService: PageStateService,
              public _processService: ProcessService) {
    super(_router, containerService, pageStateService, _processService);
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
  get spousesForAuthorization(): MspPerson[] {
    return [this.mspAccountApp.addedSpouse, this.mspAccountApp.updatedSpouse].filter(spouse => !!spouse);
  }

  get accountPIUrl() {
    return ProcessUrls.ACCOUNT_PERSONAL_INFO_URL;
  }

  get accountDependentUrl() {
    return ProcessUrls.ACCOUNT_DEPENDENTS_URL;
  }

  get spouseForAuthorization(): MspPerson {
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

  ngOnInit() {
    this.initProcessMembers(AuthorizeComponent.ProcessStepNum, this._processService);
    this._processService.setStep(AuthorizeComponent.ProcessStepNum, false);
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
    return this.spouseForAuthorization.firstName + ' ' + this.spouseForAuthorization.lastName;
  }

  handleFormSubmission($event) {}

  continue(): void {
    if (!this.canContinue() || !this.mspAccountApp.authorizedByApplicant) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      this.showUnauthorizedError = true;
      this._processService.setStep(AuthorizeComponent.ProcessStepNum, false);
      return;
    }
    this.showUnauthorizedError = false;
    this._processService.setStep(AuthorizeComponent.ProcessStepNum, true);
    this.navigate('/deam/sending');
  }
}
