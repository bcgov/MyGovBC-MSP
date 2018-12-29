import {Component, Inject, Injectable, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import { MspDataService } from '../../service/msp-data.service';
import {MspApiService} from '../../service/msp-api.service';
import {Router} from '@angular/router';
import {ResponseType} from '../../api-model/responseTypes';
import {MspLogService} from '../../service/log.service';
import {ProcessService} from '../../service/process.service';
import {ISpaEnvResponse} from '../../model/spa-env-response.interface';
import { AccountLetterApplication } from '../../model/account-letter-application.model';

@Component({
  templateUrl: 'sending.component.html',
  styleUrls: ['./sending.component.scss']
})

@Injectable()
export class AccountLetterSendingComponent implements AfterContentInit {
  lang = require('./i18n');

  application: AccountLetterApplication ;
  rawUrl: string;
  rawError: string;
  rawRequest: string;
  public spaEnvRes: ISpaEnvResponse;

  transmissionInProcess: boolean;
  hasError: boolean;
  showMoreErrorDetails: boolean;

  constructor(private dataService: MspDataService, private service: MspApiService, private processService: ProcessService,
    public router: Router, private logService: MspLogService) {
    this.application = this.dataService.accountLetterApp ;
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
    this.logService.log({name: 'ACL application submitting request'},"ACL : Submission Request");
    
    this.service
      .sendApplication(this.application)
      .then((application: AccountLetterApplication) => {
        this.application = application;
        this.logService.log({name: 'ACL - Received refNo ',
          confirmationNumber: this.application.referenceNumber}, 'ACL - Submission Response Success');

        const tempRef = this.application.referenceNumber;

        //delete the application from storage
        this.dataService.removeMspApplication();

        //  go to confirmation
        this.router.navigate(['/msp/account-letter/confirmation'],
          {queryParams: {confirmationNum: tempRef}});


      }).catch((error: ResponseType | any) => {
        console.log('error in sending application: ', error);
        this.spaEnvRes = <ISpaEnvResponse> error;
        
        this.hasError = true;
        this.rawUrl = error.url;
        this.rawError = this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_FLAG === 'true' ? this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_MESSAGE : error;
        this.rawRequest = error._requestBody;
        this.logService.log({name: 'ACL - Received Failure ',
          error: error._body,
          request: error._requestBody}, 'ACL - Submission Response Error');
        this.transmissionInProcess = false;

        const oldUUID = this.application.uuid;
        this.application.regenUUID();

        console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspApplication().uuid);

        this.application.authorizationToken = null;
        this.dataService.saveAccountLetterApplication();
      });
  
  }

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

  retrySubmission(){
    this.router.navigate(['/msp/account-letter/personal-info']);
  }
}
