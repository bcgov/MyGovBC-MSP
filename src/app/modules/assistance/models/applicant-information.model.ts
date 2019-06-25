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
    this.years = this.makeYears(app.assistYears);
    this.name = this.makeName(app.applicant);

    this.birthDate = this.makeDate(app.applicant.dateOfBirth);
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
