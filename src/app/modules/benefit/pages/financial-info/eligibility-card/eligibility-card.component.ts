import { Component, Input } from '@angular/core';
import { BenefitApplication } from '../../../models/benefit-application.model';
import { ATTENDANT_CARE_CLAIM_AMT } from '../../../../../constants';

@Component({
  selector: 'msp-benefit-eligibility-card',
  templateUrl: './eligibility-card.component.html',
  styleUrls: ['./eligibility-card.component.scss']
})
export class BenefitEligibilityCardComponent  {

    lang = require('./i18n');
    @Input() application: BenefitApplication;
    @Input() editRouterLink: string;
    constructor() {}

    get _mainDisabilityCredit(): number {
        return this.application.applicantDisabilityCredit;
    }
    get _spouseDisabilityCredit(): number {
        return this.application.spouseDisabilityCredit;
    }
    get _childrenDisabilityCredit(): number {
        return this.application.childrenDisabilityCredit;
    }

    get _applicantAttendantCareExpense(): number {
        return this.application.applicantClaimForAttendantCareExpense
            ? ATTENDANT_CARE_CLAIM_AMT
            : 0;
   }

    get _spouseAttendantCareExpense(): number {
        return this.application.spouseClaimForAttendantCareExpense
            ? ATTENDANT_CARE_CLAIM_AMT
            : 0;
    }


    get childrenAmt(): number {
        const cnt: number = (!!this.application.childrenCount && this.application.childrenCount > 0) ? this.application.childrenCount : 0;
        const amt = cnt * 3000;
        return amt > 0 ? amt : 0;
    }

    get childClaimForAttendantCareExpenseAmt(): number {
        if (!!this.application.childClaimForAttendantCareExpense) {
            return this.application.childClaimForAttendantCareExpenseCount * ATTENDANT_CARE_CLAIM_AMT;
        } else {
            return 0;
        }
    }


}
