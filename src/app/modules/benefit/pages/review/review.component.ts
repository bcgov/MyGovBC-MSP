import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {Router} from '@angular/router';
import {MspLogService} from '../../../../services/log.service';
import {ProcessService} from '../../../../services/process.service';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {BenefitApplication} from '../../models/benefit-application.model';
import { BaseComponent } from '../../../../models/base.component';
@Component({
  selector: 'msp-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class BenefitReviewComponent extends BaseComponent {
    static ProcessStepNum = 4;

    lang = require('./i18n');
    application: BenefitApplication;

    constructor(private dataService: MspBenefitDataService,
                private _router: Router,
                private _processService: ProcessService,
                private logService: MspLogService,
                private cd: ChangeDetectorRef){
                    super(cd);
        this.application = this.dataService.benefitApp;
        this.initProcessMembers(BenefitReviewComponent.ProcessStepNum, this._processService);
        this._processService.setStep(BenefitReviewComponent.ProcessStepNum, false);

    }

    continue() {
        this._processService.setStep(BenefitReviewComponent.ProcessStepNum, true);
        // this.logService.log({name: "PA - Review Page after CAPTCHA"},"PA - Captcha Success")
        this._router.navigate(['/benefit/authorize']);
    }
}
