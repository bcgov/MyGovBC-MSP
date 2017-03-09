import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';
import {MspEnrollmentApplicationGuard} from '../../common/enrollment-application.guard';
@Injectable()
export class MspApplicationReviewGuard extends MspEnrollmentApplicationGuard {

    canActivate(route: ActivatedRouteSnapshot): boolean {
      let step1Complete = this.compCheck.mspCheckEligibilityCompleted();
      let step2Complete = this.compCheck.mspPersonalInfoDocsCompleted();
      let step3Complete = this.compCheck.mspContactInfoCompleted();
      let step4Complete = this.compCheck.mspReviewAndSubmitCompleted();

      if(!step1Complete || !step2Complete || !step3Complete || !step4Complete){
        console.log('There are missing informaion on the application. Return user to first step');
        this._router.navigate(['/msp/application']);
        return false;
      }


      if(this.compCheck.mspContactInfoCompleted()){
          console.log('passed MspApplicationReviewGuard completeness check, can proceed.');
          return true;
      }else{
          console.log('Must complete address/contact step first.');
          this._router.navigate(['/msp/application/address']);
          return false;
      }
    }

}
