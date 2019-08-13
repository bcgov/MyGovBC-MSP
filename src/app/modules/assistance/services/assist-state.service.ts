import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';
import { validateBirthdate } from 'app/modules/msp-core/models/validate-birthdate';
import { validateContact } from 'app/modules/msp-core/models/validate-contact';
import { AssistTransformService } from './assist-transform.service';
import { SchemaService } from 'app/services/schema.service';
import { ApiSendService } from 'app/modules/benefit/services/api-send.service';
import { ROUTES_ASSIST } from '../models/assist-route-constants';


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


/*
  isAuthorizeValid() { // take logic page

    console.log( 'isAuthorizeValid' );
    const familyAuth = this.finAssistApp.authorizedByApplicant;

    const attorneyAUth =
      this.finAssistApp.authorizedByAttorney &&
      this.finAssistApp.powerOfAttorneyDocs.length > 0;

    if (
      this.finAssistApp.authorizedByAttorney &&
      this.finAssistApp.powerOfAttorneyDocs.length < 1
    ) {
      return false;
    }
    if (this.finAssistApp.authorizationToken == null) return false;
    const valid =
      (familyAuth === true || attorneyAUth === true) &&
      this.finAssistApp.authorizationToken &&
      this.finAssistApp.authorizationToken.length > 1;
    // console.log('authorize', valid);
    return valid;
  }

  isValid(index: number) {
    console.log( 'isValid: index = ', index );
    const args = this.validations.slice(0, index + 1);
    for (const arg of args) {
      const bool = arg();
      if (bool) continue;
      else {
        console.log('invalid index', index);

        return bool;
      }
    }
    return true;
  }

  filteredYears(fileType: 'files' | 'spouseFiles') {
    const { ...assistYears } = this.finAssistApp.assistYears;
    const filteredYears = [];

    for (const year in assistYears) {
      if (assistYears[year].apply) {
        filteredYears.push(assistYears[year][fileType]);
      }
    }
    return filteredYears.filter(itm => itm);
  }*/

  constructor(
    private router: Router,
    public dataSvc: MspDataService,
    private xformSvc: AssistTransformService,
    private api: ApiSendService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((obs: any) => {
        console.log( 'route events: ', obs.url );
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
      console.log( 'findIndex: ', obj );
      if ( obj ) {
        idx = obj.index;
      }
    }
    return idx;
  }

  setIndex( path: string ) {
    console.log( 'setIndex: ', path );
    const index = this.findIndex( path );
    this.index.next( index ? index : 1 );
  }

  setPageIncomplete( path: string ) {
    console.log( 'setPageIncomplete: ', path );
    const obj = this.finAssistApp.pageStatus.find( x => path.includes(x.path) );
    if ( obj ) {
      obj.isComplete = false;
      // Set future pages to not complete
      this.finAssistApp.pageStatus.map( x => {
        if ( obj.index < x.index && x.isComplete ) {
          console.log( 'sets pages in front false: ', x, obj );
          x.isComplete = false;
        }
      });
    }
  }

  setPageValid( path: string, valid: boolean ) {
    console.log( 'setPageValid: ', path, valid );
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
    console.log('run');
    try {
      //await this.api.sendFiles(token, app.uuid, attachments);
      const call = await this.api.sendApp(app, token, app.uuid, attachments);
      const res = await call.toPromise();
      this.response = res;
      console.log(res);
      const isSuccess =  this.response.op_return_code === 'SUCCESS';
      isSuccess
        ? (this.dataSvc.removeFinAssistApplication(), this.success$.next(res))
        : this.failure$.next(res);
      return res;
    } catch (err) {
      console.log( 'Error: ', err );
    }
  }

  mapInvalidField() {}
}
