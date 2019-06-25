import { MspApplication } from 'app/modules/enrolment/models/application.model';
import { FinancialAssistApplication } from './financial-assist-application.model';
import { SimpleDate } from 'moh-common-lib';

export interface IApplicantInformation {
  years: number[];
  name: string;
  birthDate: string;
  phn: string;
  sin: string;
  documents: string[];
  getData: () => IApplicantInformation;
}

export class ApplicantInformation implements IApplicantInformation {
  years: number[];
  name: string;
  birthDate: string;
  phn: string;
  sin: string;
  documents: string[];
  getData: () => IApplicantInformation;

  constructor(mspApp: FinancialAssistApplication) {
    const { ...app } = { ...mspApp };
    this.years = app.assistYears
      .filter(year => year.apply)
      .map(year => year.year);
    // .reduce((a, b) => `${a}, ${b}`);

    const { firstName, middleName, lastName } = { ...app.applicant };
    this.name = [firstName, middleName, lastName]
      .filter(itm => itm)
      .reduce((a, b) => `${a} ${b}`);
    // this.birthDate = app.applicant.dateOfBirth;
    // console.log(name);
    this.birthDate = this.makeDate(app.applicant.dateOfBirth);
    console.log(this.birthDate);
  }

  makeDate(date: SimpleDate) {
    // if (!date.day) return;
    return `${date.day}/${date.month}/${date.year}`;
    // let newDate = new Date(date.month, date.);
    // console.log('dates', newDate);
    // let val = dates.reduce((prev, curr) => prev + curr);
    // console.log('dates', val);
  }
}
