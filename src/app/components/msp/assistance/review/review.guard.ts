import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class ReviewGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if(this.compCheck.finAppPersonalInfoCompleted()){
            console.log('passed personal-info completeness check, can proceed.');
            return true;
        }else{
            console.log('Must complete personal-info step first.');
            this._router.navigate(['/msp/assistance/personal-info']);
            return false;
        }
    }

}
