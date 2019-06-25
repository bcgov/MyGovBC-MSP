import {
  MspApplication,
  MspPerson
} from 'app/modules/enrolment/models/application.model';
import { FinancialAssistApplication } from './financial-assist-application.model';
import { SimpleDate } from 'moh-common-lib';
import { AssistanceYear } from './assistance-year.model';

export interface IApplicantInformation {
  years: number[];
  name: string;
  birthDate: string;
  phn: string;
  sin: string;
  appDocuments: string;
  spouseDocuments: string;
  getData: () => IApplicantInformation;
}

export class ApplicantInformation implements IApplicantInformation {
  years: number[];
  name: string;
  birthDate: string;
  phn: string;
  sin: string;
  appDocuments: string;
  spouseDocuments: string;
  getData: () => IApplicantInformation;

  constructor(mspApp: FinancialAssistApplication) {
    const { ...app } = { ...mspApp };
    const deepFlatten = arr =>
      [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));

    this.years = this.makeYears(app.assistYears);
    this.name = this.makeName(app.applicant);

    this.birthDate = this.makeDate(app.applicant.dateOfBirth);
    this.phn = app.applicant.previous_phn;
    this.sin = app.applicant.sin;
    const appDocuments = [];
    const spouseDocuments = [];
    for (let year of app.assistYears) {
      let i = this.years.indexOf(year.year);
      if (i >= 0) {
        appDocuments.push(year.files);
        spouseDocuments.push(year.spouseFiles);
      }
      // console.log('index of ', test);
    }
    appDocuments.filter(itm => itm.length > 0);
    this.appDocuments = deepFlatten(appDocuments)
      .map(itm => itm.name)
      .reduce((a, b) => `${a}, ${b}`);

    this.spouseDocuments = deepFlatten(appDocuments)
      .map(itm => itm.name)
      .reduce((a, b) => `${a}, ${b}`);
    console.log('files', this.appDocuments);
  }

  makeDate(date: SimpleDate) {
    return `${date.day}/${date.month}/${date.year}`;
  }

  makeYears(years: AssistanceYear[]) {
    return years.filter(year => year.apply).map(year => year.year);
  }

  makeName(app: MspPerson) {
    const { firstName, middleName, lastName } = { ...app };
    return [firstName, middleName, lastName]
      .filter(itm => itm)
      .reduce((a, b) => `${a} ${b}`);
  }
}
