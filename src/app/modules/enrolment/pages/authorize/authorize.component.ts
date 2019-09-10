import {Component, ViewChild, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import {MspApplication} from '../../models/application.model';

import { MspDataService } from '../../../../services/msp-data.service';
import {ProcessService} from '../../../../services/process.service';
import { environment } from '../../../../../environments/environment';
import { MspLogService } from '../../../../services/log.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';

@Component({
  selector: 'msp-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {

  lang = require('./i18n');

  application: MspApplication;
  captchaApiBaseUrl: string;
  @ViewChild(NgForm) form: NgForm;

  constructor(private dataService: MspDataService,
              private _router: Router,
              private pageStateService: PageStateService,
              private logService: MspLogService) {
    this.application = this.dataService.mspApplication;
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
  }


  ngOnInit(){
   /* let oldUUID = this.application.uuid;
    this.application.regenUUID();
    this.dataService.saveMspApplication();
    console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspApplication().uuid);*/
    this.pageStateService.setPageIncomplete(this._router.url, this.dataService.mspApplication.pageStatus);
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


  get questionApplicant(){
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.applicantName);
  }
  get questionSpouse(){
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.spouseName);
  }
  get applicantName(){
    return this.application.applicant.firstName + ' ' + this.application.applicant.lastName;
  }
  get spouseName(){
    return this.application.spouse.firstName + ' ' + this.application.spouse.lastName;
  }

  handleFormSubmission(evt: any){
    // console.log('review form submitted, %o', evt);
    if (this.application.hasValidAuthToken){
      console.log('Found valid auth token, transfer to sending screen.');
      this.pageStateService.setPageComplete(this._router.url, this.dataService.mspApplication.pageStatus);
      this._router.navigate([ROUTES_ENROL.SENDING.fullpath]);
    }else{
      console.log('Auth token is not valid');
    }
  }

}
