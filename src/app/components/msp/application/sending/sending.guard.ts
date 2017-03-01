import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class MspApplicationSendingGuard implements CanActivate {
  constructor(private _router: Router, private compCheck: CompletenessCheckService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let authorized = this.compCheck.mspApplicationAuthorizedByUser();
    let validAuthToken = this.compCheck.mspApplicationValidAuthToken();
    let sent = this.compCheck.mspSendingComplete();

    if(sent){
      console.log('This enrollment application has been previously submitted, cannot activate sending route again.');
    }
    if(!authorized ){
      console.log('This enrollment application has not been authorized by user(s), cannot activate sending route again.');
    }
    if(!validAuthToken){
      console.log('Not valid auth token found, cannot activate sending route again.');
    }

    if(!authorized || sent || !validAuthToken){
      this._router.navigate(['/msp/application/confirmation']);
      return false;
    }else{
      console.log('sending not complete, can activate.');

      return true;
    }
  }

}
