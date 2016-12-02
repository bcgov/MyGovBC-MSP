import {Address} from "./address.model";
import {Person} from "./person.model";
import {Relationship} from "./status-activities-documents";

export class FinancialAssistApplication {

  /**
   * Person applying for financial assitance
   */
  applicant: Person = new Person(Relationship.Applicant);

  /**
   * Spouse
   */
  spouse: Person = new Person(Relationship.Spouse);

  netIncomelastYear:number;

  /**
   * line 236 on NOA
   */
  spouseNetIncome: number;

  childrenCount:number;
  /**
   * Line 214 on NOA
   */
  private _claimedChildCareExpense_line214: number;

  /**
   * Line 117 on NOA
   */
  private _reportedUCCBenefit_line117: number;

  /**
   * Line 125
   */
  private _spouseDSPAmount_line125: number;

  ageOver65:boolean;
  spouseAgeOver65: boolean;

  private _hasSpouseOrCommonLaw: boolean;


  /**
   * Applicant himself or herself eligible for disablity credit flag
   */
  private eligibleForDisabilityCredit:boolean;
  private spouseOrCommonLawEligibleForDisabilityCredit:boolean;


  get claimedChildCareExpense_line214(){
    if(!!this._claimedChildCareExpense_line214){
      return parseFloat(this._claimedChildCareExpense_line214+ '');
    }else{
      return null;
    }
  }
  set claimedChildCareExpense_line214(n:number){
    this._claimedChildCareExpense_line214 = n;
  }

  get reportedUCCBenefit_line117(): number{
    if(!!this._reportedUCCBenefit_line117){
      return parseFloat(this._reportedUCCBenefit_line117+ '');
    }else{
      return null;
    }
  }

  set reportedUCCBenefit_line117(n:number){
    this._reportedUCCBenefit_line117 = n;
  }

  get spouseDSPAmount_line125(): number{
    if(!!this._spouseDSPAmount_line125){
      return parseFloat(this._spouseDSPAmount_line125+ '');
    }else{
      return null;
    }
  }

  set spouseDSPAmount_line125(n:number){
    this._spouseDSPAmount_line125 = n;
  }

  get hasSpouseOrCommonLaw(){
    return this._hasSpouseOrCommonLaw;
  }

  set setSpouse(arg: boolean){
    console.log('invoked setSpouse with ' + arg);
    if(!arg){
      this.spouseEligibleForDisabilityCredit = arg;
      this.spouseNetIncome = undefined;
      this.spouseAgeOver65 = undefined;
    }
    this._hasSpouseOrCommonLaw = arg;
  }

  // function test(){

  // }

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

  // Address and Contact Info
  public residentialAddress: Address = new Address();
  public mailingSameAsResidentialAddress: boolean = true;
  public mailingAddress: Address = new Address();
  public phoneNumber: string;
  public alternativePhoneNumber: string;

  constructor(){

  }


}
