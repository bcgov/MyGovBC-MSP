import { Component, Input } from '@angular/core';
import { DeductionCalculatorComponent } from
   '../deduction-calculator/deduction-calculator.component';
import {FinancialAssistApplication} from '../../../model/financial-assist-application.model';
   
@Component({
  selector: 'eligibility-card',
  templateUrl: './eligibility-card.html',

})
export class EligibilityCard {
  @Input() application: FinancialAssistApplication;
}