import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { assistPages } from '../../assist-page-routing.module';
import { Container } from 'moh-common-lib';
import { AssistStateService } from '../../services/assist-state.service';
import { MspDataService } from 'app/services/msp-data.service';
import { BehaviorSubject } from 'rxjs';

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
    <common-form-action-bar
      (btnClick)="continue()"
      [submitLabel]="submitLabel | async"
    ></common-form-action-bar>
  `,
  styleUrls: ['./assist-container.component.scss']
})
export class AssistContainerComponent extends Container implements OnInit {
  index: any;

  submitLabel = new BehaviorSubject<string>('Continue');
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private stateSvc: AssistStateService,
    private dataSvc: MspDataService
  ) {
    super();
    this.setProgressSteps(assistPages);
    this.stateSvc.setAssistPages(assistPages);
  }

  ngOnInit() {
    const url = this.router.url.slice(12, this.router.url.length);
    this.stateSvc.setIndex(url);
    this.stateSvc.touched.subscribe(obs => console.log(obs));
    console.log('index', this.stateSvc.index.value);
    this.stateSvc.index.subscribe(obs => {
      if (obs === 5) this.submitLabel.next('Submit');
      else this.submitLabel.next('Continue');
    });
  }

  continue() {
    let index = this.stateSvc.index.value;
    console.log('current index', index);
    let bool = this.stateSvc.isValid(index);
    console.log('valid index?', bool);
    bool
      ? this.router.navigate([`/assistance/${this.stateSvc.routes[index + 1]}`])
      : this.stateSvc.touched.next(true);
    // ;
  }
}
