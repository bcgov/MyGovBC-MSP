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
import * as _ from 'lodash';

import {FinancialAssistApplication} from '../../../model/financial-assist-application.model';
require('./deduction-calculator.less');

@Component({
  selector: 'deduction-calculator',
  templateUrl: './deduction-calculator.html'
})

export class DeductionCalculatorComponent implements OnInit, AfterViewInit{
  @Input() application: FinancialAssistApplication;
  @Input() formValidationInfo: any;
  @Output() updateQualify:EventEmitter<Boolean> = new EventEmitter<Boolean>();
  constructor(){
  }

  ngOnInit(){
    
  }
  ngAfterViewInit(){

  }

  get ageOver65Amt():number {
    return !!this.application.ageOver65? 3000: 0;
  }

  get spouseAmt(): number {
    return !!this.application.hasSpouseOrCommonLaw? 3000: 0; 
  }

  get spouseAgeOver65Amt(): number {
    return !!this.application.spouseAgeOver65? 3000: 0;
  }

  get childrenAmt(): number {
    let cnt:number = (!!this.application.childrenCount && this.application.childrenCount > 0)? this.application.childrenCount : 0;
    return cnt * 3000;
  }

  get childCareExpense(): number {
    return !!this.application.claimedChildCareExpense_line214? this.application.claimedChildCareExpense_line214 : 0;
  }
  get uCCBenefitAmt(): number {
    return !!this.application.reportedUCCBenefit_line117? this.application.reportedUCCBenefit_line117 : 0;
  }

  get disabilityCreditAmt(): number {
    return !!this.application.selfDisabilityCredit? 3000: 0;
  }

  get spouseDisabilityCreditAmt(): number {
    return !!this.application.spouseEligibleForDisabilityCredit? 3000: 0;
  }

  get totalDeductions(): number{
    let total = this.ageOver65Amt
    + this.spouseAmt
    + this.spouseAgeOver65Amt
    + this.childrenAmt
    + this.childCareExpense
    + this.uCCBenefitAmt
    + this.disabilityCreditAmt
    + this.spouseDisabilityCreditAmt
    + this.application.spouseDSPAmount_line125;
    return total;
  }
  get adjustedIncome(): number{
    let adjusted:number = parseFloat(this.totalHouseholdIncome) - this.totalDeductions;

    if(adjusted < 0){
      return 0;
    }else{
      return adjusted;
    }
  }

  get incomeInfoProvided() {
    return ((!isNaN(this.application.netIncomelastYear) && this.application.netIncomelastYear+'' !== '') || 
      (!isNaN(this.application.spouseNetIncome) && this.application.spouseNetIncome+'' !== ''));
  }

  get likelyQualify() {
    // console.log("income " + this.application.netIncomelastYear);
    // console.log("income is number? " + !isNaN(this.application.netIncomelastYear));
    // console.log("spouseIncome " + this.application.spouseNetIncome);
    // console.log("spouseIncome is number? " + !_.isNaN(this.application.spouseNetIncome));
    // console.log(!isNaN(this.application.spouseNetIncome));
    // console.log(this.adjustedIncome);
    // setTimeout(()=>this.updateQualify.emit(true), 0);
    return this.incomeInfoProvided && this.adjustedIncome <= 50000;
      // && this.application.age;
  }

  get canContinue(){
    if(this.formValidationInfo.ageSpecified && !_.isNil(this.application.hasSpouseOrCommonLaw)){
        if(this.application.hasSpouseOrCommonLaw){
          return this.formValidationInfo.spouseSpecified && this.formValidationInfo.spouseAgeSpecified;
        }else{
          return true;
        }
    }else{
      return false;
    }
  }
  get personalIncome(): number {
    if(this.application.netIncomelastYear === null){
      return null;
    }
    let n = (!!this.application.netIncomelastYear && 
      !isNaN(this.application.netIncomelastYear))? this.application.netIncomelastYear : 0;

    return parseFloat(n+'');
  }

  get spouseIncome(): number {
    let n= (!!this.application.spouseNetIncome && !isNaN(this.application.spouseNetIncome))? this.application.spouseNetIncome : 0;
    return parseFloat(n+'');
  }

  get totalHouseholdIncome(): string {
    let t:number = this.personalIncome + this.spouseIncome;
    let total: string = new Number(t).toFixed(2);
    return total;
  }

  
}