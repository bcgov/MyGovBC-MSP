
import { FinancialAssistApplication } from './financial-assist-application.model';
import { AssistanceYear } from './assistance-year.model';
import { deepFlatten } from './assist-review-helpers';
import { MspPerson } from '../../../components/msp/model/msp-person.model';
import { format } from 'date-fns';

export interface IApplicantInformation {
  years: number[];
  name: string;
  birthDate: string;
  phn: string;
  sin: string;
  appDocuments: string;
  // spouseDocuments: string;
  getData?: () => IApplicantInformation;
}

export class ApplicantInformation implements IApplicantInformation {
  years: number[];
  name: string;
  birthDate: string;
  phn: string;
  sin: string;
  appDocuments: string;
  // spouseDocuments: string;
  getData(): IApplicantInformation {
    return {
      years: this.years,
      name: this.name,
      birthDate: this.birthDate,
      sin: this.sin,
      phn: this.phn,
      appDocuments: this.appDocuments
    };
  }

  pageStatus: any[];

  constructor(mspApp: FinancialAssistApplication) {
    const { ...app } = { ...mspApp };

    this.years = this.makeYears(app.assistYears);
    this.name = this.makeName(app.applicant);
    this.birthDate = format( app.applicant.dateOfBirth, 'dd/MM/yyyy');

    this.phn = app.applicant.previous_phn;
    this.sin = app.applicant.sin;
    const appDocuments = [];
    for (const year of app.assistYears) {
      const i = this.years.indexOf(year.year);
      if (i >= 0) {
        appDocuments.push(year.files);
      }
    }
    appDocuments.filter(itm => itm.length > 0);
    const docCount = deepFlatten(appDocuments).map(itm => itm.name).length;
    // .reduce((a, b) => `${a}, ${b}`);
    this.appDocuments = docCount > 1 ? `${docCount} files` : `${docCount} file`;

    this.pageStatus = app.pageStatus;
  }


  makeYears(years: AssistanceYear[]) {
    return years.filter(year => year.apply).map(year => year.year);
  }

  makeName(app: MspPerson) {

    const { firstName, middleName, lastName } = { ...app };
    const names = [firstName, middleName, lastName].filter(itm => itm);
    console.log( 'makeName: ', names );
    return names.length ? names.reduce((a, b) => `${a} ${b}`) : null;
  }
}
