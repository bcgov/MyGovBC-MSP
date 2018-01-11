import { Component, OnInit } from '@angular/core';
import { MspDataService } from '../../service/msp-data.service';
import {FinancialAssistApplication}from '../../model/financial-assist-application.model';
import {ProcessService} from "../../service/process.service";
import { Router, NavigationEnd } from "@angular/router";
import { MspLogService } from '../../service/log.service';
@Component({
  templateUrl: './review.component.html'
})
export class AssistanceReviewComponent {
  static ProcessStepNum = 3;

  lang = require('./i18n');
  application: FinancialAssistApplication;
  constructor(private dataService: MspDataService,
              private _router: Router,
              private _processService: ProcessService,
              private logService: MspLogService){
    this.application = this.dataService.finAssistApp;
  }

  continue() {
    this._processService.setStep(AssistanceReviewComponent.ProcessStepNum, true);
    this.logService.log({name: "Assistance - Review Page Before Submit (after CAPTCHA)"})
    this._router.navigate(['/msp/assistance/authorize-submit']);
  }
}