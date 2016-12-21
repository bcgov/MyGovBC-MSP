import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable()
export class PersonalInfoGuard implements CanActivate {

    constructor(private _router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        console.log('PersonalInfoGuard engaged.');
        this._router.navigate(['/msp/assistance/prepare']);
        return false;
    }
}
