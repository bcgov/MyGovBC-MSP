import {Component, Inject, Injectable, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import { MspDataService } from '../../service/msp-data.service';
import {MspApiService} from "../../service/msp-api.service";
import {Router} from "@angular/router";
import {ResponseType} from "../../api-model/responseTypes";
import {MspLogService} from '../../service/log.service'
import {ProcessService} from "../../service/process.service";

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

  transmissionInProcess:boolean;
  hasError:boolean;
  showMoreErrorDetails:boolean;
  
  constructor(private dataService: MspDataService, private service: MspApiService, private processService:ProcessService,
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
          confirmationNumber: this.application.referenceNumber},"Enrolment - Submission Response Success");

        let tempRef = this.application.referenceNumber;

        //delete the application from storage
        this.dataService.removeMspApplication();

        //  go to confirmation

        this.router.navigate(["/msp/application/confirmation"], 
          {queryParams: {confirmationNum:tempRef}});


      }).catch((error: ResponseType | any) => {
        console.log('error in sending application: ', error);
        this.hasError = true;
        this.rawUrl = error.url;
        this.rawError = error;
        this.rawRequest = error._requestBody
        this.logService.log({name: 'Enrolment - Received Failure ',
          error: error._body,
          request: error._requestBody},"Enrolment - Submission Response Error");
        this.transmissionInProcess = false;

        let oldUUID = this.application.uuid;
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
    this.router.navigate(['/msp/application/review']);
  }
}
