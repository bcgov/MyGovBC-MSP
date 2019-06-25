import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationStart
} from '@angular/router';
import { assistPages } from '../../assist-page-routing.module';
import { Container } from 'moh-common-lib';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'msp-assist-container',
  template: `
    <common-core-breadcrumb>
      <common-wizard-progress-bar center [progressSteps]="progressSteps">
      </common-wizard-progress-bar>
    </common-core-breadcrumb>
    <common-page-framework layout="blank">
      <router-outlet></router-outlet>
    </common-page-framework>
    <common-form-action-bar></common-form-action-bar>
  `,
  styleUrls: ['./assist-container.component.scss']
})
export class AssistContainerComponent extends Container implements OnInit {
  index: any;
  constructor(public router: Router, private activatedRoute: ActivatedRoute) {
    super();
    this.setProgressSteps(assistPages);
    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     console.log(this.activatedRoute.url);
    //   });

    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((obs: any) => {
        const url = obs.url.slice(0, 13);
        console.log(url);
        // this.index = assistPages.indexOf()
        console.log('index', this.index);
      });
  }

  ngOnInit() {}
}
