import {AfterContentInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MspLogService} from '../../service/log.service';
import {ResponseType} from '../../api-model/responseTypes';
import {MspApiService} from '../../service/msp-api.service';
import {BenefitApplication} from '../../model/benefit-application.model';
import {MspBenefitDataService} from '../../service/msp-benefit-data.service';
import {MspApiBenefitService} from '../../service/msp-api-benefit.service';

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
            .sendApplication(this.application)
            .then((application: BenefitApplication) => {
                this.application = application;

                this.logService.log({name: 'PA - received refNo ',
                    confirmationNumber: this.application.referenceNumber}, 'PA - Submission Response Success ');

                //delete the benefit app content from local storage
                this.dataService.removeMspBenefitApp();

                //  go to confirmation
                this.router.navigate(['/msp/benefit/confirmation'],
                    {queryParams: {confirmationNum: this.application.referenceNumber}});

            })
            .catch((error: ResponseType | any) => {
                console.log('Error in sending PA: %o', error);
                this.hasError = true;

                this.rawUrl = error.url;
                this.rawError = error;
                this.rawRequest = error._requestBody;

                this.logService.log({name: 'PA - Received Failure ',
                    error: error._body,
                    request: error._requestBody}, 'PA - Submission Response Error' );
                this.transmissionInProcess = false;
                const oldUUID = this.application.uuid;
                this.application.regenUUID();

                console.log('PA uuid updated: from %s to %s', oldUUID, this.dataService.benefitApp.uuid);

                this.application.authorizationToken = null;
                this.dataService.saveBenefitApplication() ;
            });
    }

    toggleErrorDetails(){
        this.showMoreErrorDetails = !this.showMoreErrorDetails;
    }

    retrySubmission(){
        this.router.navigate(['/msp/benefit/authorize-submit']);
    }

}
