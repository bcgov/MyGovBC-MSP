import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class RetroYearsGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let isComplete = this.compCheck.finAppPersonalInfoCompleted();
        if(!isComplete){
            console.log('Personal info not completed, must complete personal-info screen first.')
            this._router.navigate(['/msp/assistance/personal-info']);
            return false;
        }else {
            // console.log('Personal info completed, can proceed to previous years screen.')
            return true;
        }
    }

}
