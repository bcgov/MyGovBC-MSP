import { Component, OnInit } from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
//import {ProcessService} from '../../service/process.service';
import { Router, NavigationEnd } from '@angular/router';
import { MspLogService } from '../../../../services/log.service';
import { assistPages } from '../../assist-page-routing.module';
import { ApplicantInformation } from '../../models/applicant-information.model';

export interface IContactInformation {}

@Component({
  template: `
    <h1 tabindex="0">{{ title }}</h1>
    <button class="btn btn-default" onclick="window.print();return false;">
      <i class="fa fa-print fa-lg pointer" aria-hidden="true"></i>
      Print
    </button>
    <common-page-section layout="double">
      <msp-review-card-wrapper [title]="applicantTitle">
      </msp-review-card-wrapper>

      <!-- <div class="row">
      <div class="col-lg-6">
        <msp-person-card
          [person]="application.applicant"
          [editRouterLink]="'/msp/assistance/personal-info'"
        >
        </msp-person-card>
        <msp-person-card
          [person]="application.spouse"
          *ngIf="application.hasSpouseOrCommonLaw"
          [editRouterLink]="'/msp/assistance/spouse'"
        ></msp-person-card>

        <msp-contact-card
          [residentialAddress]="application.residentialAddress"
          [mailingAddress]="application.mailingAddress"
          [phone]="application.phoneNumber"
          [editRouterLink]="'/msp/assistance/contact'"
        ></msp-contact-card>
      </div>
    </div>
    -->
    </common-page-section>

    <hr />
  `
})
export class AssistanceReviewComponent {
  title = 'Review your application';

  applicantTitle = 'Applicant Information';
  contactTitle = 'Contact Information';
  spouseTitle = 'Spouse Information';

  applicantLink = assistPages[1];
  contactLink = assistPages[3];
  spouseLink = assistPages[2];

  static ProcessStepNum = 3;

  // lang = require('./i18n');
  application: FinancialAssistApplication;

  constructor(
    private dataService: MspDataService,
    //private _processService: ProcessService,
    private logService: MspLogService
  ) {
    this.application = this.dataService.finAssistApp;
    this.applicantInformation();
  }

  applicantInformation() {
    const appInfo = new ApplicantInformation(this.dataService.finAssistApp);
  }

  contactInformation() {}

  spouseInformation() {}

  continue() {
    // this._processService.setStep(AssistanceReviewComponent.ProcessStepNum, true);
    // this.logService.log({name: "PA - Review Page after CAPTCHA"},"PA - Captcha Success")
    // this._router.navigate(['/enrolment/authorize-submit']);
  }
}
