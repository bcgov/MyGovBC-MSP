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
  private ageOver65Amt: number = 0;
  private disabilityCreditAmt: number = 0;
  private spouseDisabilityCreditAmt: number = 0;
  private disabilitySavingPlanIncomeAmt: number = 0;
  private rdsPlanAmt: number = 0;

  constructor(){

  }

  get totalDeductions(): number{
    let total = this.spouseAmt +
    this.disabilityCreditAmt + this.spouseDisabilityCreditAmt +
    this.disabilitySavingPlanIncomeAmt + this.rdsPlanAmt;
    return total;
  }

  get adjustedIncome(): number{
    let income:number = this.application.netIncomelastYear;
    if(!this.application.netIncomelastYear){
      income = 0;
    }

    let adjusted:number = income - this.totalDeductions;

    if(adjusted < 1){
      return 0;
    }else{
      return adjusted;
    }
  }
}