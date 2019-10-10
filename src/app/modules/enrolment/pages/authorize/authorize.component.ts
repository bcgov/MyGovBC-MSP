import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MspDataService } from '../../../../services/msp-data.service';
import { environment } from '../../../../../environments/environment';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolForm } from '../../models/enrol-form';

@Component({
  selector: 'msp-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent extends EnrolForm {

  captchaApiBaseUrl: string = environment.appConstants.captchaApiBaseUrl;
  displayError: boolean = false;

  constructor( protected dataService: MspDataService,
               protected pageStateService: PageStateService,
               protected router: Router ) {
  super( dataService, pageStateService, router );
  }

  applicantAuthorizeOnChange(event: boolean) {
    // console.log('applicant authorization: ', event);
    this.mspApplication.authorizedByApplicant = event;

    if (this.mspApplication.authorizedByApplicant) {
      this.mspApplication.authorizedByApplicantDate = new Date();
    }
  }

  get hasSpouse() {
    return this.mspApplication.spouse ? true : false;
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
    this.displayError = !this.mspApplication.hasValidAuthToken;
    return super.canContinue() && this.mspApplication.hasValidAuthToken;
  }

  continue() {
    console.log( this.form );
    this._nextUrl = ROUTES_ENROL.SENDING.fullpath;
    this._canContinue = this.canContinue();

    super.continue();
  }
}
