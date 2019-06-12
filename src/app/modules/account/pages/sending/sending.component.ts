import {Component, Inject, Injectable, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import {MspApiService} from '../../../../services/msp-api.service';
import {Router} from '@angular/router';
import {ResponseType} from '../../../../modules/enrolment/pages/api-model/responseTypes';
import {MspLogService} from '../../../../services/log.service';
import {ProcessService} from '../../../../services/process.service';
import { MspAccountApp } from '../../models/account.model';
import { Relationship } from '../../../../models/status-activities-documents';


@Component({
  templateUrl: 'sending.component.html',
  styleUrls: ['./sending.component.scss']
})
@Injectable()
export class AccountSendingComponent implements AfterContentInit {
  lang = require('./i18n');

  mspAccountApp: MspAccountApp;
  rawUrl: string;
  rawError: string;
  rawRequest: string;

  transmissionInProcess: boolean;
  hasError: boolean;
  showMoreErrorDetails: boolean;

  constructor(private dataService: MspDataService, private service: MspApiService, private processService: ProcessService,
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
  //  this.logService.log({name: 'Account - Submitting Request'},"Account - Submission Request");
    this.service
      .sendApplication(this.mspAccountApp)
      .then((mspAccountApp: MspAccountApp) => {
        this.mspAccountApp = mspAccountApp;
        this.logService.log({name: 'Account - Received refNo ',
          confirmationNumber: this.mspAccountApp.referenceNumber}, 'Account - Submission Response Success ');

        const tempRef = this.mspAccountApp.referenceNumber;
          let bcServicesCardElgible = false;
          //check if there is status in canada selected
          if (this.mspAccountApp.accountChangeOptions.statusUpdate) {
              bcServicesCardElgible = true ;
          }


        //check any new beneficiary is added
          if (!bcServicesCardElgible && this.mspAccountApp.accountChangeOptions.dependentChange) {
              if (this.mspAccountApp.addedSpouse && !this.mspAccountApp.addedSpouse.isExistingBeneficiary && this.mspAccountApp.addedSpouse.bcServiceCardShowStatus ) {
                  bcServicesCardElgible = true;
              }
            if (this.mspAccountApp.getAllChildren().filter( child => (child.relationship == Relationship.Child19To24 && !child.isExistingBeneficiary) ).length > 0) {
                bcServicesCardElgible = true;
            }
          }

        //delete the application from storage
        this.dataService.removeMspAccountApp();

        //  go to confirmation

          this.router.navigate(['/msp/account/confirmation'],
              {queryParams: {confirmationNum: tempRef, showDepMsg: bcServicesCardElgible}});



      }).catch((error: ResponseType | any) => {
        console.log('error in sending request: ', error);
        this.hasError = true;
        this.rawUrl = error.url;
        this.rawError = error;
        this.rawRequest = error._requestBody;
        this.logService.log({name: 'Account - Received Failure ',
          error: error._body,
          request: error._requestBody}, 'Account - Submission Response Failure');
        this.transmissionInProcess = false;

        const oldUUID = this.mspAccountApp.uuid;
       this.mspAccountApp.regenUUID();

       console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspAccountApp().uuid);

        this.mspAccountApp.authorizationToken = null;
        this.dataService.saveMspAccountApp();
      });

  }

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

  retrySubmission(){
    this.router.navigate(['/msp/account/review']);
  }
}
