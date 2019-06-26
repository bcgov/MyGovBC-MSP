import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';
import { FinancialAssistApplication } from '../models/financial-assist-application.model';

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
    let bool = this.dataSvc.finAssistApp.assistYears.some(
      itm => itm.apply === true
    );
    return bool;
  }
  isPersonalInfoValid(): boolean {
    return true;
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
    console.log(args);
    for (let arg of args) {
      let bool = arg();
      console.log(bool);
      if (bool) continue;
      else return bool;
    }
    return true;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dataSvc: MspDataService
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
