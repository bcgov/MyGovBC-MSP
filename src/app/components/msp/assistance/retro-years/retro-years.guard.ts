import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class RetroYearsGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return true;
        // if(this.compCheck.mspContactInfoCompleted()){
        //     console.log('passed MspApplicationReviewGuard completeness check, can proceed.');
        //     return true;
        // }else{
        //     console.log('Must complete address/contact step first.');
        //     this._router.navigate(['/msp/application/address']);
        //     return false;
        // }
    }

}
