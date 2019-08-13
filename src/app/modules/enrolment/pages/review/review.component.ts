import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MspApplication } from '../../models/application.model';

import { MspDataService } from '../../../../services/msp-data.service';
import { ProcessService } from '../../../../services/process.service';
import { environment } from '../../../../../environments/environment';
import { MspLogService } from '../../../../services/log.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';

@Component({
  templateUrl: './review.component.html'
})
export class ReviewComponent implements OnInit {
  lang = require('./i18n');

  application: MspApplication;
  captchaApiBaseUrl: string;
  @ViewChild(NgForm) form: NgForm;

  // routes
  personal_info = ROUTES_ENROL.PERSONAL_INFO.fullpath;
  spouse_info = ROUTES_ENROL.SPOUSE_INFO.fullpath;
  address_info = ROUTES_ENROL.CONTACT.fullpath;
  child_info = ROUTES_ENROL.CHILD_INFO.fullpath;

  constructor(private dataService: MspDataService,
              private _router: Router,
              private processService: ProcessService,
              private logService: MspLogService) {
    this.application = this.dataService.getMspApplication();
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
  }

  ngOnInit() {
    /* let oldUUID = this.application.uuid;
    this.application.regenUUID();
    this.dataService.saveMspApplication();
    console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspApplication().uuid);*/
  }

  applicantAuthorizeOnChange(event: boolean) {
    // console.log('applicant authorization: ', event);
    this.application.authorizedByApplicant = event;

    if (this.application.authorizedByApplicant) {
      this.application.authorizedByApplicantDate = new Date();
    }
    this.dataService.saveMspApplication();
  }
  spouseAuthorizeOnChange(event: boolean) {
    this.application.authorizedBySpouse = event;
    this.dataService.saveMspApplication();
  }

  get questionApplicant() {
    return this.lang('./en/index.js').doYouAgreeLabel.replace(
      '{name}',
      this.applicantName
    );
  }
  get questionSpouse() {
    return this.lang('./en/index.js').doYouAgreeLabel.replace(
      '{name}',
      this.spouseName
    );
  }
  get applicantName() {
    return (
      this.application.applicant.firstName +
      ' ' +
      this.application.applicant.lastName
    );
  }
  get spouseName() {
    return (
      this.application.spouse.firstName + ' ' + this.application.spouse.lastName
    );
  }

  handleFormSubmission(evt: any) {
    // console.log('review form submitted, %o', evt);
    this.processService.setStep(5, true);
    this._router.navigate([ROUTES_ENROL.AUTHORIZE.fullpath]);
    /*if (this.application.hasValidAuthToken){
      console.log('Found valid auth token, transfer to sending screen.');
      this.processService.setStep(5, true);
      // this.logService.log({name: "Application - Review Page Before Submit (after CAPTCHA)"},"Application-Captcha Success")

    }else{
      console.log('Auth token is not valid');
    }*/
  }
}
