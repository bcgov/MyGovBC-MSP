import { Injectable } from '@angular/core';
import { MspDataService } from 'app/services/msp-data.service';
import { FinancialAssistApplication } from '../models/financial-assist-application.model';

import {
  FinancialsType,
  AssistanceApplicantType,
  AssistanceYearType,
  AddressType,
  NameType,
  AssistanceApplicationType,
  MSPApplicationSchema
} from 'app/modules/msp-core/interfaces/i-api';

@Injectable({
  providedIn: 'root'
})
export class AssistTransformService {
  private app: FinancialAssistApplication = this.dataSvc.finAssistApp;

  constructor(private dataSvc: MspDataService) {}

  get application(): MSPApplicationSchema {
    const object = {
      assistanceApplication: this.assistanceApplication,
      attachments: this.attachments,
      uuid: this.app.uuid
    };

    return object;
  }

  get assistanceApplication(): AssistanceApplicationType {
    const applicant = this.assistanceApplicant as AssistanceApplicantType;

    const authorizedByApplicant = this.app.authorizedByApplicant ? 'Y' : 'N';
    console.log(
      'authorized by applicant date',
      this.app.authorizedByApplicantDate
    );
    let date = this.app.authorizedByApplicantDate;
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    console.log(date.getMonth());
    let month =
      date.getMonth() < 10
        ? `0${(date.getMonth() + 1).toString()}`
        : (date.getMonth() + 1).toString();
    let year = date.getFullYear();

    const authorizedByApplicantDate = `${month}-${day}-${year}`;
    console.log('authorization date', authorizedByApplicantDate);
    // TODO: still require authorized by spouse?
    const authorizedBySpouse = 'Y';
    return {
      applicant,
      authorizedByApplicant,
      authorizedByApplicantDate,
      authorizedBySpouse
    };
  }

  get assistanceApplicant(): AssistanceApplicantType {
    const app = this.app.applicant;
    let birthMonth =
      app.dobSimple.month < 10
        ? `0${app.dobSimple.month.toString()}`
        : app.dobSimple.month.toString();
    const attachmentUuids = this.attachmentUuids as any;
    const birthDate = `${birthMonth}-${app.dobSimple.day.toString()}-${app.dobSimple.year.toString()}`;
    const financials = this.financials;
    const mailingAddress = this.mailingAddress;
    const name = this.name;
    const phn = app.previous_phn.replace(/ /g, '');
    const powerOfAttorney = this.app.hasPowerOfAttorney ? 'Y' : 'N';
    const sin = app.sin.replace(/ /g, '');
    const telephone = this.app.phoneNumber
      ? this.app.phoneNumber.replace(/[() +-]/g, '')
      : '';
    return {
      attachmentUuids,
      birthDate,
      financials,
      mailingAddress,
      name,
      phn,
      powerOfAttorney,
      sin,
      telephone
    };
  }
  // TODO: half of these fields are no longer required
  get financials(): FinancialsType {
    const adjustedNetIncome = 0;
    const assistanceYear = this.calcAssistYearType();
    const childDeduction = 0;
    const deductions = 0;
    const netIncome = 0;
    // TODO: this is a string.. should be number? It's kind of counter-intuitive
    const numberOfTaxYears = this.app.numberOfTaxYears().toString();
    const sixtyFiveDeduction = 0;
    // TODO: does this makes sense as a string?
    const taxYear = `${this.app.MostRecentTaxYear}`;
    const totalDeductions = 0;
    const totalNetIncome = 0;
    return {
      adjustedNetIncome,
      assistanceYear,
      childDeduction,
      deductions,
      netIncome,
      numberOfTaxYears,
      sixtyFiveDeduction,
      taxYear,
      totalDeductions,
      totalNetIncome
    };
  }

  get mailingAddress(): AddressType {
    const addressLine1 = this.app.mailingAddress.addressLine1;
    const addressLine2 = this.app.mailingAddress.addressLine2;
    const addressLine3 = this.app.mailingAddress.addressLine3;
    const city = this.app.mailingAddress.city;
    const country = this.app.mailingAddress.country;
    const postalCode = this.app.mailingAddress.postal;
    const provinceOrState = this.app.mailingAddress.province;
    return {
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      country,
      postalCode,
      provinceOrState
    };
  }

  get name(): NameType {
    return {
      firstName: this.app.applicant.firstName,
      lastName: this.app.applicant.lastName,
      secondName: this.app.applicant.middleName
    };
  }

  get attachmentUuids() {
    const uuids = [];
    const [...taxYears] = this.app.assistYears.filter(year => year.apply);
    // console.log('tax years', taxYears);
    for (let year of taxYears) {
      if (year.files && year.files.length > 0) {
        year.files.forEach(itm => uuids.push(itm.uuid));
      }
      if (year.spouseFiles && year.spouseFiles.length > 0) {
        year.spouseFiles.forEach(itm => uuids.push(itm.uuid));
      }
    }
    // console.log('uuids', uuids);
    return uuids;
  }

  get attachments() {
    const attachments = [];
    const [...taxYears] = this.app.assistYears.filter(year => year.apply);
    for (let year of taxYears) {
      if (year.files && year.files.length > 0) {
        attachments.push(...year.files);
      }
      if (year.spouseFiles && year.spouseFiles.length > 0) {
        attachments.push(...year.spouseFiles);
      }
    }
    console.log('attachments', attachments);
    return attachments;
  }

  calcAssistYearType(): AssistanceYearType {
    const date = new Date();
    const taxYear = date.getFullYear();
    // const [...appliedYears] = this.app.assistYears.filter(year => year.apply);
    // if (!appliedYears) return null;
    // if (appliedYears.length === 1) {
    //   if (appliedYears[0].year === taxYear) {
    //     return AssistanceYearType['CurrentPA'];
    //   }
    //   if ((appliedYears[0].year = taxYear - 1)) {
    //     return AssistanceYearType['PreviousTwo'];
    //   }
    //   return AssistanceYearType['MultiYear'];
    // }
    // if (
    //   appliedYears.length === 2 &&
    //   appliedYears[0].year === taxYear &&
    //   appliedYears[1].year === taxYear - 1
    // ) {
    //   return AssistanceYearType['PreviousTwo'];
    // }
    return AssistanceYearType['MultiYear'];
  }
}
