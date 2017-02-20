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

  constructor(private dataService: DataService, 
              private service:MspApiService, 
              public router: Router,
              public logService:MspLogService) {
    this.application = this.dataService.finAssistApp;
  }

  ngAfterViewInit() {
    // After view inits, begin sending the application
    this.service
      .sendApplication(this.application)
      .then((application:FinancialAssistApplication) => {
        this.application = application;

        this.logService.log({name: 'premium assistance application received success confirmation from API server', 
          confirmationNumber: this.application.referenceNumber});

        //  go to confirmation
        this.router.navigate(["/msp/assistance/confirmation"], 
          {queryParams: {confirmationNum:this.application.referenceNumber}});
        
        //delete the premium assistance application content from local storage
        this.dataService.removeFinAssistApplication();
      })
      .catch((error: ResponseType | any) => {
        this.rawUrl = error.url;
        this.rawError = error._body;
        this.rawRequest = error._requestBody;

        this.logService.log({name: 'premium assistance application received failure message from API server', 
          error: error._body,
          request: error._requestBody});
        
      });
  }
}