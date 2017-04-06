import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class ConfirmationGuard implements CanActivate {
    constructor(private _router: Router, private compCheck: CompletenessCheckService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return true;
    }

}
