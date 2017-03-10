import { Injectable } from '@angular/core';
import DataService from './msp-data.service';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';
import {MspApplication} from '../model/application.model';
import {Person} from '../model/person.model';

import * as _ from 'lodash';

@Injectable()
export default class CompletenessCheckService {
    private finApp:FinancialAssistApplication;
    private mspApp:MspApplication;
    constructor(private dataService: DataService) {
        this.finApp = this.dataService.finAssistApp;
        this.mspApp = this.dataService.getMspApplication();
    }

    private isNumber(arg:any){
      return _.isNumber(arg) || this.isStringBeParsedToNumber(arg);
    }

    /**
     * Is it a string that can be parsed to a number?
     */
    private isStringBeParsedToNumber(input:any){
      let v = parseFloat(input);
      return _.isNumber(v);
    }
    /**
     * 
     */
    mspCheckEligibilityCompleted(){
      // fill in logic to ensure all data expected on check eligibility screen have been 
      // provided. (check saved data in local storage)
      return _.isBoolean(this.mspApp.applicant.liveInBC)
      && _.isBoolean(this.mspApp.unUsualCircumstance) 
      && _.isBoolean(this.mspApp.applicant.plannedAbsence) 
      && (this.mspApp.infoCollectionAgreement === true);
    }

    mspPersonalInfoDocsCompleted(){
      let complete = this.mspApp.applicant.isInfoComplete;      
      // console.log('applicant info complete: ' + complete);

      if(this.mspApp.spouse){
        complete = complete && this.mspApp.spouse.isInfoComplete;
        // console.log('applicant and spouse info complete: ' + complete);
      }

      if(complete){
        let infoCompletedChildren:Person[] = this.mspApp.children.filter( ch => {
          return ch.isInfoComplete;
        });

        // console.log(infoCompletedChildren.length + ' out of ' + this.mspApp.children.length
        //   + ' children\'s information are completed.')

        complete = (infoCompletedChildren.length === this.mspApp.children.length);
      }

      let familyHasValidPhn = this.validatePhnForEnrollmentApplication();
      if(!familyHasValidPhn){
        // console.log('PHN not valid for a member of the family in enrollment application');
      }
      return complete === true && familyHasValidPhn === true;
    }

    mspContactInfoCompleted(){
      let valid = _.isBoolean(this.mspApp.mailingSameAsResidentialAddress) && this.mspApp.residentialAddress.isValid 
      if(!this.mspApp.mailingSameAsResidentialAddress){
        valid = valid && this.mspApp.mailingAddress.isValid;
      }
      return valid;
    }

    mspReviewAndSubmitCompleted(){
      return true;
    }

    mspApplicationAuthorizedByUser() {
      return !(!this.mspApp.authorizedByApplicant || (this.mspApp.spouse && !this.mspApp.authorizedBySpouse));
    }

    mspApplicationValidAuthToken() {
      return this.mspApp.hasValidAuthToken;
    }
    mspSendingComplete() {
      // if we have a reference number, we are complete
      if (this.mspApp.referenceNumber &&
          this.mspApp.referenceNumber.length > 0) {
        return true;
      }
      return false;
    }

    finAppPrepCompleted():boolean{
        let basics:boolean = this.isNumber(this.finApp.netIncomelastYear) && 
        this.finApp.netIncomelastYear >= 0 &&
        _.isBoolean(this.finApp.ageOver65) &&
        _.isBoolean(this.finApp.hasSpouseOrCommonLaw);
        
        let spouseInfo:boolean = true;
        if(basics){
            if(this.finApp.spouseEligibleForDisabilityCredit){
              spouseInfo = this.finApp.hasSpouseOrCommonLaw;
            }
            if(spouseInfo){
              if(this.finApp.hasSpouseOrCommonLaw){
                  spouseInfo = this.isNumber(this.finApp.spouseIncomeLine236) &&
                  this.finApp.spouseIncomeLine236 >= 0;
              }
            }
        }
        return basics === true && spouseInfo === true;
    }


    validatePhnForEnrollmentApplication(){
      let applicantValidPhn = true;
      let spouseValidPhn = true;
      let kidsValidPhn = true;
      
      applicantValidPhn = this.validatePHN(this.mspApp.applicant.previous_phn, true, !this.mspApp.phnRequired);
      if(this.mspApp.spouse){
        spouseValidPhn = this.validatePHN(this.mspApp.spouse.previous_phn, true, !this.mspApp.phnRequired);
      }

      kidsValidPhn = this.mspApp.children.reduce(
        (acc, current) => {
          if(acc){
            return this.validatePHN(current.previous_phn, true, !this.mspApp.phnRequired);
          }else{
            return acc;
          }
      }, true);
      return applicantValidPhn === true && spouseValidPhn === true && kidsValidPhn === true;
    }


