import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';

@Injectable({
  providedIn: 'root'
})
export class AssistStateService {
  index: BehaviorSubject<number> = new BehaviorSubject(null);
  touched: Subject<boolean> = new Subject<boolean>();
  routes: string[];

  validations = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataSvc: MspDataService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((obs: any) => {
        console.log(obs);
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
