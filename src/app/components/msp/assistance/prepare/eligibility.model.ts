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

  deductionDifference:number;
  totalDeductions:number;
  adjustedNetIncome:number;
  authorizationDate:string;

}