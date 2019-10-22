import {Component, Injectable, AfterContentInit} from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import {MspApiService} from '../../../../services/msp-api.service';
import {Router} from '@angular/router';
import {ResponseType} from '../../../msp-core/api-model/responseTypes';
import {FinancialAssistApplication} from '../../models/financial-assist-application.model';
import {MspLogService} from '../../../../services/log.service';


@Component({
  templateUrl: 'sending.component.html'
})
@Injectable()
export class AssistanceSendingComponent implements AfterContentInit   {
  lang = require('./i18n');

  application: FinancialAssistApplication;
  rawUrl: string;
  rawError: string;
  rawRequest: string;

  transmissionInProcess: boolean;
  hasError: boolean;
  showMoreErrorDetails: boolean;

  constructor(private dataService: MspDataService,
              private service: MspApiService,
              public router: Router,
              public logService: MspLogService) {

    this.application = this.dataService.finAssistApp;
  }

  ngAfterContentInit() {
    // After view inits, begin sending the application
    this.transmissionInProcess = true;
    this.hasError = false;
    console.log(this.dataService.getMspProcess());

     // this.logService.log({name: 'PA - application submitting request'},"PA : Submission Request");
    // After view inits, begin sending the application
    this.service
      .sendApplication(this.application)
      .then((application: FinancialAssistApplication) => {
        this.application = application;

        this.logService.log({name: 'PA - received refNo ',
          confirmationNumber: this.application.referenceNumber},
          'PA - Submission Response Success ');

        //delete the premium assistance application content from local storage
        this.dataService.removeFinAssistApplication();

        //  go to confirmation
        this.router.navigate(['/enrolment/confirmation'],
          {queryParams: {confirmationNum: this.application.referenceNumber}});

      })
      .catch((error: ResponseType | any) => {
        console.log('Error in sending PA: %o', error);
        this.hasError = true;

        this.rawUrl = error.url;
        this.rawError = error;
        this.rawRequest = error._requestBody;

        this.logService.log({name: 'PA - Received Failure ',
          error: error._body,
          request: error._requestBody}, 'PA - Submission Response Error' );
        this.transmissionInProcess = false;
        // this.router.navigate(["/msp/assistance/confirmation"]);
          const oldUUID = this.application.uuid;
          this.application.regenUUID();

          console.log('PA uuid updated: from %s to %s', oldUUID, this.dataService.finAssistApp.uuid);

        this.application.authorizationToken = null;
          this.dataService.saveFinAssistApplication();
      });
  }

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

  retrySubmission(){
    this.router.navigate(['/assistance/authorize-submit']);
  }

}
