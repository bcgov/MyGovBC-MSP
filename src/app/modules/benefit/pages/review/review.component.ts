import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MspLogService} from '../../../../services/log.service';
import {ProcessService} from '../../../../components/msp/service/process.service';
import {MspBenefitDataService} from '../../../../components/msp/service/msp-benefit-data.service';
import {BenefitApplication} from '../../../../components/msp/model/benefit-application.model';

@Component({
  selector: 'msp-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class BenefitReviewComponent {
    static ProcessStepNum = 3;

    lang = require('./i18n');
    application: BenefitApplication;

    constructor(private dataService: MspBenefitDataService,
                private _router: Router,
                private _processService: ProcessService,
                private logService: MspLogService){
        this.application = this.dataService.benefitApp;
    }

    continue() {
        this._processService.setStep(BenefitReviewComponent.ProcessStepNum, true);
        // this.logService.log({name: "PA - Review Page after CAPTCHA"},"PA - Captcha Success")
        this._router.navigate(['/msp/benefit/authorize-submit']);
    }
}
