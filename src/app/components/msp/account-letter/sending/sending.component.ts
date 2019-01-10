import {Component, Inject, Injectable, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MspDataService } from '../../service/msp-data.service';
import { MspACLService } from '../../service/msp-acl-api.service';

import {MspApiService} from '../../service/msp-api.service';
import {Router} from '@angular/router';
import {ResponseType} from '../../api-model/responseTypes';
import {MspLogService} from '../../service/log.service';
import {ProcessService} from '../../service/process.service';
import {ISpaEnvResponse} from '../../model/spa-env-response.interface';
import { AccountLetterApplication } from '../../model/account-letter-application.model';
import { AccountLetterType  } from '../../api-model/accountLetterTypes';



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

  accountLetterModel : AccountLetterType;

  //showMoreErrorDetails: boolean;

  constructor(private aclService: MspACLService, private dataService: MspDataService, private service: MspApiService, private processService: ProcessService,
    public router: Router, private logService: MspLogService) {
    this.application = this.dataService.accountLetterApp ;
    this.transmissionInProcess = undefined;
    this.hasError = undefined;
    //this.showMoreErrorDetails = ;;
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
    
   // this.accountLetterModel = this.aclService.convertAccountLetterApp(this.application);
    this.aclService
      .sendAccountLetterApp(this.application, this.application.uuid)
      .subscribe(response => {

        // When the server is down or any other system failure
        if(response instanceof HttpErrorResponse) {
          const aclResponse = <HttpErrorResponse> response;
          this.hasError = true;
          this.transmissionInProcess = false;
          const oldUUID = this.application.uuid;
          this.application.regenUUID();
          console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspApplication().uuid);
          this.application.authorizationToken = null;
          this.dataService.saveAccountLetterApplication();
          this.logService.log({name: 'ACL - System Error',
          confirmationNumber: this.application.referenceNumber}, 'ACL - Submission Response Error');
        } else { // Successfull response from the server 
          const aclResponse = <AccountLetterType> response;
          this.logService.log({name: 'ACL - Received refNo ',
          confirmationNumber: this.application.referenceNumber}, 'ACL - Submission Response Success');
          const tempRef = this.application.referenceNumber;

          //delete the application from storage
          this.dataService.removeMspAccountLetterApp();
          this.router.navigate(['/msp/account-letter/confirmation'],
            {queryParams: {confirmationNum: tempRef}});
        
        }
        
      });
  }

  retrySubmission(){
    this.router.navigate(['/msp/account-letter/personal-info']);
  }

}
