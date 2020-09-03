import {Component, Inject, Injectable, AfterContentInit, ViewChild, ElementRef, OnInit} from '@angular/core';
import {  MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspApiAccountService } from '../../services/msp-api-account.service';
import {Router} from '@angular/router';
import {ResponseType} from '../../../../modules/msp-core/api-model/responseTypes';
import {MspLogService} from '../../../../services/log.service';
import {ProcessService} from '../../../../services/process.service';
import { MspAccountApp } from '../../models/account.model';
import { Relationship } from '../../../../models/relationship.enum';
import { ApiResponse } from 'app/models/api-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiStatusCodes, ContainerService, PageStateService } from 'moh-common-lib';
import { BaseForm } from '../../models/base-form';

@Component({
  templateUrl: 'sending.component.html',
  styleUrls: ['./sending.component.scss']
})
@Injectable()
export class AccountSendingComponent extends BaseForm implements AfterContentInit, OnInit {
  lang = require('./i18n');
  static ProcessStepNum = 6;
  mspAccountApp: MspAccountApp;
  rawUrl: string;
  rawError: string;
  rawRequest: string;

  transmissionInProcess: boolean;
  hasError: boolean;
  showMoreErrorDetails: boolean;

  constructor(private dataService: MspAccountMaintenanceDataService,
              private service: MspApiAccountService,
              private processService: ProcessService,
              public router: Router,
              private logService: MspLogService,
              protected containerService: ContainerService,
              protected pageStateService: PageStateService) {
    super(router, containerService, pageStateService, processService)
    this.mspAccountApp = this.dataService.accountApp;
    this.transmissionInProcess = undefined;
    this.hasError = undefined;
    this.showMoreErrorDetails = undefined;
  }

  ngOnInit() {
    /* 
    If they do not have a valid auth token
    eg. they have already successfully submitted 
    and just hit the back button 
    */
    if (!this.mspAccountApp.hasValidAuthToken) {
      // Send them back to the home screen and reload the app
      location.assign('/msp');
    }
  }

  /**
   * always regnerate uuid for application and its images
   * When user use browser back button, the uuid are guaranteed to be unique for API server.
   */
  ngAfterContentInit() {
    if (this.mspAccountApp.hasValidAuthToken) {
      this.transmitRequest();
    }
  }

    transmitRequest(){

    // After view inits, begin sending the application
    this.transmissionInProcess = true;
    this.hasError = undefined;

      this.service
      .sendRequest(this.mspAccountApp)
      .then((response: ApiResponse) => {

        if (response && response.op_return_code !== 'SUCCESS') {
          console.log('Submission response: ', response.op_return_code);
        }

        if (response instanceof HttpErrorResponse) {
          this.logService.log({
              name: 'DEAM - System Error',
              confirmationNumber: this.mspAccountApp.referenceNumber,
              url: this.router.url
          }, 'DEAM - Submission Response Error' + response.message);
          this.processErrorResponse(false);
          return;
      }

      const refNumber = response.op_reference_number;

      const statusCode = (response.op_return_code === 'SUCCESS' ? ApiStatusCodes.SUCCESS : ApiStatusCodes.ERROR);

        let bcServicesCardElgible = false;
        let hasPrevMSPForChild = true;
        const hasChildAdded = (this.mspAccountApp.addedChildren.length > 0);
        const hasChildRemoved = (this.mspAccountApp.removedChildren.length > 0);

          //check if there is status in canada selected
          if (this.mspAccountApp.accountChangeOptions && this.mspAccountApp.accountChangeOptions.statusUpdate) {
              bcServicesCardElgible = true ;
          }

        //check any new beneficiary is added
          if (!bcServicesCardElgible && this.mspAccountApp.accountChangeOptions && this.mspAccountApp.accountChangeOptions.dependentChange) {
              if (this.mspAccountApp.addedSpouse && !this.mspAccountApp.addedSpouse.isExistingBeneficiary && this.mspAccountApp.addedSpouse.bcServiceCardShowStatus ) {
                  bcServicesCardElgible = true;
              }
            if (this.mspAccountApp.getAllChildren().filter( child => (child.relationship === Relationship.Child19To24 && !child.isExistingBeneficiary) ).length > 0) {
                bcServicesCardElgible = true;
            }
          }

        // Checks if at least one of the children has NO previous MSP coverage
          if (this.mspAccountApp.getAllChildren().filter( child => (!child.immigrationStatusChange) )){
            hasPrevMSPForChild = false;
          }

        //delete the application from storage
        this.dataService.removeMspAccountApp();

        this.pageStateService.setPageComplete();
        //  go to confirmation
          this.router.navigate(['/deam/confirmation'],
              {queryParams: {confirmationNum: refNumber, showDepMsg: bcServicesCardElgible, status: statusCode,
                hasSpouseAdded: this.mspAccountApp.hasSpouseAdded,
                hasSpouseRemoved: this.mspAccountApp.hasSpouseRemoved,
                hasPrevMSPForSpouse: this.mspAccountApp.addedSpouse.immigrationStatusChange,
                hasChildAdded: hasChildAdded,
                hasChildRemoved: hasChildRemoved,
                hasPrevMSPForChild: hasPrevMSPForChild
                }});

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

        this.mspAccountApp.authorizationToken = null;
        this.dataService.saveMspAccountApp();
      });
  }

  processErrorResponse(transmissionInProcess: boolean) {
    this.hasError = true;
    this.transmissionInProcess = transmissionInProcess;
    const oldUUID = this.mspAccountApp.uuid;
    this.mspAccountApp.regenUUID();
    this.mspAccountApp.authorizationToken = null;
    this.dataService.saveMspAccountApp();
  }

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

  retrySubmission(){
    this.pageStateService.setPageComplete();
    this.router.navigate(['/deam/authorize']);
  }
}
