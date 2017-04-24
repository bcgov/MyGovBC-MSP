import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class MspApplicationSendingGuard implements CanActivate {
  constructor(private _router: Router, private compCheck: CompletenessCheckService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let step1Complete = this.compCheck.mspCheckEligibilityCompleted();
    let step2Complete = this.compCheck.mspPersonalInfoDocsCompleted();
    let step3Complete = this.compCheck.mspContactInfoCompleted();
    let step4Complete = this.compCheck.mspReviewAndSubmitCompleted();

    if(!step1Complete){
      console.log('There are missing informaion in step 1.');
      this._router.navigate(['/msp/application/prepare']);
      return false;
    }
    if(!step2Complete){
      console.log('There are missing informaion in step 2.');
      this._router.navigate(['/msp/application/personal-info']);
      return false;
    }
    if(!step3Complete){
      console.log('There are missing informaion in step 3.');
      this._router.navigate(['/msp/application/address']);
      return false;
    }
    if(!step4Complete){
      console.log('There are missing informaion in step 3.');
      this._router.navigate(['/msp/application/review']);
      return false;
    }

    let authorized = this.compCheck.mspApplicationAuthorizedByUser();
    let validAuthToken = this.compCheck.mspApplicationValidAuthToken();

    if(validAuthToken){
      console.log('Sending guard sees valid auth token.');
    }
    if(authorized){
      console.log('Sending guard sees users have authorized to submit this application.');
    }

    if(authorized && validAuthToken){
      console.log('All preconditions for sumbmitting EA are met, sending guard is allowing app activating/transitioning into sending state.');
      return true;
    }else if(!authorized){
      console.log('This enrollment application has not been authorized by user(s), cannot activate sending route again.');
      this._router.navigate(['/msp/application/review']);
      return false;
    }else if(!validAuthToken){
      console.log('Not a valid auth token, cannot activate sending route.');
      this._router.navigate(['/msp/application/review']);
      return false;
    }
  }

}
