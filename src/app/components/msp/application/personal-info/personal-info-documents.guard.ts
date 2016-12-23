import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class MspApplicationPersonalInfoGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if(this.compCheck.mspCheckEligibilityCompleted()){
            console.log(`passed MspApplicationPersonalInfoGuard eligibility completeness check, 
            can proceed to peronsal info and documents.`);
            return true;
        }else{
            console.log('Must complete check-eligibility step first.');
            this._router.navigate(['/msp/application/prepare']);
            return false;
        }
    }

}
