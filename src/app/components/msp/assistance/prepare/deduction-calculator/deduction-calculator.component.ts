import {
  Component, Input, Output, OnInit, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/catch';


import {FinancialAssistApplication} from '../../../model/financial-assist-application.model';
require('./deduction-calculator.less');

@Component({
  selector: 'deduction-calculator',
  templateUrl: './deduction-calculator.html'
})

export class DeductionCalculatorComponent implements OnInit{
  @Input() application: FinancialAssistApplication;
  private ageOver65Amt: number = 0;
  private spouseAmt: number = 0;

  private childrenAmt: number = 0;
  private childCareExpenseAmt: number = 0;
  private uCCBenefitAmt: number = 0;
  
  private disabilityCreditAmt: number = 0;
  private spouseDisabilityCreditAmt: number = 0;
  private rdsPlanAmt: number = 0;

  constructor(){

  }

  ngOnInit(){
    // Observable.ofObjectChanges
  }

  get totalDeductions(): number{
    let total = this.spouseAmt +
    this.disabilityCreditAmt + this.spouseDisabilityCreditAmt +
    this.rdsPlanAmt;
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