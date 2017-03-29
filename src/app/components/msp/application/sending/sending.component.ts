import {Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import DataService from '../../service/msp-data.service';
import {MspApiService} from "../../service/msp-api.service";
import {Router} from "@angular/router";
import {ResponseType} from "../../api-model/responseTypes";
import {MspLogService} from '../../service/log.service'
import './sending.component.less';

@Component({
  templateUrl: 'sending.component.html'
})
@Injectable()
export class SendingComponent implements AfterViewInit {
  lang = require('./i18n');

  application: MspApplication;
  rawUrl: string;
  rawError: string;
  rawRequest: string;

  transmissionInProcess:boolean;
  errorCode:string;
  showMoreErrorDetails:boolean;
  
  constructor(private dataService: DataService, private service: MspApiService, public router: Router, private logService: MspLogService) {
    this.application = this.dataService.getMspApplication();
    this.transmissionInProcess = undefined;
    this.errorCode = undefined;
    this.showMoreErrorDetails = undefined;
  }

  ngAfterViewInit() {
    // this.transmissionInProcess = true;
    // setTimeout(
    //   ()=>{
    //     this.transmissionInProcess = false;
    //   }, 3000
    // );
    this.transmitApplication();
  }

  transmitApplication(){
    // After view inits, begin sending the application
    this.transmissionInProcess = true;
    this.errorCode = undefined;
    this.service
      .sendApplication(this.application)
      .then((application: MspApplication) => {
        this.application = application;
        this.logService.log({name: 'enrollment application received success confirmation from API server', 
          confirmationNumber: this.application.referenceNumber});

        let tempRef = this.application.referenceNumber;
        //  go to confirmation
        this.router.navigate(["/msp/application/confirmation"], 
          {queryParams: {confirmationNum:tempRef}});

        //delete the application from storage
        this.dataService.removeMspApplication();
      }).catch((error: ResponseType | any) => {
        console.log('error in sending application: ', error);
        this.errorCode = error.status + '';
        this.rawUrl = error.url;
        this.rawError = error;
        this.rawRequest = error._requestBody
        this.logService.log({name: 'enrollment application received failure message from API server', 
          error: error._body,
          request: error._requestBody});
        this.transmissionInProcess = false;

        this.application.authorizationToken = null;
      });

  }

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }
}
