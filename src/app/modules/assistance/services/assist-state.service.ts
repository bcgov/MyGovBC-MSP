import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';
import { validatePHN } from 'app/modules/msp-core/models/validate-phn';
import { validateBirthdate } from 'app/modules/msp-core/models/validate-birthdate';
import { validateContact } from 'app/modules/msp-core/models/validate-contact';
import { AssistTransformService } from './assist-transform.service';
import { SchemaService } from 'app/services/schema.service';
import { ApiSendService } from 'app/modules/benefit/services/api-send.service';
import { MSPApplicationSchema } from 'app/modules/msp-core/interfaces/i-api';

@Injectable({
  providedIn: 'root'
})
export class AssistStateService {
  index: BehaviorSubject<number> = new BehaviorSubject(null);
  success$: BehaviorSubject<any> = new BehaviorSubject(null);
  failure$: BehaviorSubject<any> = new BehaviorSubject(null);
  touched: Subject<boolean> = new Subject<boolean>();
  routes: string[];
  finAssistApp = this.dataSvc.finAssistApp;
  submitted = false;

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

  isHomeValid(): boolean {
    let bool = this.finAssistApp.assistYears.some(itm => itm.apply === true);
    return bool;
  }
  isPersonalInfoValid(): boolean {
    const person = this.finAssistApp.applicant;
    // check that these fields have value
    const requiredFields = ['firstName', 'lastName', 'previous_phn', 'sin'];
    for (let field of requiredFields) {
      console.log(person[field]);
      if (!person[field]) return false;
      if (person[field].length > 0) continue;
      return false;
    }

    if (!validatePHN(person.previous_phn)) return false;

    if (!/^[1-9]([0-9]{8})$/.test(person.sin.replace(/ /g, ''))) return false;

    if (!validateBirthdate(person.dobSimple)) return false;
    const filteredYears = this.filteredYears('files');
    for (let year in filteredYears) {
      if (year.length < 1) return false;
    }
    return filteredYears.every(files => files.length > 0);
  }
  isSpouseValid(): boolean {
    if (!this.finAssistApp.hasSpouseOrCommonLaw) return true;

    const filteredYears = this.filteredYears('spouseFiles');
    console.log('filtered years', filteredYears);
    for (let year in filteredYears) {
      if (year.length < 1) return false;
    }
    return filteredYears.some(itm => itm.length > 0)
      ? filteredYears.every(itm => itm.length > 0)
      : false;
  }

  isContactValid(): boolean {
    const address = this.finAssistApp.mailingAddress;
    return validateContact(address);
  }

  isReviewValid(): boolean {
    return true;
  }

  isAuthorizeValid() {
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
    const args = this.validations.slice(0, index + 1);
    for (let arg of args) {
      let bool = arg();
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

    for (let year in assistYears) {
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
        const url = obs.url.slice(12, obs.url.length);
        const index = this.findIndex(url);
        if (index > -1) this.index.next(index);
      });
  }

  setAssistPages(arr: Route[]) {
    const [...routes] = [...arr];

    this.routes = routes
      .filter((itm: any) => !itm.redirectTo)
      .map((itm: any) => itm.path);
  }

  findIndex(url: string) {
    if (!this.routes) return 0;
    return this.routes.indexOf(url);
  }

  nextIndex(i: number) {
    this.index.next(i);
  }

  setIndex(path: string) {
    let index = this.findIndex(path);
    if (index > -1) return this.index.next(index);
  }

  async submitApplication() {
    const token = this.finAssistApp.authorizationToken;
    const attachments = this.xformSvc.fileAttachments;
    const app = this.xformSvc.application;
    console.log('run');
    try {
      await this.api.sendFiles(token, app.uuid, attachments);
      const call = await this.api.sendApp(app, token, app.uuid, attachments);
      const res = await call.toPromise();
      const isSuccess = res.op_return_code === 'SUCCESS';
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
