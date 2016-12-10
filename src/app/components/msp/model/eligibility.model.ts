/**
 * This class is a container for 
 * 
 * 1. derived/calculated data based on user input.
 * 2. Default data that does not require user input, such as tax year
 * 
 */
export class Eligibility {
  taxYear:Number;
  premiumAssistanceYear:number;
  totalNetIncome:number;

  /**
   * Refer to original paper based form for exact definition of 
   * deduction difference.
   * 
   * Tt is 50% of the child care expense claimed on last year's tax return.
   */
  deductionDifference:number;
  totalDeductions:number;
  adjustedNetIncome:number;
  authorizationDate:string;

}