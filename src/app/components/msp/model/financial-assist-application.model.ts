import {Address} from "./address.model";

export class FinancialAssistApplication {
  netIncomelastYear:number;

  /**
   * line 236 on NOA
   */
  spouseNetIncome: number;

  /**
   * Line 214 on NOA
   */
  claimedChildCareExpense_line214: number;

  /**
   * Line 117 on NOA
   */
  reportedUCCBenefit_line117: number;

  /**
   * Line 125
   */
  spouseDSPAmount_line125: number;

  ageOver65:boolean;
  _hasSpouseOrCommonLaw: boolean;

  private _hasChildrenInfo:boolean;
  // private _hasDisabilityInfo:boolean;

  /**
   * Applicant himself or herself eligible for disablity credit flag
   */
  private eligibleForDisabilityCredit:boolean;
  private spouseOrCommonLawEligibleForDisabilityCredit:boolean;

  /**
   * Deductions
   */
  spouseAmout:number;
  disabilityCredit:number;
  reportedDisabilitySavingsPlanAmount:number;

  constructor(){

  }

  get hasSpouseOrCommonLaw(){
    return this._hasSpouseOrCommonLaw;
  }

  set hasSpouseOrCommonLaw(arg:boolean){
    if(!arg){
      this.spouseEligibleForDisabilityCredit = arg;
      this.spouseNetIncome = null;
    }
    this._hasSpouseOrCommonLaw = arg;
  }

  get selfDisabilityCredit(){
    return this.eligibleForDisabilityCredit;
  }
  set selfDisabilityCredit(selfEligible:boolean){
    this.eligibleForDisabilityCredit = selfEligible;
  }

  get spouseEligibleForDisabilityCredit(){
    return this.spouseOrCommonLawEligibleForDisabilityCredit
  }

  set spouseEligibleForDisabilityCredit(spouseEligible:boolean) {
    if(spouseEligible){
      this._hasSpouseOrCommonLaw = true;
    }
    this.spouseOrCommonLawEligibleForDisabilityCredit = spouseEligible;
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
  // get hasDisabilityInfo(){
  //   return this._hasDisabilityInfo;
  // }
  // addDisabilityInfo(){
  //   this._hasDisabilityInfo = true;
  // }

  /**
   * reset all property regarding disability (self and spouse)
   */
  // removeDisabilityInfo(){
  //   this._hasDisabilityInfo = false;
  // }

  // Address and Contact Info
  public residentialAddress: Address = new Address();
  public mailingSameAsResidentialAddress: boolean = true;
  public mailingAddress: Address = new Address();
  public phoneNumber: string;
  public alternativePhoneNumber: string;
}
