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
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class AssistTransformService {
  private app: FinancialAssistApplication = this.dataSvc.finAssistApp;
  readonly ISO8601DateFormat = 'yyyy-MM-dd';
  listKeys(obj: Object) {
    return Object.keys(obj);
  }

  setKeys() {}

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
    const applicant = this.assistanceApplicant;

    const authorizedByApplicant = this.app.authorizedByApplicant ? 'Y' : 'N';

    const date = this.app.authorizedByApplicantDate;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    // console.log(date.getMonth());
    const month =
      date.getMonth() < 9 // off by 1 due to 0 indicing
        ? `0${(date.getMonth() + 1).toString()}`
        : (date.getMonth() + 1).toString();
    const year = date.getFullYear();

    const authorizedByApplicantDate = `${year}-${month}-${day}`;
    // console.log('authorization date', authorizedByApplicantDate);
    // TODO: schema updates required as not data for spouse object - POC set authorizedBySpouse based on whether spouse exists
    const authorizedBySpouse = this.app.hasSpouseOrCommonLaw ? 'Y' : 'N';
    return {
      applicant,
      authorizedByApplicant,
      authorizedByApplicantDate,
      authorizedBySpouse
    };
  }

  get assistanceApplicant(): AssistanceApplicantType {
    const app = this.app.applicant;
    const attachmentUuids = this.attachmentUuids as any;
    const birthDate =  format(this.app.applicant.dob, this.ISO8601DateFormat); //`${app.dobSimple.year.toString()}-${birthMonth}-${app.dobSimple.day.toString()}`;
    const financials = this.financials;
    const mailingAddress = this.mailingAddress;
    const name = this.name;
    const phn = app.previous_phn.replace(/ /g, '');
    const powerOfAttorney = this.app.hasPowerOfAttorney ? 'Y' : 'N';
    const sin = app.sin.replace(/ /g, '');
    const telephone = this.app.phoneNumber
      ? this.app.phoneNumber.replace(/[() +-]/g, '').slice(1)
      : undefined; // Must return undefined, not empty string, due to JSON Schema validation.
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
    const taxYear = `${this.app.getTaxYear()}`;
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
    const addr: AddressType = {
      addressLine1: this.app.mailingAddress.street,
      city: this.app.mailingAddress.city,
      provinceOrState: this.app.mailingAddress.province,
      country: this.app.mailingAddress.country,
      postalCode: this.app.mailingAddress.postal
    };

    if ( this.app.mailingAddress.addressLine2 ) {
      addr.addressLine2 = this.app.mailingAddress.addressLine2;
    }

    if ( this.app.mailingAddress.addressLine3 ) {
      addr.addressLine3 = this.app.mailingAddress.addressLine3;
    }
    return addr;
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
    for (const year of taxYears) {
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

    return attachments.map((itm, i) => {
      return {
        contentType: 'IMAGE_JPEG',
        attachmentDocumentType: 'SupportDocument',
        attachmentOrder: (i + 1).toString(),
        attachmentUuid: itm.uuid
      };
    });
  }

  get fileAttachments() {
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
    return attachments;
  }
  /**
   *           contentType: 'IMAGE_JPEG',
          attachmentDocumentType: 'ImmigrationDocuments',
          attachmentUuid: '4345678-f89c-52d3-a456-626655441236',
          attachmentOrder: '1',
          description: 'Foreign Birth Certificate'
   */

  calcAssistYearType(): AssistanceYearType {
    const date = new Date();
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
