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
import { ROUTES_ASSIST } from '../../models/assist-route-constants';

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

  response: any;

  submitLabel$ = new BehaviorSubject<string>('Continue');

  constructor(
    public router: Router,
    private stateSvc: AssistStateService, // TODO: Modify to keep current state
    private dataSvc: MspDataService,
    private schemaSvc: SchemaService,
    private xformSvc: AssistTransformService,
    private route: ActivatedRoute,
    private header: HeaderService
  ) {
    super();
    this.setProgressSteps(assistPages);
    this.stateSvc.setAssistPages( assistPages );
    this.header.setTitle('Retroactive Premium Assistance');
  }

  ngOnInit() {
    console.log( 'router: ', this.router.url );
  /*  const url = this.router.url.slice(12, this.router.url.length);
    this.stateSvc.setIndex(url);*/
    this.stateSvc.touched.subscribe(obs => console.log('assist-containter touched:' + obs));

    this.stateSvc.index.subscribe(obs => {
      obs === 3
        ? this.submitLabel$.next(this.spouseLabel)
        : this.submitLabel$.next(this.submitLabels[obs - 1] || 'Next');
    });

    this.route.params.subscribe(obs => {
      console.log('route params: ', obs);
    });
  }

  continue() {
    // index is the number for ROUTE_ASSIST item, offset by 1
    const index = this.stateSvc.index.value;
    console.log( 'Continue (container)', index );

    if ( this.stateSvc.finAssistApp.pageStatus[index - 1].isComplete ) {
      this.navigate( index );
    } else {
      this.stateSvc.touched.next( true );
    }
  }


  navigate( index: number ) {
    if ( index === this.stateSvc.finAssistApp.pageStatus.length ) {
      // last item in routes
      this.submit();
    } else {
      // next page
      this.router.navigate( [this.stateSvc.finAssistApp.pageStatus[index].fullpath] );
    }
  }

  async submit() {
    console.log( 'submit functions - needs work' );
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
        for (const error of validateList.errors) {
          // console.log('error', validateList.errors, error);
          const fieldName = findFieldName(error.dataPath);

          for (const arr of AssistMapping.items) {
            if (arr.some(itm => itm === fieldName)) {
              const index = AssistMapping.items.indexOf(arr);
              return this.router.navigate([this.stateSvc.finAssistApp.pageStatus[index].fullpath]);
            }
          }
          return this.router.navigate([this.stateSvc.finAssistApp.pageStatus[0].fullpath]);
        }
      } else {
        let res = await this.stateSvc.submitApplication();
        this.response = res;
        this.isLoading = false;
        this.router.navigate([ 
          ROUTES_ASSIST.CONFIRMATION.fullpath,
          this.response.op_return_code,
          this.response.op_reference_number || 'N/A'
      ]);
        this.submitLabel$.next('Home');
      }
    } catch (err) {
      console.error(err);
    } finally {
      //this.submitLabel$.next('Home');
      //this.submitLabel$.next('Home');
    }
  }
}
