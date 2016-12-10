import { Component, Input } from '@angular/core';
import { DeductionCalculatorComponent } from
   '../deduction-calculator/deduction-calculator.component';
import {FinancialAssistApplication} from '../../../model/financial-assist-application.model';
   
@Component({
  selector: 'fin-assist-eligibility-card',
  templateUrl: './eligibility-card.html',

})
export class EligibilityCardComponent {
  lang = require('./i18n');
  
  @Input() application: FinancialAssistApplication;
  @Input() editRouterLink: string;
}