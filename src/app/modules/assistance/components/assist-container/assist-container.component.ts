import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { assistPages } from '../../assist-page-routing.module';
import { Container } from 'moh-common-lib';
import { AssistStateService } from '../../services/assist-state.service';
import { MspDataService } from 'app/services/msp-data.service';
import { BehaviorSubject } from 'rxjs';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { SchemaService } from 'app/services/schema.service';
import { AssistTransformService } from '../../services/assist-transform.service';
import { AssistMapping } from '../../models/assist-mapping';
import { HeaderService } from '../../../../services/header.service';

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
    0: 'Apply for Retroactive Premium Assistance',
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
    private stateSvc: AssistStateService,
    private dataSvc: MspDataService,
    private schemaSvc: SchemaService,
    private xformSvc: AssistTransformService,
    private route: ActivatedRoute,
    private header: HeaderService
  ) {
    super();
    this.setProgressSteps(assistPages);
    this.stateSvc.setAssistPages(assistPages);
    this.header.setTitle('Retroactive Premium Assistance');
  }

  ngOnInit() {
    const url = this.router.url.slice(12, this.router.url.length);
    this.stateSvc.setIndex(url);
    this.stateSvc.touched.subscribe(obs => console.log(obs));
    this.stateSvc.index.subscribe(obs => {
      obs === 2
        ? this.submitLabel$.next(this.spouseLabel)
        : this.submitLabel$.next(this.submitLabels[obs] || 'Next');
    });

    this.route.params.subscribe(obs => {
      console.log(obs);
    });
  }

  continue() {
    let index = this.stateSvc.index.value;

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
  async submit() {
    this.isLoading = true;

    const findFieldName = (path: string) => {
      return path.split('.').pop();
    };

    try {
      const app = this.xformSvc.application;
      const validateList = await this.schemaSvc.validate(app);
      console.log('validate', validateList.errors);

      if (validateList.errors != null && validateList.errors.length > 0) {
        this.isLoading = false;
        for (let error of validateList.errors) {
          // console.log('error', validateList.errors, error);
          let fieldName = findFieldName(error.dataPath);

          for (let arr of AssistMapping.items) {
            if (arr.some(itm => itm === fieldName)) {
              let index = AssistMapping.items.indexOf(arr);
              return this.router.navigate([
                `/assistance/${this.stateSvc.routes[index]}`
              ]);
            }
          }
          return this.router.navigate([
            `/assistance/${this.stateSvc.routes[0]}`
          ]);
        }
      }
      let res = await this.stateSvc.submitApplication();
      this.isLoading = false;
      this.router.navigate([
        '/assistance/confirmation',
        res.op_return_code,
        res.op_reference_number || 'N/A'
      ]);

      this.submitLabel$.next('Home');
    } catch (err) {
      console.error(err);
    } finally {
    }
  }
}
