import {
  Component, Input, Output, OnChanges, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit
} from '@angular/core';

import {FinancialAssistApplication} from '../../../model/financial-assist-application.model';
require('./deduction-calculator.less');

@Component({
  selector: 'deduction-calculator',
  templateUrl: './deduction-calculator.html'
})

export class DeductionCalculatorComponent{
  @Input() application: FinancialAssistApplication;
  private spouseAmt: number = 0;
  private disabilityAmt: number = 0;
  private disabilitySavingPlanIncom: number = 0;
  constructor(){

  }

  recalcDeductions(){

  }
}