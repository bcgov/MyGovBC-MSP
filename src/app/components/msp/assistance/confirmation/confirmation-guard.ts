import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class ConfirmationGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if(this.compCheck.finAppAuthorizationCompleted()){
            console.log('passed authorization completeness check, can proceed.');
            return true;
        }else{
            console.log('Must complete authorization step first.');
            this._router.navigate(['/msp/assistance/personal-info']);
            return false;
        }
    }

}
