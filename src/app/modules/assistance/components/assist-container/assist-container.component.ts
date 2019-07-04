import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { assistPages } from '../../assist-page-routing.module';
import { Container } from 'moh-common-lib';
import { AssistStateService } from '../../services/assist-state.service';
import { MspDataService } from 'app/services/msp-data.service';
import { BehaviorSubject } from 'rxjs';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { SchemaService } from 'app/services/schema.service';

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
      [submitLabel]="submitLabel$ | async"
      [isLoading]="isLoading"
    ></common-form-action-bar>
  `,
  styleUrls: ['./assist-container.component.scss']
})
export class AssistContainerComponent extends Container implements OnInit {
  app: FinancialAssistApplication = this.dataSvc.finAssistApp;
  isLoading = false;
  submitted = false;

  submitLabels = {
    0: 'Continue',
    1: 'Continue',
    2: this.spouseLabel,
    3: 'Continue',
    4: 'Continue',
    5: 'Submit'
  };

  get spouseLabel() {
    return this.app.hasSpouseOrCommonLaw ? 'Continue' : 'No Spouse';
  }

  index: any;

  submitLabel$ = new BehaviorSubject<string>('Continue');

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private stateSvc: AssistStateService,
    private dataSvc: MspDataService,
    private schemaSvc: SchemaService
  ) {
    super();
    this.setProgressSteps(assistPages);
    this.stateSvc.setAssistPages(assistPages);
  }

  ngOnInit() {
    const url = this.router.url.slice(12, this.router.url.length);
    this.stateSvc.setIndex(url);
    this.stateSvc.touched.subscribe(obs => console.log(obs));
    this.stateSvc.index.subscribe(obs => {
      obs === 2
        ? this.submitLabel$.next(this.spouseLabel)
        : this.submitLabel$.next(this.submitLabels[obs]);
    });
  }

  continue() {
    let index = this.stateSvc.index.value;
    console.log('current index', index);

    this.stateSvc.isValid(index)
      ? this.navigate(index)
      : this.stateSvc.touched.next(true);
    // ;
  }

  navigate(index: number) {
    index !== 5
      ? this.router.navigate([`/assistance/${this.stateSvc.routes[index + 1]}`])
      : this.submit();
  }
  submit() {
    // this.isLoading = true;
    /**
    setTimeout(() => {
      this.stateSvc.submitted = true;
      this.isLoading = false;
      this.submitLabel$.next('Home');

    }, 1000);
     */
    this.stateSvc.submitApplication();
  }
}
