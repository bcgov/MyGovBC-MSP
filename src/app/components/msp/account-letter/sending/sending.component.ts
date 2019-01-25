import {Component, Inject, Injectable, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MspDataService } from '../../service/msp-data.service';
import { MspACLService } from '../../service/msp-acl-api.service';
import {Router} from '@angular/router';
import {ResponseType} from '../../api-model/responseTypes';
import {MspLogService} from '../../service/log.service';
import {ProcessService} from '../../service/process.service';
import {ISpaEnvResponse} from '../../model/spa-env-response.interface';
import { AccountLetterApplication } from '../../model/account-letter-application.model';
import { AccountLetterType  } from '../../api-model/accountLetterTypes';
import { ACLApiResponse } from '../../model/account-letter-response.interface';



@Component({
  templateUrl: 'sending.component.html',
  styleUrls: ['./sending.component.scss']
})

@Injectable()
export class AccountLetterSendingComponent implements AfterContentInit {
  lang = require('./i18n');

  application: AccountLetterApplication ;
  rawUrl: string;
  public rawError: string;
  rawRequest: string;
  public spaEnvRes: ISpaEnvResponse;

  transmissionInProcess: boolean;
  hasError: boolean;

  accountLetterModel : AccountLetterType;

  responseProperties : ACLApiResponse; 

  constructor(private aclService: MspACLService, private dataService: MspDataService, private processService: ProcessService,
    public router: Router, private logService: MspLogService) {
    this.application = this.dataService.accountLetterApp ;
    this.transmissionInProcess = undefined;
    this.hasError = undefined;
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
    
    this.aclService
      .sendAccountLetterApp(this.application, this.application.uuid)
      .subscribe(response => {
        console.log(response);
        console.log(response instanceof HttpErrorResponse);

        // Success response from the server
        if(!(response instanceof HttpErrorResponse)) {
          
          this.responseProperties = <ACLApiResponse> response;
          
          // For DB error Code and DB error message  
          if(this.responseProperties.dberrorCode != undefined && this.responseProperties.dberrorMessage != undefined) {
            this.processErrorResponse(null, this.responseProperties.dberrorMessage);
          } 

          // If got any rapid error, making the call to the spa env server
          if(this.responseProperties.rapidResponse != undefined) {
             
            this.aclService
                .sendSpaEnvServer(this.responseProperties.rapidResponse)
                .subscribe(response => {
                  console.log(response);
                  this.processErrorResponse(response, response.message);
                });

          // If there is no Rapid response code and the application is successfully submitted       
          } else {

              const refNumber = this.responseProperties.referenceNumber; 

              // If the application has recieved successfull Reference number from the server 
              if(refNumber != undefined && refNumber != '' && refNumber != null) {
                
                //delete the application from storage
                this.dataService.removeMspAccountLetterApp();
                this.logService.log({name: 'ACL - Received refNo ',
                confirmationNumber: this.application.referenceNumber}, 'ACL - Submission Response Success');
             
                this.router.navigate(['/msp/account-letter/confirmation'],
                  {queryParams: {confirmationNum: refNumber}});
              } else {
                this.processErrorResponse(null, undefined);
              }
          }
          
         } else {    // When the server is down or any other system failure 

          this.processErrorResponse(response, undefined);
        }
        
      });
  }

  retrySubmission(){
    this.router.navigate(['/msp/account-letter/personal-info']);
  }

  processErrorResponse(response: HttpErrorResponse, errorMessage: string) {
      //const aclResponse = <HttpErrorResponse> response;
      console.log('Error Response :'+response);
      this.rawError = (errorMessage != null && errorMessage != 'undefined') ? errorMessage : undefined;
      this.hasError = true;
      this.transmissionInProcess = false;
      const oldUUID = this.application.uuid;
      this.application.regenUUID();
      console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspApplication().uuid);
      this.application.authorizationToken = null;
      this.dataService.saveAccountLetterApplication();
      this.logService.log({name: 'ACL - System Error',
      confirmationNumber: this.application.referenceNumber}, 'ACL - Submission Response Error');
  }

}
