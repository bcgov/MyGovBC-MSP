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
    console.log( 'AssistGuard: canBypassGuards ', environment.bypassGuards );
    return environment.bypassGuards;
  }

  public isPageComplete( url: string ): boolean {
    console.log( 'AssistGuard: isPageComplete', url );
    return this.stateSvc.isPageComplete( url );
  }
  public isPrerequisiteComplete(): boolean {
    console.log( 'AssistGuard: isPrerequisiteComplete' );
    return true;
  }
  public getStartUrl(): string {
    console.log( 'getStartUrl: isPrerequisiteComplete' );
    return ROUTES_ASSIST.HOME.fullpath;
  }
}
