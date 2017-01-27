export class Deductions {
  ageOver65Amt:number;
  spouseAmt:number;
  spouseAgeOver65Amt:number;
  childrenAmt:number;
  uCCBenefitAmt:number;
  disabilityCreditAmt:number;
  spouseDisabilityCreditAmt:number;
  childreDisabilityCreditAmt:number;
  familyClaimForAttendantCareExpenseAmt:number;
  spouseDSPAmount_line125:number;


  adjustedNetIncome:number;

  get total():number {
    let total = this.ageOver65Amt
    + this.spouseAmt
    + this.spouseAgeOver65Amt
    + this.childrenAmt
    + this.uCCBenefitAmt
    + this.disabilityCreditAmt
    + this.spouseDisabilityCreditAmt
    + this.childreDisabilityCreditAmt
    + this.familyClaimForAttendantCareExpenseAmt
    + this.spouseDSPAmount_line125;
    
    return total;
  }
}