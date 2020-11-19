import { Component, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import * as version from '../version.GENERATED';
import { HeaderService } from './services/header.service';
// import { } from '../version.GENERATED';

@Component({
  selector: 'general-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class GeneralAppComponent {
  private viewContainerRef: ViewContainerRef;
  routerSubscription: Subscription;
  headerSubscription: Subscription;
  // Even though we update this from headerService, we still want to set default value to avoid pop-in.
  public headerName: string = environment.appConstants.serviceName;


  public constructor(viewContainerRef: ViewContainerRef, private router: Router, private header: HeaderService) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;

    // Specific handling for refresh on DEAM
    this.handleRefresh(location.pathname);
  }

  handleRefresh(url) {
    // Refresh on account change
    if (url.includes('/deam')) {
      // if on the home page, don't redirect but remove any stored application data
      if (url.includes('/home')) {
        this.clearStorage();
        // if anywhere else besides confirmation, redirect them to the home page
      } else if (!url.includes('/confirmation')) {
        this.hardRedirect('/msp/deam/home');
      }
      // Refresh on retro assistance
    } else if (url.includes('/assistance')) {
      // if on the home page, don't redirect but remove any stored application data
      if (url.includes('/home')) {
        this.clearStorage();
        // if anywhere else besides confirmation, redirect them to the home page
      } else if (!url.includes('/confirmation')) {
        this.hardRedirect('/msp/assistance/home');
      }
    } else if (url.includes('/benefit')) {
      // if on the home page, don't redirect but remove any stored application data
      if (url.includes('/eligibility')) {
        this.clearStorage();
        // if anywhere else besides confirmation, redirect them to the home page
      } else if (!url.includes('/confirmation')) {
        this.hardRedirect('/msp/benefit/eligibility');
      }
    }
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(event => {
        document.body.scrollTop = 0;
      });

      const prefix = environment.appConstants.serviceName;
      this.headerSubscription = this.header.title.subscribe(title => {
        this.headerName = title;
      });

      version.success
            ? console.log('%c' + version.message, 'color: #036; font-size: 20px;')
            : console.error(version.message);
  }

  ngOnDestroy() {
    // note - if we add any more subscriptions, refactor to a takeUntil()
    this.routerSubscription.unsubscribe();
    this.headerSubscription.unsubscribe();
  }

  clearStorage() {
    window.sessionStorage.clear();
  }

  hardRedirect(path) {
    location.assign(path);
  }
}
