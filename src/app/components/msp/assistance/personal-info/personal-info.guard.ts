import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';
import CompletenessCheckService from '../../service/completeness-check.service';
import * as _ from 'lodash';

@Injectable()
export class PersonalInfoGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if(this.compCheck.finAppPrepCompleted()){
            console.log('passed preparation completeness check, can proceed.');
            return true;
        }else{
            console.log('Must complete preparation step first.');
            this._router.navigate(['/msp/assistance/prepare']);
            return false;
        }
    }

}
