import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';
import { FinancialAssistApplication } from '../models/financial-assist-application.model';
import { validatePHN } from 'app/modules/msp-core/models/validate-phn';
import { validateBirthdate } from 'app/modules/msp-core/models/validate-birthdate';

@Injectable({
  providedIn: 'root'
})
export class AssistStateService {
  index: BehaviorSubject<number> = new BehaviorSubject(null);
  touched: Subject<boolean> = new Subject<boolean>();
  routes: string[];
  finAssistApp = this.dataSvc.finAssistApp;

  validations = [
    this.isHomeValid.bind(this),
    this.isPersonalInfoValid.bind(this),
    this.isSpouseValid.bind(this),
    this.isContactValid.bind(this),
    this.isReviewValid.bind(this)
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

    if (!validateBirthdate(person.dateOfBirth)) return false;
    const { ...assistYears } = this.finAssistApp.assistYears;
    console.log('assist years', assistYears);
    const filteredYears = [];
    for (let year in assistYears) {
      // const year = assistYears[i];
      console.log('the year', assistYears[year]);
      if (assistYears[year].apply) filteredYears.push(assistYears[year]);
    }
    let result = filteredYears.filter(year => year.files.length > 0);
    console.log(result);
    if (result.length < 1) return false;
    result.forEach(itm => {
      console.log(itm);
    });
    /*
      .forEach(files => {
        console.log('files',files);
        if (files.length < 1) console.log('missing files');
      });
      */
    // console.log('result', result.length < 1);
    // if (result.length < 1) return false;
    // let filteredYears = assistYears.filter(itm => itm.apply);
    console.log('filtered Years', filteredYears);
  }
  isSpouseValid(): boolean {
    return true;
  }
  isContactValid(): boolean {
    return true;
  }
  isReviewValid(): boolean {
    return true;
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
    let index = this.findIndex(path);
    if (index > -1) return this.index.next(index);
  }
}
