import { Injectable } from '@angular/core';
import { ROUTES_ENROL } from '../models/enrol-route-constants';
import { PageStateService } from '../../../services/page-state.service';
import { environment } from '../../../../environments/environment';
import { AbstractPgCheckService } from 'moh-common-lib';
import { EnrolDataService } from './enrol-data.service';

@Injectable({
  providedIn: 'root'
})
export class GuardEnrolService implements AbstractPgCheckService {

  constructor( private pageStateService: PageStateService,
               private dataService: EnrolDataService ) { }

 public canBypassGuards(): boolean {
   return environment.bypassGuards;
 }

 public isPageComplete( url: string ): boolean {
   const complete = this.pageStateService.isPageComplete( url, this.dataService.pageStatus );
   console.log( 'isPageCompelete: ', complete );
   return complete;
 }

 public isPrerequisiteComplete(): boolean {
   return true;
 }

 public getStartUrl(): string {
   return ROUTES_ENROL.CHECK_ELIG.fullpath;
 }
}
