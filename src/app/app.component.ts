import {Component, ViewContainerRef} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter} from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'general-app',
  templateUrl: './app.component.html'
})
export class GeneralAppComponent {
  private viewContainerRef: ViewContainerRef;
  routerSubscription: Subscription;

  public constructor(viewContainerRef: ViewContainerRef, private router: Router) {
      console.log('%c ACL', 'color: red; font-weight: bold;');
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
  }


  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(event => {
          document.body.scrollTop = 0;
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  get serviceName(): string {
    return environment.appConstants.serviceName;
  }
}
