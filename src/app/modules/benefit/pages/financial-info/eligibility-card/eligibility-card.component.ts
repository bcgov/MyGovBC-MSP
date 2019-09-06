import {Component, Input, OnInit} from '@angular/core';
import {BenefitApplication} from '../../../models/benefit-application.model';
import { Router } from '@angular/router';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
@Component({
  selector: 'msp-benefit-eligibility-card',
  templateUrl: './eligibility-card.component.html',
  styleUrls: ['./eligibility-card.component.scss']
})
export class BenefitEligibilityCardComponent  {

    lang = require('./i18n');
    @Input() application: BenefitApplication;
    @Input() editRouterLink: string;
    constructor(private _router: Router) {

    }
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
        if(this.application.applicantClaimForAttendantCareExpense)
            return 3000; 
            else {
                return 0;
            }
   }

   get _spouseAttendantCareExpense(): number {
    if(this.application.spouseClaimForAttendantCareExpense)
         return 3000; 
        else {
            return 0;
        }
    }
    
    editLink(){
        this._router.navigate([this.editRouterLink]);
    }
    
    get childrenAmt(): number {
        const cnt: number = (!!this.application.childrenCount && this.application.childrenCount > 0) ? this.application.childrenCount : 0;
        const amt = cnt * 3000;
        return amt > 0 ? amt : 0;
    }

    
}
