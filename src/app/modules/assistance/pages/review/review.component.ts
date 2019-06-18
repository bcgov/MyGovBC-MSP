import { Component, OnInit } from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import {FinancialAssistApplication} from '../../models/financial-assist-application.model';
//import {ProcessService} from '../../service/process.service';
import { Router, NavigationEnd } from '@angular/router';
import { MspLogService } from '../../../../services/log.service';
@Component({
  templateUrl: './review.component.html'
})
export class AssistanceReviewComponent {
  static ProcessStepNum = 3;

  lang = require('./i18n');
  application: FinancialAssistApplication;
  constructor(private dataService: MspDataService,
              private _router: Router,
              //private _processService: ProcessService,
              private logService: MspLogService){
    this.application = this.dataService.finAssistApp;
  }

  continue() {
   // this._processService.setStep(AssistanceReviewComponent.ProcessStepNum, true);
   // this.logService.log({name: "PA - Review Page after CAPTCHA"},"PA - Captcha Success")
    this._router.navigate(['/enrolment/authorize-submit']);
  }
}
