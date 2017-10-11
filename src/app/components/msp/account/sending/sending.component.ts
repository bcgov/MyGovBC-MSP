import {Component, Inject, Injectable, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import { MspDataService } from '../../service/msp-data.service';
import {MspApiService} from "../../service/msp-api.service";
import {Router} from "@angular/router";
import {ResponseType} from "../../api-model/responseTypes";
import {MspLogService} from '../../service/log.service'
import {ProcessService} from "../../service/process.service";
import {MspAccountApp} from '../../model/account.model';

@Component({
  templateUrl: 'sending.component.html',
  styleUrls: ['./sending.component.less']
})
@Injectable()
export class AccountSendingComponent implements AfterContentInit {
  lang = require('./i18n');

    mspAccountApp: MspAccountApp;
  rawUrl: string;
  rawError: string;
  rawRequest: string;

  transmissionInProcess:boolean;
  hasError:boolean;
  showMoreErrorDetails:boolean;
  
  constructor(private dataService: MspDataService, private service: MspApiService, private processService:ProcessService,
    public router: Router, private logService: MspLogService) {
    this.mspAccountApp = this.dataService.getMspAccountApp();
    this.transmissionInProcess = undefined;
    this.hasError = undefined;
    this.showMoreErrorDetails = undefined;
  }

  /**
   * always regnerate uuid for application and its images 
   * When user use browser back button, the uuid are guaranteed to be unique for API server.
   */
  ngAfterContentInit() {
    this.transmitRequest();
  }

    transmitRequest(){
    // After view inits, begin sending the application
    this.transmissionInProcess = true;
    this.hasError = undefined;
    this.service
      .sendApplication(this.mspAccountApp)
      .then((mspAccountApp: MspAccountApp) => {
        this.mspAccountApp = mspAccountApp;
        this.logService.log({name: 'enrollment application received success confirmation from API server', 
          confirmationNumber: this.mspAccountApp.referenceNumber});

        let tempRef = this.mspAccountApp.referenceNumber;

        //delete the application from storage
        this.dataService.removeMspAccountApp();

        //  go to confirmation

        this.router.navigate(["/msp/account/confirmation"],
          {queryParams: {confirmationNum:tempRef}});


      }).catch((error: ResponseType | any) => {
        console.log('error in sending request: ', error);
        this.hasError = true;
        this.rawUrl = error.url;
        this.rawError = error;
        this.rawRequest = error._requestBody
        this.logService.log({name: 'MSP Account Maintanence request received failure message from API server',
          error: error._body,
          request: error._requestBody});
        this.transmissionInProcess = false;

        this.mspAccountApp.authorizationToken = null;
      });

  }

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

  retrySubmission(){
    this.router.navigate(['/msp/account/review']);
  }
}
