import { FinancialAssistApplication } from './financial-assist-application.model';
import { AssistanceYear } from './assistance-year.model';
import { deepFlatten } from './assist-review-helpers';

export interface ISpouseInformation {
  years: number[];
  documents: string;
}

export class SpouseInformation implements ISpouseInformation {
  years: number[];
  documents: string;
  constructor(mspApp: FinancialAssistApplication) {
    const { ...app } = { ...mspApp };
    const spouseDocuments = [];

    for (let year of app.assistYears) {
      this.years = this.makeYears(app.assistYears);

      let i = this.years.indexOf(year.year);
      if (i >= 0) {
        spouseDocuments.push(year.spouseFiles);
      }
      // console.log('index of ', test);
    }
    this.documents = deepFlatten(spouseDocuments)
      .map(itm => itm.name)
      .reduce((a, b) => `${a}, ${b}`);
  }
  makeYears(years: AssistanceYear[]) {
    return years.filter(year => year.hasSpouse).map(year => year.year);
  }
}
