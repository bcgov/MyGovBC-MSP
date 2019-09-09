import { Injectable } from '@angular/core';
import { AssistStateService } from '../services/assist-state.service';
import { environment } from 'environments/environment';
import { ROUTES_ASSIST } from '../models/assist-route-constants';
import { AbstractPgCheckService } from 'moh-common-lib';

@Injectable({
  providedIn: 'root'
})
export class AssistGuard implements AbstractPgCheckService {

  constructor( private stateSvc: AssistStateService ) {}

  public canBypassGuards(): boolean {
    return environment.bypassGuards;
  }

  public isPageComplete( url: string ): boolean {
    const complete = this.stateSvc.isPageComplete( url );
    return complete;
  }

  public isPrerequisiteComplete(): boolean {
    return true;
  }

  public getStartUrl(): string {
    return ROUTES_ASSIST.HOME.fullpath;
  }
}
