import {AfterContentInit, Component} from '@angular/core';
import {Router} from '@angular/router';
import {MspLogService} from '../../../../services/log.service';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {MspApiBenefitService} from '../../services/msp-api-benefit.service';
import {HttpErrorResponse} from '@angular/common/http';
import {SuppBenefitApiResponse} from '../../models/suppBenefit-response.interface';


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
          .sendRequest(this.application)
          .then(response => {
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
            this.suppBenefitResponse = <SuppBenefitApiResponse> response;

            if (this.isFailure(this.suppBenefitResponse)) {
                this.logService.log({
                    name: 'Supplementary Benefit - DB Error',
                    confirmationNumber: this.application.uuid,
                    url: this.router.url
                }, 'Supplementary Benefit - Submission Response Error' + JSON.stringify(this.suppBenefitResponse));
                this.processErrorResponse(false);
                return;
            }
            const refNumber = response.referenceNumber;
            this.logService.log({
                name: 'Supplementary Benefit - Received refNo ',
                confirmationNumber: refNumber,
                url: this.router.url
            }, 'Supplementary Benefit - Submission Response Success');
            this.dataService.removeMspBenefitApp();

            this.router.navigate(['/benefit/confirmation'],
                {queryParams: {confirmationNum: refNumber}});
      });
  }

  processErrorResponse(transmissionInProcess: boolean) {
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
      this.router.navigate(['/benefit/authorize-submit']);
  }

  isFailure(suppBenefitApiResponse: SuppBenefitApiResponse): boolean {
      // has a reference number , is DB error code Y , is RAPID response Y then its not a failure
      if (suppBenefitApiResponse && suppBenefitApiResponse.referenceNumber && !suppBenefitApiResponse.dberrorMessage) {
          return false;
      }
      return true;
  }

}
