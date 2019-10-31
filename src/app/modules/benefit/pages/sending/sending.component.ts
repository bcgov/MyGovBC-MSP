import {AfterContentInit, Component} from '@angular/core';
import {Router} from '@angular/router';
import {MspLogService} from '../../../../services/log.service';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {MspApiBenefitService} from '../../services/msp-api-benefit.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiResponse} from '../../../../models/api-response.interface';


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
    suppBenefitResponse: ApiResponse;

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
        //console.log(this.application);
        // this.logService.log({name: 'PA - application submitting request'},"PA : Submission Request");
        // After view inits, begin sending the application
        this.service
          .sendRequest(this.application)
          .then((response: ApiResponse) => {
            // probable network errors..middleware could be down

            if (response instanceof HttpErrorResponse) {
                this.logService.log({
                    name: 'Supplementary Benefit - System Error',
                    confirmationNumber: this.application.uuid,
                    url: this.router.url
                }, 'Supplementary Benefit - Submission Response Error' + response.message);
                this.processErrorResponse(false);
                return;
            }

            // Business errors. Might be either a DB error.
            this.suppBenefitResponse = <ApiResponse> response;

            if (this.isFailure(this.suppBenefitResponse)) {
                console.log('isFailure', this.suppBenefitResponse);
                this.logService.log({
                    name: 'Supplementary Benefit - DB Error',
                    confirmationNumber: this.application.uuid,
                    url: this.router.url
                }, 'Supplementary Benefit - Submission Response Error' + JSON.stringify(this.suppBenefitResponse));
                this.processErrorResponse(false);
                return;
            }
            const refNumber = response.op_reference_number;
            const isCutOffDate = this.dataService.benefitApp.isCutoffDate;
            const hasCutoffYear =  (this.dataService.benefitApp.cutoffYear === this.dataService.benefitApp.taxYear) ? true : false;

            this.logService.log({
                name: 'Supplementary Benefit - Received refNo ',
                confirmationNumber: refNumber,
                url: this.router.url
            }, 'Supplementary Benefit - Submission Response Success');
            this.dataService.removeMspBenefitApp();

            this.router.navigate(['/benefit/confirmation'],
                {queryParams: {confirmationNum: refNumber, isCutOff: isCutOffDate, isCutOffyear: hasCutoffYear}});
      });
  }

  processErrorResponse(transmissionInProcess: boolean) {
      this.hasError = true;
      this.transmissionInProcess = transmissionInProcess;
      const oldUUID = this.application.uuid;
      this.application.regenUUID();
      console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.benefitApp.uuid);
      this.application.authorizationToken = null;
      this.dataService.saveBenefitApplication();
  }

  toggleErrorDetails(){
      this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

  retrySubmission(){
      this.router.navigate(['/benefit/authorize']);
  }

  isFailure(suppBenefitApiResponse: ApiResponse): boolean {
      // has a reference number , is DB error code Y , is RAPID response Y then its not a failure
    //   if (suppBenefitApiResponse && suppBenefitApiResponse.referenceNumber && !suppBenefitApiResponse.dberrorMessage) {
    //       return false;
    //   }
    if (!suppBenefitApiResponse) return true;
    return suppBenefitApiResponse.op_return_code === 'FAILURE';

  }

}
