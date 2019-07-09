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
  getData(): ISpouseInformation {
    return {
      years: this.years,
      documents: this.documents
    };
  }
  constructor(mspApp: FinancialAssistApplication) {
    const { ...app } = { ...mspApp };
    const spouseDocuments = [];

    for (let year of app.assistYears) {
      this.years = this.makeYears(app.assistYears);

      let i = this.years.indexOf(year.year);
      if (i >= 0) {
        spouseDocuments.push(year.spouseFiles);
      }
    }
    const docCount = deepFlatten(spouseDocuments).map(itm => itm.name).length;
    // .reduce((a, b) => `${a}, ${b}`);
    this.documents = docCount > 1 ? `${docCount} files` : `${docCount} file`;
  }
  makeYears(years: AssistanceYear[]) {
    return years.filter(year => year.hasSpouse).map(year => year.year);
  }
}
