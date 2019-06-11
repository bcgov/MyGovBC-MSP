import {Component, Input, OnInit} from '@angular/core';
import {BenefitApplication} from '../../../../../components/msp/model/benefit-application.model';

@Component({
  selector: 'msp-benefit-eligibility-card',
  templateUrl: './eligibility-card.component.html',
  styleUrls: ['./eligibility-card.component.scss']
})
export class BenefitEligibilityCardComponent  {

    lang = require('./i18n');
    @Input() application: BenefitApplication;
    @Input() editRouterLink: string;
    get _mainDisabilityCredit(): number {
        return this.application.applicantDisabilityCredit;
    }
    get _spouseDisabilityCredit(): number {
        return this.application.spouseDisabilityCredit;
    }
    get _childrenDisabilityCredit(): number {
        return this.application.childrenDisabilityCredit;
    }
}
