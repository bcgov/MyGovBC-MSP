import { Injectable } from '@angular/core';
import { MspDataService } from './msp-data.service';
import { FinancialAssistApplication } from '../modules/assistance/models/financial-assist-application.model';

import { MspPerson } from '../components/msp/model/msp-person.model';

import * as _ from 'lodash';

@Injectable()
export class CompletenessCheckService {
  private get finApp(): FinancialAssistApplication {
    return this.dataService.finAssistApp;
  }

  constructor(private dataService: MspDataService) {}

  private isNumber(arg: any) {
    return _.isNumber(arg) || this.isStringBeParsedToNumber(arg);
  }

  /**
   * Is it a string that can be parsed to a number?
   */
  private isStringBeParsedToNumber(input: any) {
    const v = parseFloat(input);
    return _.isNumber(v);
  }

  finAppPrepCompleted(): boolean {
    const basics: boolean =
      this.isNumber(this.finApp.netIncomelastYear) &&
      this.finApp.netIncomelastYear >= 0 &&
      _.isBoolean(this.finApp.ageOver65) &&
      _.isBoolean(this.finApp.hasSpouseOrCommonLaw);

    let spouseInfo: boolean = true;
    if (basics) {
      if (this.finApp.spouseEligibleForDisabilityCredit) {
        spouseInfo = this.finApp.hasSpouseOrCommonLaw;
      }
      if (spouseInfo) {
        if (this.finApp.hasSpouseOrCommonLaw) {
          spouseInfo =
            this.isNumber(this.finApp.spouseIncomeLine236) &&
            this.finApp.spouseIncomeLine236 >= 0;
        }
      }
    }
    return basics === true && spouseInfo === true;
  }

  /* Common PHN validate PHN to ensure it is valid
    validatePhnForPremiumAssistance(): boolean{
      const applicantValidPhn = this.validationService.validatePHN(this.finApp.applicant.previous_phn, true, !this.finApp.phnRequired);
      let spouseValidPhn = true;
      if (this.finApp.hasSpouseOrCommonLaw){
        spouseValidPhn = this.validationService.validatePHN(this.finApp.spouse.previous_phn, true, !this.finApp.phnRequired);
      }

      return applicantValidPhn === true && spouseValidPhn === true;
    }
    */

  finAppPersonalInfoCompleted(): boolean {
    let completed = true;

    let basics =
      !_.isEmpty(this.finApp.applicant.firstName) &&
      !_.isEmpty(this.finApp.applicant.lastName) &&
      !!this.finApp.applicant.dob &&
      !_.isEmpty(this.finApp.applicant.previous_phn) &&
      !_.isEmpty(this.finApp.applicant.sin) &&
      this.finApp.mailingAddress.isValid &&
      this.finApp.phoneNumberIsValid;

    // Check applicant name regexs
    const regEx = new RegExp(MspPerson.NameRegEx);
    basics = basics && regEx.test(this.finApp.applicant.firstName);
    if (
      this.finApp.applicant.middleName &&
      this.finApp.applicant.middleName.length > 0
    ) {
      basics = basics && regEx.test(this.finApp.applicant.middleName);
    }
    basics = basics && regEx.test(this.finApp.applicant.lastName);

    if (this.finApp.hasSpouseOrCommonLaw === true) {
      // Check spouses name regexs

      completed =
        basics &&
        !_.isEmpty(this.finApp.spouse.firstName) &&
        !_.isEmpty(this.finApp.spouse.lastName) &&
        !_.isEmpty(this.finApp.spouse.sin);

      completed = completed && regEx.test(this.finApp.spouse.firstName);
      if (
        this.finApp.spouse.middleName &&
        this.finApp.spouse.middleName.length > 0
      ) {
        completed = completed && regEx.test(this.finApp.spouse.middleName);
      }
      completed = completed && regEx.test(this.finApp.spouse.lastName);
    } else {
      completed = basics;
    }

    // Common Sin & Phn do in-line validation to ensure validity
    // const hasValidPhn = this.validatePhnForPremiumAssistance();
    //const hasValidSin = this.validateSinForPremiumAssistance();
    /*
      if (!hasValidSin){
        console.log('SIN not valid for spouse or applicant in PA');
      }


      if (!hasValidPhn){
        console.log('PHN not valid for spouse or applicant in PA');
      }*/

    return completed; //&& hasValidPhn && hasValidSin;
  }
  /*
    validateSinForPremiumAssistance(): boolean{
      const applicantValidSin = this.validationService.validateSIN(this.finApp.applicant.sin);
      let spouseValidSin = true;

      if (this.finApp.hasSpouseOrCommonLaw){
        spouseValidSin = this.validationService.validateSIN(this.finApp.spouse.sin);
      }

      return applicantValidSin && spouseValidSin;
    }
    */

  finAppReviewCompleted(): boolean {
    return true;
  }


  finAppAuthorizationCompleted(): boolean {
    const familyAuth =
      this.finApp.authorizedByApplicant &&
      ((this.finApp.hasSpouseOrCommonLaw && this.finApp.authorizedBySpouse) ||
        !this.finApp.hasSpouseOrCommonLaw);


    if (!familyAuth) {
      // console.log('PA application not authorized by applicant and spouse');
    } else {
      // console.log('PA application authorized by applicant and spouse');
    }
    const attorneyAUth =
      this.finApp.authorizedByAttorney &&
      this.finApp.powerOfAttorneyDocs.length > 0;
    if (!attorneyAUth) {
      // console.log('PA application not authorized by attorney');
    } else {
      // console.log('PA application authorized by attorney');
    }
    if (this.finApp.authorizationToken == null) return false;

    return familyAuth === true || attorneyAUth === true;
  }
}