    validatePhnForPremiumAssistance(): boolean{
      let applicantValidPhn = this.validatePHN(this.finApp.applicant.previous_phn, true, !this.finApp.phnRequired);
      let spouseValidPhn = true;
      if(this.finApp.hasSpouseOrCommonLaw){
        spouseValidPhn = this.validatePHN(this.finApp.spouse.previous_phn, true, !this.finApp.phnRequired);
      }

      return applicantValidPhn === true && spouseValidPhn === true;
    }
    
    finAppPersonalInfoCompleted():boolean {
      let completed = true;

      let basics = !_.isEmpty(this.finApp.applicant.firstName)
        && !_.isEmpty(this.finApp.applicant.lastName)
        && _.isNumber(this.finApp.applicant.dob_day)
        && !_.isEmpty(this.finApp.applicant.dob_month)
        && _.isNumber(this.finApp.applicant.dob_year)
        && !_.isEmpty(this.finApp.applicant.previous_phn)
        && !_.isEmpty(this.finApp.applicant.sin)
        && this.finApp.mailingAddress.isValid
        && !(this.finApp.applicant.dob_month == 0);

      if(this.finApp.hasSpouseOrCommonLaw === true){
        completed = basics && !_.isEmpty(this.finApp.spouse.firstName)
        && !_.isEmpty(this.finApp.spouse.lastName)
        && !_.isEmpty(this.finApp.spouse.sin)
      }else{
        completed = basics;
      }  

      var hasValidPhn = this.validatePhnForPremiumAssistance();

      if(!hasValidPhn){
        console.log('PHN not valid for spouse or applicant in PA');
      }

      return completed === true && hasValidPhn === true;      
    }

    finAppReviewCompleted():boolean {
      return true;
    }

    finAppAuthorizationCompleted():boolean {
      let familyAuth = (this.finApp.authorizedByApplicant &&
        (this.finApp.hasSpouseOrCommonLaw && this.finApp.authorizedBySpouse || !this.finApp.hasSpouseOrCommonLaw));

      if(!familyAuth){
        // console.log('PA application not authorized by applicant and spouse');
      }else{
        // console.log('PA application authorized by applicant and spouse');
      }  
      let attorneyAUth = this.finApp.authorizedByAttorney && this.finApp.powerOfAttorneyDocs.length > 0;
      if(!attorneyAUth){
        // console.log('PA application not authorized by attorney');
      }else{
        // console.log('PA application authorized by attorney');
      }
      if (this.finApp.authorizationToken == null) return false;

      return familyAuth === true || attorneyAUth === true;
    }

    /**
     * 
     * @param phn Empty value (null, undefined, empty string) are treated as invalid.
     * @param isBCPhn 
     */
  validatePHN (phn: string, isBCPhn:boolean = true, allowEmptyValue:boolean = false): boolean {
    // pre req checks
    if (phn === null || phn === undefined || phn.trim().length < 1){
      return allowEmptyValue;      
    }

    // Init weights and other stuff
    let weights:number[] = [-1, 2, 4, 8, 5, 10, 9, 7, 3, -1];
    let sumOfRemainders = 0;

    // Clean up string
    phn = phn.trim();

    // Rip off leading zeros with a regex
    let regexp = new RegExp('^0+');
    phn = phn.replace(regexp, "");

    // Test for length
    if (phn.length != 10) {
      return false;
    }
    // Look for a number that starts with 9 if BC only
    if (isBCPhn &&
      phn[0] != '9') {
      return false;
    }
    // Number cannot have 9
    else if (!isBCPhn &&
      phn[0] == '9') {
        return false;
    }

    // Walk through each character
    for (let i = 0; i < phn.length; i++) {

      // pull out char
      let char = phn.charAt(i);

      // parse the number
      let num = Number(char);
      if (Number.isNaN(num)) return false;

      // Only use the multiplier if weight is greater than zero
      let result = 0;
      if (weights[i] > 0) {
        // multiply the value against the weight
        result = num * weights[i];

        // divide by 11 and save the remainder
        result = result % 11;

        // add it to our sum
        sumOfRemainders += result;
      }
    }

    // mod by 11
    let checkDigit = 11 - (sumOfRemainders % 11);

    // if the result is 10 or 11, it is an invalid PHN
    if (checkDigit === 10 || checkDigit === 11) return false;

    // Compare against 10th digit
    let finalDigit = Number(phn.substring(9,10));
    if (checkDigit !== finalDigit) return false;

    // All done!
    return true;
  }    
}