import {Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import DataService from '../../service/msp-data.service';
import {MspApiService} from "../../service/msp-api.service";
import {Router} from "@angular/router";
import {ResponseType} from "../../api-model/responseTypes";
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";
import {MspLogService} from '../../service/log.service'

@Component({
  templateUrl: 'sending.component.html'
})
@Injectable()
export class AssistanceSendingComponent implements AfterViewInit  {
  lang = require('./i18n');

  application:FinancialAssistApplication;
  rawUrl: string;
  rawError: string;
  rawRequest: string;

  transmissionInProcess:boolean;
  errorCode:string;
  showMoreErrorDetails:boolean;

  constructor(private dataService: DataService, 
              private service:MspApiService, 
              public router: Router,
              public logService:MspLogService) {
    this.application = this.dataService.finAssistApp;
  }

  ngAfterViewInit() {
    // After view inits, begin sending the application
    this.transmissionInProcess = true;
    this.errorCode = undefined;
    
    // After view inits, begin sending the application
    this.service
      .sendApplication(this.application)
      .then((application:FinancialAssistApplication) => {
        this.application = application;

        this.logService.log({name: 'premium assistance application received success confirmation from API server', 
          confirmationNumber: this.application.referenceNumber});

        //delete the premium assistance application content from local storage
        this.dataService.removeFinAssistApplication();

        //  go to confirmation
        this.router.navigate(["/msp/assistance/confirmation"], 
          {queryParams: {confirmationNum:this.application.referenceNumber}});
        
      })
      .catch((error: ResponseType | any) => {
        console.log('Error in sending PA: %o', error);
        this.errorCode = error.status + '';
        
        this.rawUrl = error.url;
        this.rawError = error;
        this.rawRequest = error._requestBody;

        this.logService.log({name: 'premium assistance application received failure message from API server', 
          error: error._body,
          request: error._requestBody});
        this.transmissionInProcess = false;
        // this.router.navigate(["/msp/assistance/confirmation"]);
        this.application.authorizationToken = null;
      });
  }

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }
  
  retrySubmission(){
    let oldUUID = this.application.uuid;
    this.application.regenUUID();
    this.dataService.saveFinAssistApplication();
    console.log('PA uuid change before retry: from %s to %s', oldUUID, this.dataService.finAssistApp.uuid);
    this.router.navigate(['/msp/assistance/authorize-submit']);
  }
  
}