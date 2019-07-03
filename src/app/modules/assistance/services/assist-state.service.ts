import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';
import { validatePHN } from 'app/modules/msp-core/models/validate-phn';
import { validateBirthdate } from 'app/modules/msp-core/models/validate-birthdate';
import { validateContact } from 'app/modules/msp-core/models/validate-contact';

@Injectable({
  providedIn: 'root'
})
export class AssistStateService {
  index: BehaviorSubject<number> = new BehaviorSubject(null);
  touched: Subject<boolean> = new Subject<boolean>();
  routes: string[];
  finAssistApp = this.dataSvc.finAssistApp;
  submitted = false;

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
      if (!person[field]) return false;
      if (person[field].length > 0) continue;
      return false;
    }

    if (!validatePHN(person.previous_phn)) return false;

    if (!/\b[1-9]\d{2}[- ]?\d{3}[- ]?\d{3}\b/.test(person.sin)) return false;
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
    const familyAuth =
      this.finAssistApp.authorizedByApplicant &&
      ((this.finAssistApp.hasSpouseOrCommonLaw &&
        this.finAssistApp.authorizedBySpouse) ||
        !this.finAssistApp.hasSpouseOrCommonLaw);

    const attorneyAUth =
      this.finAssistApp.authorizedByAttorney &&
      this.finAssistApp.powerOfAttorneyDocs.length > 0;

    if (this.finAssistApp.authorizationToken == null) return false;

    return (
      (familyAuth === true || attorneyAUth === true) &&
      this.finAssistApp.authorizationToken &&
      this.finAssistApp.authorizationToken.length > 1
    );
  }

  isValid(index: number) {
    const args = this.validations.slice(0, index + 1);
    for (let arg of args) {
      let bool = arg();
      if (bool) continue;
      else return bool;
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
    return filteredYears;
  }

  constructor(private router: Router, public dataSvc: MspDataService) {
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
    return this.routes.indexOf(url);
  }

  nextIndex(i: number) {
    this.index.next(i);
  }

  setIndex(path: string) {
    console.log('set index', path);
    let index = this.findIndex(path);
    if (index > -1) return this.index.next(index);
  }
}
