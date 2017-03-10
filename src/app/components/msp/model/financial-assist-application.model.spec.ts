import {FinancialAssistApplication, AssistanceApplicationType} from "./financial-assist-application.model";
import {AssistanceYear} from "./assistance-year.model";
import moment = require("moment");

describe('FinancialAssistApplication Component', () => {


  it('should return the correct application type and year properly', () => {

    let fixture = new FinancialAssistApplication();

    let thisYear:number = fixture.MostRecentTaxYear;
    let pre = thisYear;
    while(pre > thisYear - 6) {

      let assistYr: AssistanceYear = new AssistanceYear();
      assistYr.year = pre;
      assistYr.apply = false;

      fixture.assistYears.push(assistYr);

      pre--;
    }

    fixture.assistYears[0].apply = true;

    expect(fixture.getAssistanceApplicationType()).toBe(AssistanceApplicationType.CurrentYear,
      JSON.stringify(fixture.getMostRecentAppliedForTaxYears()));
    expect(fixture.getTaxYear()).toBe(moment().year() - 1);
    expect(fixture.numberOfTaxYears()).toBe(1);

    fixture.assistYears[1].apply = true;

    expect(fixture.getAssistanceApplicationType()).toBe(AssistanceApplicationType.PreviousTwoYears,
      JSON.stringify(fixture.getMostRecentAppliedForTaxYears()));
    expect(fixture.getTaxYear()).toBe(fixture.assistYears[0].year);
    expect(fixture.numberOfTaxYears()).toBe(2);

    fixture.assistYears[0].apply = false;
    expect(fixture.getAssistanceApplicationType()).toBe(AssistanceApplicationType.PreviousTwoYears,
      JSON.stringify(fixture.getMostRecentAppliedForTaxYears()));
    expect(fixture.getTaxYear()).toBe(fixture.assistYears[1].year);
    expect(fixture.numberOfTaxYears()).toBe(1);

    fixture.assistYears[0].apply = true;
    fixture.assistYears[2].apply = true;

    expect(fixture.getAssistanceApplicationType()).toBe(AssistanceApplicationType.MultiYear,
      JSON.stringify(fixture.getMostRecentAppliedForTaxYears()));
    expect(fixture.getTaxYear()).toBe(fixture.assistYears[0].year);
    expect(fixture.numberOfTaxYears()).toBe(3);

    fixture.assistYears[0].apply = false;

    expect(fixture.getAssistanceApplicationType()).toBe(AssistanceApplicationType.MultiYear,
      JSON.stringify(fixture.getMostRecentAppliedForTaxYears()));
    expect(fixture.getTaxYear()).toBe(fixture.assistYears[1].year);
    expect(fixture.numberOfTaxYears()).toBe(2);

  });

  it('should calculate the numDisabled', () => {

    let fixture = new FinancialAssistApplication();

    expect(fixture.numDisabled).toBe(0);
    fixture.selfDisabilityCredit = true;
    expect(fixture.numDisabled).toBe(1);
    fixture.spouseEligibleForDisabilityCredit = true;
    expect(fixture.numDisabled).toBe(2);
    fixture.childWithDisabilityCount = 0;
    expect(fixture.numDisabled).toBe(2);
    fixture.childWithDisabilityCount = 1;
    expect(fixture.numDisabled).toBe(3);
    fixture.childWithDisabilityCount = 2;
    expect(fixture.numDisabled).toBe(4);
  });

  it('should calculate the disabilityDeduction', () => {
    let fixture = new FinancialAssistApplication();

    expect(fixture.disabilityDeduction).toBe(0);
    fixture.applicantDisabilityCredit = 3000;
    expect(fixture.disabilityDeduction).toBe(3000);
    fixture.spouseDisabilityCredit = 3000;
    expect(fixture.disabilityDeduction).toBe(6000);
    fixture.childrenDisabilityCredit = 6000;
    expect(fixture.disabilityDeduction).toBe(12000);
  });
});
