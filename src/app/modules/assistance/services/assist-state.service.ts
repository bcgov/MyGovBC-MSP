import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';
import { AssistTransformService } from './assist-transform.service';
import { ApiSendService } from 'app/modules/assistance/services/api-send.service';
import { ROUTES_ASSIST } from '../models/assist-route-constants';
import devOnlyConsoleLog from 'app/_developmentHelpers/dev-only-console-log';


@Injectable({
  providedIn: 'root'
})
export class AssistStateService {

  finAssistApp = this.dataSvc.finAssistApp;
  touched: Subject<boolean> = new Subject<boolean>();
  index: BehaviorSubject<number> = new BehaviorSubject(null);


  success$: BehaviorSubject<any> = new BehaviorSubject(null);
  failure$: BehaviorSubject<any> = new BehaviorSubject(null);
  submitted = false; // Do we need?
  response: any;


  constructor(
    private router: Router,
    public dataSvc: MspDataService,
    private xformSvc: AssistTransformService,
    private api: ApiSendService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((obs: any) => {
        this.setIndex( obs.url );
      });
  }

  setAssistPages(arr: Route[]) {
    if ( !this.finAssistApp.pageStatus.length ) {
      const routeConst = Object.keys( ROUTES_ASSIST ).map( x => ROUTES_ASSIST[x] );

      this.finAssistApp.pageStatus = arr
        .filter((itm: any) => !itm.redirectTo)
        .map((itm: any) => {
          const val = routeConst.find( x => x.path === itm.path );
          return {
            index: val.index,
            path: val.path,
            fullpath: val.fullpath,
            isComplete: false,
            isValid: false,
            btnLabel: val.btnLabel ? val.btnLabel : '',
            btnDefaultColor: val.btnDefaultColor
          };
        });
    }
  }

  findIndex( url: string ): number {
    let idx = 0;
    if ( this.finAssistApp.pageStatus ) {
      const obj = this.finAssistApp.pageStatus.find( x => url.includes(x.path) );
      if ( obj ) {
        idx = obj.index;
      }
    }
    return idx;
  }

  setIndex( path: string ) {
    const index = this.findIndex( path );
    this.index.next( index ? index : 1 );
  }

  setPageIncomplete( path: string ) {
    const obj = this.finAssistApp.pageStatus.find( x => path.includes(x.path) );
    if ( obj ) {
      obj.isComplete = false;
      // Set future pages to not complete
      this.finAssistApp.pageStatus.map( x => {
        if ( obj.index < x.index && x.isComplete ) {
          x.isComplete = false;
        }
      });
    }
  }

  setPageValid( path: string, valid: boolean ) {
    const obj = this.finAssistApp.pageStatus.find( x => path.includes(x.path) );
    if ( obj ) {
      obj.isValid = valid;
    }
  }

  isPageComplete( path: string ): boolean {
    let complete = false;
    const obj = this.finAssistApp.pageStatus .find( x => path.includes(x.path) );
    if ( obj ) {
      // Requirement to continue is the previous page is complete
      const prevIdx = obj.index - 1;
      complete = (prevIdx === 0 ? obj.isComplete : this.finAssistApp.pageStatus[prevIdx - 1].isComplete );
    }
    return complete;
  }

  async submitApplication() {
    const token = this.finAssistApp.authorizationToken;
    const attachments = this.xformSvc.fileAttachments;
    const app = this.xformSvc.application;
    try {
      //await this.api.sendFiles(token, app.uuid, attachments);
      const call = await this.api.sendApp(app, token, app.uuid, attachments);
      const res = await call.toPromise();
      this.response = res;
      const isSuccess =  this.response.op_return_code === 'SUCCESS';
      isSuccess
        ? (this.dataSvc.removeFinAssistApplication(), this.success$.next(res))
        : this.failure$.next(res);
      return res;
    } catch (err) {
      devOnlyConsoleLog( 'Error: ', err );
    }
  }
}
