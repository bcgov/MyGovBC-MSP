import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class MspApplicationReviewGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
      let step1Complete = this.compCheck.mspCheckEligibilityCompleted();
      let step2Complete = this.compCheck.mspPersonalInfoDocsCompleted();
      let step3Complete = this.compCheck.mspContactInfoCompleted();
      
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
      }else{
        console.log('passed MspApplicationReviewGuard completeness check, can proceed.');
        return true;
      }
    }

}