import { Component, Input } from '@angular/core';
import {FinancialAssistApplication} from '../../../model/financial-assist-application.model';
@Component({
  selector: 'fin-assist-eligibility-card',
  templateUrl: './eligibility-card.html',
})
export class EligibilityCardComponent {
  lang = require('./i18n');
  @Input() application: FinancialAssistApplication;
  @Input() editRouterLink: string;
  get _mainDisabilityCredit():number {
    return this.application.applicantDisabilityCredit;
  }
  get _spouseDisabilityCredit():number {
    return this.application.spouseDisabilityCredit;
  }
  get _childrenDisabilityCredit():number {
    return this.application.childrenDisabilityCredit;
  }
}