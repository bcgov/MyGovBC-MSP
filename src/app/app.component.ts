import { Component, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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
  titleSubscription: Subscription;
  // Even though we update this from headerService, we still want to set default value to avoid pop-in.
  public headerName: string = environment.appConstants.serviceName;


  public constructor(
    viewContainerRef: ViewContainerRef,
    private router: Router,
    private header: HeaderService,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;

    // Specific handling for refresh on DEAM
    this.handleDEAMRefresh(location.pathname);
  }

  handleDEAMRefresh(url) {
    if (url.includes('/deam')) {
      // if on the home page, don't redirect but remove any stored application data
      if (url.includes('/home')) {
        window.sessionStorage.clear();
      // if anywhere else besides confirmation, redirect them to the landing page
      } else if (!url.includes('/confirmation')) {
        location.assign('/msp/deam/home');
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
    
    this.titleSubscription = this.router.events.pipe(  
      filter(event => event instanceof NavigationEnd),  
    ).subscribe(() => {  
      const rt = this.getChild(this.activatedRoute);  
      rt.data.subscribe(data => {  
        this.titleService.setTitle(data.title)});  
    });  
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.headerSubscription.unsubscribe();
    this.titleSubscription.unsubscribe();
  }

  // Use the title of the most specific route 
  getChild(activatedRoute: ActivatedRoute) {  
    if (activatedRoute.firstChild) {  
      return this.getChild(activatedRoute.firstChild);  
    } else {  
      return activatedRoute;  
    }  
  }  
}
