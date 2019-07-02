import {Component, Input, OnInit} from '@angular/core';
import {BenefitApplication} from '../../../models/benefit-application.model';
import { Router } from '@angular/router';
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

    editLink(){
        this._router.navigate([this.editRouterLink]);
    }
    
}
