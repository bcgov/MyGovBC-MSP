import {FinancialAssistApplication, AssistanceApplicationType} from "./financial-assist-application.model";
import {AssistanceYear} from "./assistance-year.model";
import moment = require("moment");

describe('FinancialAssistApplication Component', () => {


  it('should return the correct application type and year properly', () => {

    let fixture = new FinancialAssistApplication();

    let thisYear:number = moment().year();
    let pre = thisYear;
    while(--pre > thisYear - 7) {

      let assistYr: AssistanceYear = new AssistanceYear();
      assistYr.year = pre;
      assistYr.apply = false;

      fixture.assistYears.push(assistYr);
    }

    expect(fixture.getAssistanceApplicationType()).toBe(AssistanceApplicationType.CurrentYear,
      JSON.stringify(fixture.getMostRecentAppliedForTaxYears()));
    expect(fixture.getTaxYear()).toBe(moment().year());

    fixture.assistYears[0].apply = true;

    expect(fixture.getAssistanceApplicationType()).toBe(AssistanceApplicationType.PreviousTwoYears,
      JSON.stringify(fixture.getMostRecentAppliedForTaxYears()));
    expect(fixture.getTaxYear()).toBe(moment().year());

    fixture.assistYears[1].apply = true;

    expect(fixture.getAssistanceApplicationType()).toBe(AssistanceApplicationType.MultiYear,
      JSON.stringify(fixture.getMostRecentAppliedForTaxYears()));
    expect(fixture.getTaxYear()).toBe(moment().year());

  });
});
