import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolForm } from '../../models/enrol-form';
import { MspLogService } from '../../../../services/log.service';
import { MspApiEnrolmentService } from '../../services/msp-api-enrolment.service';
import { ApiStatusCodes } from 'moh-common-lib';
import { ApiResponse } from '../../../../models/api-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { EnrolDataService } from '../../services/enrol-data.service';

@Component({
  selector: 'msp-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent extends EnrolForm {

  captchaApiBaseUrl: string = environment.appConstants.captchaApiBaseUrl;

  constructor( protected enrolDataService: EnrolDataService,
               protected pageStateService: PageStateService,
               protected router: Router,
               private logService: MspLogService,
               private apiService: MspApiEnrolmentService ) {
  super( enrolDataService, pageStateService, router );
  }

  applicantAuthorizeOnChange(event: boolean) {
    // console.log('applicant authorization: ', event);
    this.mspApplication.authorizedByApplicant = event;

    if (this.mspApplication.authorizedByApplicant) {
      this.mspApplication.authorizedByApplicantDate = new Date();
    }
  }

  get hasSpouse() {
    return this.mspApplication.hasSpouse();
  }

  get label() {
    return 'Yes, I agree';
  }

  get questionApplicant() {
    return this.mspApplication.applicant.firstName + ' ' + this.mspApplication.applicant.lastName + ', do you agree?';
  }
  get questionSpouse() {
    return this.mspApplication.spouse.firstName + ' ' + this.mspApplication.spouse.lastName + ', do you agree?';
  }

  canContinue(): boolean {
    return super.canContinue() && !!this.mspApplication.authorizationToken;
  }

  // Override continue function
  continue() {

    console.log( this.form );

    if ( !this.canContinue() ) {
      this.markAllInputsTouched();
      return;
    }

    // Set page complete
    this.pageStateService.setPageComplete( this.router.url, this.enrolDataService.pageStatus );

    this.loading = true;
    this.logService.log({ name: 'Enrolment application submitting request' },
                        'Enrolment : Submission Request');

    this.apiService.sendRequest( this.mspApplication )
      .then((response: ApiResponse) => {
        this.loading = false;

        if (response instanceof HttpErrorResponse) {
          this.logService.log({
              name: 'Enrolment - System Error',
              confirmationNumber: this.mspApplication.uuid,
              url: this.router.url
          }, 'Enrolment - Submission Response Error' + response.message);

          this.mspApplication.regenUUID();
          this.mspApplication.authorizationToken = null;
          this.enrolDataService.saveApplication();
          return;
        }

        this.enrolDataService.application.referenceNumber = response.op_reference_number;
        const statusCode = (response.op_return_code === 'SUCCESS' ? ApiStatusCodes.SUCCESS : ApiStatusCodes.ERROR);

        this.logService.log({
          name: 'Enrolment - Received refNo ',
          confirmationNumber: this.enrolDataService.application.referenceNumber
        }, 'Enrolment - Submission Response Success');

        //delete the application from storage
        this.enrolDataService.removeApplication();

        //  go to confirmation
        this.router.navigate([ROUTES_ENROL.CONFIRMATION.fullpath],
                { queryParams: {
                    confirmationNum: this.enrolDataService.application.referenceNumber,
                    status: statusCode}
                });
      })
      .catch(error => {

        this.loading = false;

        let message = 'This error occurred because the system encountered an unanticipated situation ' +
        'which forced it to stop.';

        console.log('error in sending application: ', error);
        this.logService.log({
          name: 'Enrolment - Received Failure ',
          error: error._body,
          request: error._requestBody
        }, 'Enrolment - Submission Response Error');

        this.mspApplication.regenUUID();
        this.mspApplication.authorizationToken = null;
        this.enrolDataService.saveApplication();

        // Network error
        if ( error instanceof HttpErrorResponse ) {
          message = 'Try to submit your MSP Application again.';
        }

        // Navigate to error confirmation page
        this.router.navigate([ROUTES_ENROL.CONFIRMATION.fullpath],
          { queryParams: {
              status: ApiStatusCodes.ERROR,
              message: message
            }
          });
    });
  }
}
