import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class MspApplicationAddressGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if(this.compCheck.mspPersonalInfoDocsCompleted()){
            console.log(`passed MspApplicationAddressGuard personal info completeness check, 
            can proceed to contacts.`);
            return true;
        }else{
            console.log('Must complete personal info and documents step first.');
            this._router.navigate(['/msp/application/personal-info']);
            return false;
        }
    }

}
