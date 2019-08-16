import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { assistPages } from '../../assist-page-routing.module';
import { Container } from 'moh-common-lib';
import { AssistStateService } from '../../services/assist-state.service';
import { MspDataService } from 'app/services/msp-data.service';
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
      [submitLabel]="submitLabel"
      [isLoading]="isLoading"
      [defaultColor]="useDefaultColor"
    ></common-form-action-bar>
  `,
  styleUrls: ['./assist-container.component.scss']
})
export class AssistContainerComponent extends Container implements OnInit {
  app: FinancialAssistApplication = this.dataSvc.finAssistApp;

  isLoading = false;

  get spouseLabel() {
    return this.app.hasSpouseOrCommonLaw ? 'Continue' : 'No Spouse';
  }

  response: any;

  constructor(
    public router: Router,
    private stateSvc: AssistStateService,
    private dataSvc: MspDataService,
    private schemaSvc: SchemaService,
    private xformSvc: AssistTransformService,
    private header: HeaderService
  ) {
    super();
    this.setProgressSteps(assistPages);
    this.stateSvc.setAssistPages( assistPages );
    this.header.setTitle('Retroactive Premium Assistance');
  }

  ngOnInit() {
    console.log( 'router: ', this.router.url );
    this.stateSvc.setIndex( this.router.url );
  }

  get submitLabel() {
    const index = this.stateSvc.findIndex( this.router.url );
    return this.stateSvc.finAssistApp.pageStatus[index ? index - 1 : 0].btnLabel;
  }

  get useDefaultColor() {
    const index = this.stateSvc.findIndex( this.router.url );
    return this.stateSvc.finAssistApp.pageStatus[index ? index - 1 : 0].btnDefaultColor;
  }

  continue() {
    const index = this.stateSvc.findIndex( this.router.url );
    const idx = index ? index - 1 : 0;

    console.log( 'index: ', index, this.stateSvc.finAssistApp.pageStatus.length );
    if ( this.stateSvc.finAssistApp.pageStatus[idx].isValid ) {
      this.stateSvc.finAssistApp.pageStatus[idx].isComplete = true;
      if ( index === this.stateSvc.finAssistApp.pageStatus.length ) {
        // last item in routes
        this.submit();
      } else {
        // next page
        this.router.navigate( [this.stateSvc.finAssistApp.pageStatus[index].fullpath] );
      }
    } else {
      this.stateSvc.touched.next( true );
    }
  }

  async submit() {
    console.log( 'submit functions - needs work' );
    this.isLoading = true;

    const findFieldName = (path: string) => {
      return path.split('.').pop();
    };

    console.log( 'findFieldName: ', findFieldName );
    try {
      const app = this.xformSvc.application;

      const validateList = await this.schemaSvc.validate(app);
      console.log('validate', validateList.errors);

      if (validateList.errors != null && validateList.errors.length > 0) {
        this.isLoading = false;
        for (const error of validateList.errors) {
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

        const res = await this.stateSvc.submitApplication();
        this.response = res;
        this.isLoading = false;
        this.router.navigate([
          ROUTES_ASSIST.CONFIRMATION.fullpath,
          this.response.op_return_code,
          this.response.op_reference_number || 'N/A'
      ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      // Should there be some code in here??
    }
  }
}
