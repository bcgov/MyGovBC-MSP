import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class MspApplicationAddressGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if(!this.compCheck.mspCheckEligibilityCompleted()){
            console.log('Must complete check-eligibility step first.');
            this._router.navigate(['/msp/application/prepare']);
            return false;
        }else {
            console.log(`passed MspApplicationAddressGuard personal info completeness check, 
            can proceed to contacts.`);
            return true;
        }
    }

}
