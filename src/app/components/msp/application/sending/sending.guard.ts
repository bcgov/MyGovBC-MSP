import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import CompletenessCheckService from '../../service/completeness-check.service';

@Injectable()
export class MspApplicationSendingGuard implements CanActivate {
  constructor(private _router: Router, private compCheck: CompletenessCheckService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(this.compCheck.mspSendingComplete()){
      console.log('has been sent, cannot activate');
      this._router.navigate(['/msp/application/confirmation']);
      return false;
    }else{
      console.log('sending not complete, can activate.');

      return true;
    }
  }

}
