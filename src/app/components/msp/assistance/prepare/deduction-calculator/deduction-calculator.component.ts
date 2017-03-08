import {
  Component, Input, Output, OnInit, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';

import {Eligibility} from '../../../model/eligibility.model';
import {FinancialAssistApplication} from '../../../model/financial-assist-application.model';
require('./deduction-calculator.less');

@Component({
  selector: 'deduction-calculator',
  templateUrl: './deduction-calculator.html'
})

export class DeductionCalculatorComponent implements OnInit, AfterViewInit{
  @Input() application: FinancialAssistApplication;
  @Output() updateQualify:EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() taxYearInfoMissing:EventEmitter<Boolean> = new EventEmitter<Boolean>();

  @Input() qualificationThreshhold:number;
  lang = require('./i18n');
  
  constructor(private _router: Router){
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

  /**
   * Children amount has been reduced with 50% of child care expense claimed on income tax
   */
  get adjustedChildrenAmt(): number {
    let amt = this.childrenAmt + this.childCareExpense;
    return amt > 0 ? amt : 0;
  }

  get childrenAmt(): number {
    let cnt:number = (!!this.application.childrenCount && this.application.childrenCount > 0)? this.application.childrenCount : 0;
    let amt = cnt * 3000;
    return amt > 0 ? amt : 0;
  }

  get childCareExpense(): number {
    return !!this.application.claimedChildCareExpense_line214? (this.application.claimedChildCareExpense_line214/2)*-1 : 0;
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
  get childrenDisabilityCreditAmt(): number {
    let m = this.application.childWithDisabilityCount;
    return !!m? 3000*m: 0;
  }

  get attendantCareExpenseAmt(): number {
    if(_.isNumber(this.application.attendantCareExpense) 
      && this.application.attendantCareExpense < 3000 
      && this.application.attendantCareExpense > 0){
      return this.application.attendantCareExpense;
    }else{
      return 0;
    }
  }

  get childClaimForAttendantCareExpenseAmt(): number {
    if(!!this.application.childClaimForAttendantCareExpense){
      return this.application.childClaimForAttendantCareExpenseCount * 3000;
    }else{
      return 0;
    }
  }
  get spouseClaimForAttendantCareExpenseAmt(): number {
    if(!!this.application.spouseClaimForAttendantCareExpense){
      return 3000;
    }else{
      return 0;
    }
  }
  get applicantClaimForAttendantCareExpenseAmt(): number {
    if(!!this.application.applicantClaimForAttendantCareExpense){
      return 3000;
    }else{
      return 0;
    }
  }

  get familyClaimForAttendantCareExpenseAmt(): number {
    return this.childClaimForAttendantCareExpenseAmt + this.spouseClaimForAttendantCareExpenseAmt
    + this.applicantClaimForAttendantCareExpenseAmt;
  }

  get totalDeductions(): number{
    let total = this.ageOver65Amt
    + this.spouseAmt
    + this.spouseAgeOver65Amt
    + this.adjustedChildrenAmt
    + this.uCCBenefitAmt
    + this.disabilityCreditAmt
    + this.spouseDisabilityCreditAmt
    + this.childrenDisabilityCreditAmt
    + this.application.spouseDSPAmount_line125
    + this.applicantClaimForAttendantCareExpenseAmt
    + this.spouseClaimForAttendantCareExpenseAmt
    + this.childClaimForAttendantCareExpenseAmt;
    return total;
  }

  get adjustedIncome(): number{
    let adjusted:number = parseFloat(this.totalHouseholdIncome) - this.totalDeductions;
    adjusted < 0? adjusted = 0 : adjusted = adjusted;
    
    this.application.eligibility.adjustedNetIncome = adjusted;
    this.application.eligibility.totalDeductions = this.totalDeductions;

    this.application.eligibility.childDeduction = this.childrenAmt
    this.application.eligibility.disabilityDeduction = this.childrenDisabilityCreditAmt;
    this.application.eligibility.totalDeductions = this.totalDeductions;
    this.application.eligibility.totalNetIncome = parseFloat(this.totalHouseholdIncome);
    this.application.eligibility.spouseDeduction = this.spouseAmt;
    this.application.eligibility.spouseSixtyFiveDeduction = this.spouseAgeOver65Amt;
    this.application.eligibility.sixtyFiveDeduction = this.ageOver65Amt;

    /**
     * Rule 23 on FDS document
     * 
     * IF D0.NUMBER OF CHILDREN = 0
     *  THEN Value = 0
     *  ELSE Value =
     *  D0.CHILD DEDUCTION -  
     *  D0.CHILD CARE EXPENSES 
     *  IF Value < 0 
     *  THEN Value = 0
     */
    this.application.eligibility.deductions = this.adjustedChildrenAmt;

    return adjusted;
  }

  get applicantIncomeInfoProvided() {
    let result = (!!this.application.netIncomelastYear && !isNaN(this.application.netIncomelastYear) && (this.application.netIncomelastYear+'').trim() !== '');
    let stamp = new Date().getTime();
    // console.log( stamp + '- income info number : ' + this.application.netIncomelastYear);
    // console.log(stamp + '- income info provided? : ' + result);
    return result;
  }
  get spouseIncomeInfoProvided() {
    let result = (!!this.application.spouseIncomeLine236 && !isNaN(this.application.spouseIncomeLine236) && (this.application.spouseIncomeLine236+'').trim() !== '');
    return result;
  }

  get incomeUnderThreshhold() {
    return _.isNumber(this.adjustedIncome) && this.adjustedIncome < Math.pow(10, 6);
    // let r = this.adjustedIncome <= this.qualificationThreshhold;
    // return r;
  }

  get canContinue(){
    let spouseSpecified = 
      !(this.application.hasSpouseOrCommonLaw === null || this.application.hasSpouseOrCommonLaw === undefined);
      
    let spouseAgeSpecified = !(this.application.spouseAgeOver65 === null || this.application.spouseAgeOver65 === undefined);
    let applicantAgeSpecified = !(this.application.ageOver65 === null || this.application.ageOver65 == undefined);

     if(this.applicantIncomeInfoProvided && applicantAgeSpecified && spouseSpecified){
       if(this.application.hasSpouseOrCommonLaw){
         return spouseAgeSpecified && this.attendantCareExpenseReceiptsProvided;
       }else{
         return this.attendantCareExpenseReceiptsProvided;
       }
     }else{
       return false;
     }
  }


  navigateToPersonalInfo(){
    let taxYearSpecified = this.application.taxtYearsProvided;
    if(taxYearSpecified){
      this._router.navigate(['/msp/assistance/personal-info']);
    }else{
      this.taxYearInfoMissing.emit(true);
    }
  }

  get taxYearsSpecified(){
    return this.application.taxtYearsProvided;
  }

  private get attendantCareExpenseReceiptsProvided():boolean {
    let provided = true;
     if(this.incomeUnderThreshhold && (this.childClaimForAttendantCareExpenseAmt > 0 
      || this.applicantClaimForAttendantCareExpenseAmt > 0 || this.spouseClaimForAttendantCareExpenseAmt > 0)){
        provided = this.application.attendantCareExpenseReceipts.length > 0;
     }

     return provided;
  }

  get isPristine(){
    return (this.application.ageOver65 !== true && this.application.ageOver65 !== false) && 
      (this.application.netIncomelastYear === null || this.application.netIncomelastYear === undefined);
  }

  get personalIncome(): number {
    if(this.application.netIncomelastYear === null){
      return null;
    }
    let n = (!!this.application.netIncomelastYear && 
      !isNaN(this.application.netIncomelastYear))? this.application.netIncomelastYear : 0;
    //console.log("application net income: " + this.application.netIncomelastYear);
    return parseFloat(n+'');
  }

  get spouseIncome(): number {
    let n= this.spouseIncomeInfoProvided? this.application.spouseIncomeLine236 : 0;
    return parseFloat(n+'');
  }

  get totalHouseholdIncome(): string {
    let t:number = this.personalIncome + this.spouseIncome;
    let total: string = new Number(t).toFixed(2);
    return total;
  }

  get eligibility(): Eligibility {
    return this.application.eligibility;
  }
}