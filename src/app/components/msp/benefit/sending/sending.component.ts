import {AfterContentInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MspLogService} from '../../service/log.service';
import {ResponseType} from '../../api-model/responseTypes';
import {MspApiService} from '../../service/msp-api.service';
import {BenefitApplication} from '../../model/benefit-application.model';
import {MspBenefitDataService} from '../../service/msp-benefit-data.service';
import {MspApiBenefitService} from '../../service/msp-api-benefit.service';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';

import {SuppBenefitApiResponse} from '../../model/suppBenefit-response.interface'
import { BenefitApplicationType } from '../../api-model/benefitTypes';


@Component({
  selector: 'msp-benefit-sending',
  templateUrl: './sending.component.html',
  styleUrls: ['./sending.component.scss']
})
export class BenefitSendingComponent implements AfterContentInit  {
    lang = require('./i18n');

    application: BenefitApplication;
    rawUrl: string;
    rawError: string;
    rawRequest: string;

    transmissionInProcess: boolean;
    hasError: boolean;
    showMoreErrorDetails: boolean;
    suppBenefitResponse: SuppBenefitApiResponse;

    constructor(private dataService: MspBenefitDataService,
                private service: MspApiBenefitService,
                public router: Router,
                public logService: MspLogService) {
        this.application = this.dataService.benefitApp;
    }

    ngAfterContentInit() {
        // After view inits, begin sending the application
    this.transmissionInProcess = true;
    this.hasError = false;
     // this.logService.log({name: 'PA - application submitting request'},"PA : Submission Request");
    // After view inits, begin sending the application
    this.service
      .sendRequest(this.application, this.application.uuid)
      .then(response => {
        console.log(response);
         // business errors.. Might be either a DB error
        this.service
         .sendApplication(this.application, this.application.uuid)
         .subscribe(response => { 
           // probable network errors..middleware could be down
            if (response instanceof HttpErrorResponse) { 
                this.processErrorResponse(response, response.message, false);
                this.logService.log({
                    name: 'SuppBenefit - System Error',
                    confirmationNumber: this.application.uuid
                }, 'SuppBenefit - Submission Response Error' + response.message); 

                return;
            }
          this.suppBenefitResponse = <SuppBenefitApiResponse> response;
          console.log(this.suppBenefitResponse);
          if (this.isFailure(this.suppBenefitResponse)) {
            this.processErrorResponse(response, undefined ,false);
            this.logService.log({
                name: 'SuppBenefit - DB Error',
                confirmationNumber: this.application.uuid
            }, 'SuppBenefit - Submission Response Error' + JSON.stringify(this.suppBenefitResponse));
            
              return;
          } else {
              //delete the application from storage
              this.dataService.removeMspBenefitApp();
              const refNumber = this.suppBenefitResponse.referenceNumber;
              console.log(refNumber);
              this.logService.log({
                  name: 'SuppBenefit - Received refNo ',
                  confirmationNumber: refNumber
              }, 'SuppBenefit - Submission Response Success');
              this.router.navigate(['/msp/benefit/confirmation'],
                  {queryParams: {confirmationNum: refNumber}});
          }
          
         });
     
  });
  
}

processErrorResponse(response: HttpErrorResponse, errorMessage: string , transmissionInProcess: boolean) {
  console.log('Error Response :' + response);
 // this.rawError = (errorMessage != null && errorMessage != 'undefined') ? errorMessage : undefined;
  this.hasError = true;
  this.transmissionInProcess = transmissionInProcess;
  const oldUUID = this.application.uuid;
  this.application.regenUUID();
  console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspApplication().uuid);
  this.application.authorizationToken = null;
  this.dataService.saveBenefitApplication();

}

toggleErrorDetails(){
  this.showMoreErrorDetails = !this.showMoreErrorDetails;
}

retrySubmission(){
  this.router.navigate(['/msp/benefit/authorize-submit']);
}

isFailure(suppBenefitApiResponse: SuppBenefitApiResponse):boolean {
  // has a reference number , is DB error code Y , is RAPID response Y then its not a failure
  if (suppBenefitApiResponse.referenceNumber && !suppBenefitApiResponse.dberrorMessage) {
      return false;
  }

  return true;
}

}