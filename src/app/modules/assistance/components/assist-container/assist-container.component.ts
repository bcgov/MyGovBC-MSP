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
import { AssistStateService } from '../../services/assist-state.service';

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
    <common-form-action-bar (btnClick)="continue()"></common-form-action-bar>
  `,
  styleUrls: ['./assist-container.component.scss']
})
export class AssistContainerComponent extends Container implements OnInit {
  index: any;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private stateSvc: AssistStateService
  ) {
    super();
    this.setProgressSteps(assistPages);
    this.stateSvc.setAssistPages(assistPages);
    this.stateSvc.setIndex(this.route.snapshot.routeConfig.path);
  }

  ngOnInit() {
    this.stateSvc.touched.subscribe(obs => console.log(obs));
    this.stateSvc.index.subscribe(obs => console.log(obs));
  }

  continue() {
    let index = this.stateSvc.index.value;
    let bool = this.stateSvc.isValid(index);
    // console.log(bool);

    // this.router.navigate([`/assistance/${this.stateSvc.routes[index + 1]}`]);
  }
}
