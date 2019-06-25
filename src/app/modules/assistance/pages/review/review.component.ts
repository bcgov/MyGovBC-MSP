import { Component, OnInit } from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
//import {ProcessService} from '../../service/process.service';
import { Router, NavigationEnd } from '@angular/router';
import { MspLogService } from '../../../../services/log.service';

export interface IApplicantInformation {
  years: number[];
  name: string;
  birthDate: string;
  phn: string;
  sin: string;
  documents: string[];
}

export interface IContactInformation {}

@Component({
  template: `
    <h1 tabindex="0">{{ title }}</h1>
    <button class="btn btn-default" onclick="window.print();return false;">
      <i class="fa fa-print fa-lg pointer" aria-hidden="true"></i>
      Print
    </button>
    <div class="row">
      <div class="col-lg-6">
        <msp-person-card
          [person]="application.applicant"
          [editRouterLink]="'/msp/assistance/personal-info'"
        >
        </msp-person-card>
        <msp-person-card
          [person]="application.spouse"
          *ngIf="application.hasSpouseOrCommonLaw"
          [editRouterLink]="'/msp/assistance/personal-info'"
        ></msp-person-card>

        <msp-contact-card
          [residentialAddress]="application.residentialAddress"
          [mailingAddress]="application.mailingAddress"
          [phone]="application.phoneNumber"
          [editRouterLink]="'/msp/assistance/personal-info'"
        ></msp-contact-card>
      </div>
    </div>

    <hr />
  `
})
export class AssistanceReviewComponent {
  title = 'Review your application';
  static ProcessStepNum = 3;

  // lang = require('./i18n');
  application: FinancialAssistApplication;
  constructor(
    private dataService: MspDataService,
    private _router: Router,
    //private _processService: ProcessService,
    private logService: MspLogService
  ) {
    this.application = this.dataService.finAssistApp;
  }

  applicantInformation() {}

  contactInformation() {}

  spouseInformation() {}

  continue() {
    // this._processService.setStep(AssistanceReviewComponent.ProcessStepNum, true);
    // this.logService.log({name: "PA - Review Page after CAPTCHA"},"PA - Captcha Success")
    this._router.navigate(['/enrolment/authorize-submit']);
  }
}
