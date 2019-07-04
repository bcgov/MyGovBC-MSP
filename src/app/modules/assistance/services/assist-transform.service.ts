import { Injectable } from '@angular/core';
import { MspDataService } from 'app/services/msp-data.service';
import { FinancialAssistApplication } from '../models/financial-assist-application.model';

import {
  FinancialsType,
  AssistanceApplicantType,
  AssistanceYearType,
  AddressType,
  NameType,
  AssistanceApplicationType
} from 'app/modules/msp-core/interfaces/i-api';

@Injectable({
  providedIn: 'root'
})
export class AssistTransformService {
  app: FinancialAssistApplication = this.dataSvc.finAssistApp;

  constructor(private dataSvc: MspDataService) {}

  get assistanceApplication(): AssistanceApplicationType {
    const applicant = this.assistanceApplicant as AssistanceApplicantType;

    const authorizedByApplicant = this.app.authorizedByApplicant ? 'Yes' : 'No';
    const authorizedByApplicantDate = this.app.authorizedByApplicantDate.toString();
    // TODO: still require authorized by spouse?
    const authorizedBySpouse = 'Yes';
    return {
      applicant,
      authorizedByApplicant,
      authorizedByApplicantDate,
      authorizedBySpouse
    };
  }

  get assistanceApplicant(): AssistanceApplicantType {
    const app = this.app.applicant;
    const attachmentUuids = null;
    const birthDate = `${app.dob_month}-${app.dob.day}-${app.dob.year}`;
    const financials = this.financials;
    const mailingAddress = this.mailingAddress;
    const name = this.name;
    const phn = '';
    const powerOfAttorney = '';
    const SIN = '';
    const telephone = '';
    return {
      attachmentUuids,
      birthDate,
      financials,
      mailingAddress,
      name,
      phn,
      powerOfAttorney,
      SIN,
      telephone
    };
  }
  // TODO: half of these fields are no longer required
  get financials(): FinancialsType {
    const adjustedNetIncome = 0;
    // TODO: write function to convert the tax years to the correct format
    const assistanceYear = AssistanceYearType['CurrentPA'];
    const childDeduction = 0;
    const deductions = 0;
    const netIncome = 0;
    // TODO: this is a string.. should be number? It's kind of counter-intuitive
    const numberOfTaxYears = this.app.numberOfTaxYears().toString();
    const sixtyFiveDeduction = 0;
    // TODO: does this makes sense as a string?
    const taxYear = this.app.MostRecentTaxYear.toString();
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
}
