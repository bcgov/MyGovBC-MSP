import { Injectable } from '@angular/core';
import DataService from './msp-data.service';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';
import {MspApplication} from '../model/application.model';
import ValidtionService from './msp-validation.service';
import {Person} from '../model/person.model';

import * as _ from 'lodash';

@Injectable()
export default class CompletenessCheckService {
    private finApp:FinancialAssistApplication;
    private mspApp:MspApplication;
    constructor(private dataService: DataService,
        private validationService:ValidtionService) {
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


    validatePhnForEnrollmentApplication():boolean{
      let applicantValidPhn = true;
      let spouseValidPhn = true;
      let kidsValidPhn = true;
      
      applicantValidPhn = this.validationService.validatePHN(this.mspApp.applicant.previous_phn, true, !this.mspApp.phnRequired);
      if(this.mspApp.spouse){
        spouseValidPhn = this.validationService.validatePHN(this.mspApp.spouse.previous_phn, true, !this.mspApp.phnRequired);
      }

      kidsValidPhn = this.mspApp.children.reduce(
        (acc, current) => {
          if(acc){
            return this.validationService.validatePHN(current.previous_phn, true, !this.mspApp.phnRequired);
          }else{
            return acc;
          }
      }, true);
      return applicantValidPhn === true && spouseValidPhn === true && kidsValidPhn === true;
    }


    validatePhnForPremiumAssistance(): boolean{
      let applicantValidPhn = this.validationService.validatePHN(this.finApp.applicant.previous_phn, true, !this.finApp.phnRequired);
      let spouseValidPhn = true;
      if(this.finApp.hasSpouseOrCommonLaw){
        spouseValidPhn = this.validationService.validatePHN(this.finApp.spouse.previous_phn, true, !this.finApp.phnRequired);
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
      var hasValidSin = this.validateSinForPremiumAssistance();
      if(!hasValidSin){
        console.log('SIN not valid for spouse or applicant in PA');
      }
      

      if(!hasValidPhn){
        console.log('PHN not valid for spouse or applicant in PA');
      }

      return completed && hasValidPhn && hasValidSin;      
    }

    validateSinForPremiumAssistance():boolean{
      let applicantValidSin = this.validationService.validateSIN(this.finApp.applicant.sin);
      let spouseValidSin = true;

      if(this.finApp.hasSpouseOrCommonLaw){
        spouseValidSin = this.validationService.validateSIN(this.finApp.spouse.sin);
      }

      return applicantValidSin && spouseValidSin;
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

}