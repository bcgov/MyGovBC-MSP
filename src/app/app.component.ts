import {Component, ViewContainerRef} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'general-app',
  templateUrl: './app.component.html'
})
export class GeneralAppComponent {
  private viewContainerRef: ViewContainerRef;
  routerSubscription: Subscription;

  public constructor(viewContainerRef:ViewContainerRef, private router: Router) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
  }


  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        document.body.scrollTop = 0;
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}