import {Component, Injectable, AfterContentInit } from '@angular/core';
import {Router} from '@angular/router';
import { MspApplication } from '../../models/application.model';
import { ISpaEnvResponse } from 'moh-common-lib/lib/components/consent-modal/consent-modal.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspLogService } from '../../../../services/log.service';
import { MspApiEnrolmentService } from '../../services/msp-api-enrolment.service';
import { ApiResponse } from '../../../../models/api-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { ApiStatusCodes } from '../../../msp-core/components/confirm-template/confirm-template.component';


// TODO: mimic what Sean did in retro pa
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
  suppBenefitResponse: ApiResponse;

  constructor(private dataService: MspDataService, private service: MspApiEnrolmentService,
    //private processService: ProcessService,
    public router: Router, private logService: MspLogService) {
    this.application = this.dataService.mspApplication;
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
    console.log(this.application.uuid);
    //  this.logService.log({name: 'Enrollment application submitting request'},"Enrollment : Submission Request");
    this.service
      .sendRequest(this.application)
      .then((response: ApiResponse) => {

        if (response instanceof HttpErrorResponse) {
          this.logService.log({
              name: 'Enrolment - System Error',
              confirmationNumber: this.application.uuid,
              url: this.router.url
          }, 'Enrolment - Submission Response Error' + response.message);
          this.processErrorResponse(false);
          return;
      }

      const refNumber = response.op_reference_number;
      const statusCode = (response.op_return_code === 'SUCCESS' ? ApiStatusCodes.SUCCESS : ApiStatusCodes.ERROR);

       // this.application = application;
        console.log(this.application);

        this.logService.log({name: 'Enrolment - Received refNo ',
          confirmationNumber: this.application.referenceNumber},
          'Enrolment - Submission Response Success');


        //delete the application from storage
        this.dataService.removeMspApplication();

        //  go to confirmation
        this.router.navigate([ROUTES_ENROL.CONFIRMATION.fullpath],
                {queryParams: {confirmationNum: refNumber, status: statusCode}});

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

        console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.mspApplication.uuid);

        this.application.authorizationToken = null;
        this.dataService.saveMspApplication();
      });

  }

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

  processErrorResponse(transmissionInProcess: boolean) {
    this.hasError = true;
    this.transmissionInProcess = transmissionInProcess;
    const oldUUID = this.application.uuid;
    this.application.regenUUID();
    console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.mspApplication.uuid);
    this.application.authorizationToken = null;
    this.dataService.saveMspApplication();
}


  retrySubmission(){
    this.router.navigate([ROUTES_ENROL.AUTHORIZE.fullpath]);
  }
}
