import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AssistStateService } from '../services/assist-state.service';
// import { assistPages } from '../assist-page-routing.module';
import { environment } from 'environments/environment';
const bypass = environment.bypassGuards;
@Injectable({
  providedIn: 'root'
})
export class AssistGuard implements CanActivate {
  constructor(private stateSvc: AssistStateService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url = state.url.slice(12, state.url.length);
    // this.stateSvc.setAssistPages(assistPages);

    let index = this.stateSvc.findIndex(url);
    console.log('index', index);
    return bypass
      ? index === 0
        ? true
        : this.stateSvc.isValid(index - 1)
      : bypass;
  }
}
