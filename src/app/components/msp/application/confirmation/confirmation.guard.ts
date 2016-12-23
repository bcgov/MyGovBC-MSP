import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class MspApplicationConfirmationGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if(this.compCheck.mspReviewAndSubmitCompleted()){
            console.log(`passed MspApplicationConfirmationGuard completeness check, 
            can proceed to confirmation.`);
            return true;
        }else{
            console.log('Must complete review and submit step first.');
            this._router.navigate(['/msp/application/review']);
            return false;
        }
    }

}
