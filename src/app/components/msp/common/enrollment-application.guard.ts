import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../service/completeness-check.service';

@Injectable()
export class MspEnrollmentApplicationGuard{
    steps: EnrollmentGuardCheckResult[];
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
      this.steps = [
        {
          stepName: 'Personal Info',
          stepUrl: '/msp/application/prepare',
          functionPipe: [this.compCheck.mspCheckEligibilityCompleted]
        },
        {
          stepName: 'Contact Info',
          stepUrl: '/msp/application/personal-info',
          functionPipe: [this.compCheck.mspPersonalInfoDocsCompleted]
          
        },
        {
          stepName: 'Review & Submit',
          stepUrl: '/msp/application/address',
          functionPipe: [this.compCheck.mspContactInfoCompleted]
        },
        {
          stepName: 'Review & Submit',
          stepUrl: '/msp/application/review',
          functionPipe: [this.compCheck.mspReviewAndSubmitCompleted]
        }
      ];
    }


    guardStep(step:number){
      for(let i = 0; i <= step; i++){
        this.steps[i].functionPipe.reduce(
          function(acc, curVal, index, array){
            if(acc === true){
              return curVal.apply([]);
            }

          }, true);
      }
    }

    allStepsCheck(): this {
      let step1Complete = this.compCheck.mspCheckEligibilityCompleted();
      let step2Complete = this.compCheck.mspPersonalInfoDocsCompleted();
      let step3Complete = this.compCheck.mspContactInfoCompleted();
      let step4Complete = this.compCheck.mspReviewAndSubmitCompleted();

      if(!step1Complete || !step2Complete || !step3Complete || !step4Complete){
        console.log('There are missing informaion on the application. Return user to first step');
        this._router.navigate(['/msp/application']);
        return this;
      }
    }

}

export interface EnrollmentGuardCheckResult {
  stepName:string;

  // url to redirect the user to if the function pipe returns a falsy value.
  stepUrl:string;
  functionPipe: Function[] 
}
