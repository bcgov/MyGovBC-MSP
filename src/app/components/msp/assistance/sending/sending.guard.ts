import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class MspFinancialAssistAppSendingGuard implements CanActivate {
  constructor(private _router: Router, private compCheck: CompletenessCheckService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let authorized = this.compCheck.finAppAuthorizationCompleted();
    if(!authorized){
        console.log('Please complete authorization.');
        this._router.navigate(['/msp/assistance/authorize-submit']);
        return false;
    }else{
        console.log('Authorized to send PA application.');
        return true;
    }
  }

}
