export class FinancialAssistApplication {
  netIncomelastYear:number;
  ageOver65:boolean;
  hasSpouseOrCommonLaw: boolean;

  private _hasChildrenInfo:boolean;
  private _hasDisabilityInfo:boolean;

  /**
   * Applicant himself or herself eligible for disablity credit flag
   */
  eligibleForDisabilityCredit:boolean;
  private spouseOrCommonLawEligibleForDisabilityCredit:boolean;

  /**
   * Deductions
   */
  spouseAmout:number;
  disabilityCredit:number;
  reportedDisabilitySavingsPlanAmount:number;

  constructor(){

  }


  set spouseDisabilityCredit(eligible:boolean) {
    if(this.hasSpouseOrCommonLaw){
      this.spouseOrCommonLawEligibleForDisabilityCredit = eligible;
    }else{
      this.spouseOrCommonLawEligibleForDisabilityCredit = false;
    }
  }

  /**
   * Children info section
   */
  get hasChildrenInfo(){
    return this._hasChildrenInfo;
  }
  addChildrenInfo(){
    this._hasChildrenInfo = true;
  }

  removeChildrenInfo(){
    this._hasChildrenInfo = false;
  }

  /**
   * Disablility Info section
   */
  get hasDisabilityInfo(){
    return this._hasDisabilityInfo;
  }
  addDisabilityInfo(){
    this._hasDisabilityInfo = true;
  }

  /**
   * reset all property regarding disability (self and spouse)
   */
  removeDisabilityInfo(){
    this._hasDisabilityInfo = false;
  }

}