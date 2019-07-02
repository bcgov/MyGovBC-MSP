import {Component, Injectable, AfterContentInit } from '@angular/core';
import {Router} from '@angular/router';
import { MspApplication } from '../../models/application.model';
import { ISpaEnvResponse } from 'moh-common-lib/lib/components/consent-modal/consent-modal.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { ProcessService } from '../../../../services/process.service';
import { MspLogService } from '../../../../services/log.service';
import { MspApiService } from '../../../../services/msp-api.service';


@Component({
  templateUrl: 'sending.component.html',
  styleUrls: ['./sending.component.scss']
})
@Injectable()
export class SendingComponent implements AfterContentInit {
  lang = require('./i18n');

  application: MspApplication;
  rawUrl: string;
  rawError: string;
  rawRequest: string;
  public spaEnvRes: ISpaEnvResponse;

  transmissionInProcess: boolean;
  hasError: boolean;
  showMoreErrorDetails: boolean;

  constructor(private dataService: MspDataService, private service: MspApiService,
    //private processService: ProcessService,
    public router: Router, private logService: MspLogService) {
    this.application = this.dataService.getMspApplication();
    this.transmissionInProcess = undefined;
    this.hasError = undefined;
    this.showMoreErrorDetails = undefined;
  }

  /**
   * always regnerate uuid for application and its images
   * When user use browser back button, the uuid are guaranteed to be unique for API server.
   */
  ngAfterContentInit() {
    this.transmitApplication();
  }

  transmitApplication(){
    // After view inits, begin sending the application
    this.transmissionInProcess = true;
    this.hasError = undefined;
    //  this.logService.log({name: 'Enrollment application submitting request'},"Enrollment : Submission Request");
    this.service
      .sendApplication(this.application)
      .then((application: MspApplication) => {
        this.application = application;
        this.logService.log({name: 'Enrolment - Received refNo ',
          confirmationNumber: this.application.referenceNumber}, 'Enrolment - Submission Response Success');

        const tempRef = this.application.referenceNumber;

        //delete the application from storage
        this.dataService.removeMspApplication();

        //  go to confirmation

        this.router.navigate(['/enrolment/confirmation'],
          {queryParams: {confirmationNum: tempRef}});


      }).catch((error: ResponseType | any) => {
        console.log('error in sending application: ', error);
        this.spaEnvRes = <ISpaEnvResponse> error;

        this.hasError = true;
        this.rawUrl = error.url;
        this.rawError = this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_FLAG === 'true' ? this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_MESSAGE : error;
        this.rawRequest = error._requestBody;
        this.logService.log({name: 'Enrolment - Received Failure ',
          error: error._body,
          request: error._requestBody}, 'Enrolment - Submission Response Error');
        this.transmissionInProcess = false;

        const oldUUID = this.application.uuid;
        this.application.regenUUID();

        console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspApplication().uuid);

        this.application.authorizationToken = null;
        this.dataService.saveMspApplication();
      });

  }

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

  retrySubmission(){
    this.router.navigate(['/enrolment/authorize']);
  }
}
