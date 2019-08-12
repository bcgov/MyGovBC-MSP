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

  public canContinue: boolean = false;

  finAssistApp = this.dataSvc.finAssistApp;
  touched: Subject<boolean> = new Subject<boolean>();
  index: BehaviorSubject<number> = new BehaviorSubject(null);


  success$: BehaviorSubject<any> = new BehaviorSubject(null);
  failure$: BehaviorSubject<any> = new BehaviorSubject(null);
  submitted = false; // Do we need?
  response: any;

  // The index of the validations is tied to the index of the router
  // ie: home is index 0 ergo validation is index 0.
  // could be changed to a dictionary type object.

  validations = [
    this.isHomeValid.bind(this),
    this.isPersonalInfoValid.bind(this),
    this.isSpouseValid.bind(this),
    this.isContactValid.bind(this),
    this.isReviewValid.bind(this),
    this.isAuthorizeValid.bind(this)
  ];

  isHomeValid(): boolean { // to remove - done on pages
    console.log( 'isHomeValid' );
    const bool = this.finAssistApp.assistYears.some(itm => itm.apply === true);
    return bool;
  }

  isPersonalInfoValid(): boolean {
    const person = this.finAssistApp.applicant;

    console.log( 'isPersonalInfoValid: ', person );
    // check that these fields have value
    const requiredFields = ['firstName', 'lastName', 'previous_phn', 'sin'];
    for (const field of requiredFields) {
      //console.log(person[field]);
      if (!person[field]) {
        //console.log( '!person[field]: ', person[field] );
        return false;
      }
      if (person[field].length <= 0) {
        //console.log( '!person[field].length: ', person[field].length );
        return false;
      }
    }


    if (!validateBirthdate(person.dobSimple)) return false;
    const filteredYears = this.filteredYears('files');
    for (const year in filteredYears) {
      if (year.length < 1) return false;
    }
    return filteredYears.every(files => files.length > 0);
  }

  isSpouseValid(): boolean {
    console.log( 'isSpouseValid' );
    if (!this.finAssistApp.hasSpouseOrCommonLaw) {
      console.log( 'isSpouseValid: No spouse return true' );
      return true;
    }

    const filteredYears = this.filteredYears('spouseFiles');
    console.log('filtered years', filteredYears);
    for (const year in filteredYears) {
      if (year.length < 1) {
        console.log( 'isSpouseValid:  not years' );
        return false;
      }
    }

    return filteredYears.some(itm => itm.length > 0)
      ? filteredYears.every(itm => itm.length > 0)
      : false;
  }

  isContactValid(): boolean {

    console.log( 'isContactValid' );
    const address = this.finAssistApp.mailingAddress;
    return validateContact(address);
  }

  isReviewValid(): boolean {
    console.log( 'isReviewValid' );
    return true;
  }

  isAuthorizeValid() {

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
  }

  constructor(
    private router: Router,
    public dataSvc: MspDataService,
    private schemaSvc: SchemaService,
    private xformSvc: AssistTransformService,
    private api: ApiSendService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((obs: any) => {
        const index = this.findIndex( obs.url );
        console.log( 'route events: ', obs.url, index );
        if (index > 0 ) {
          this.index.next( index );
        }
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
            isComplete: false
          };
        });
    }
  }

  findIndex( url: string ): number {
    let idx = 0;
    if ( this.finAssistApp.pageStatus ) {
      console.log( 'findIndex: ', url );
      const obj = this.finAssistApp.pageStatus.find( x => url.includes(x.path) );
      console.log( 'findIndex: ', obj );
      if ( obj ) {
        idx = obj.index;
      }
    }
    return idx;
  }

  nextIndex( i: number ) {
    this.index.next(i);
  }

  setIndex( path: string ) {
    console.log( 'setIndex: ', path );
    const index = this.findIndex(path);
     if (index > -1) return this.index.next(index);
  }

  setPageStatus( path: string , complete: boolean ) {
    const obj = this.finAssistApp.pageStatus.find( x => path.includes(x.path) );
    if ( obj ) {
      obj.isComplete = complete;
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
      console.error;
    }
  }

  mapInvalidField() {}
}
