import { Component } from '@angular/core';
import { MspDataService } from '../../services/msp-data.service';
import { Router } from '@angular/router';
import { MspBenefitDataService } from '../../modules/benefit/services/msp-benefit-data.service';
import { ROUTES_ENROL } from '../../modules/enrolment/models/enrol-route-constants';

/**
 * Application for MSP
 *
 * IMG_2336.jpg
 * https://apps.gcpe.gov.bc.ca/jira/browse/PSPDN-255?filter=16000
 */
@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  // Constants for page - TODO: figure out which ones are common throughout application
  newEnrollApp = 'New MSP enrolment application';
  newAccountLetter = 'MSP Account Confirmation Letter Request';
  newPaApp = 'New MSP premium assistance application';
  continueEnrollApp = 'Continue enrolment application';
  continuePaApp = 'Continue premium assistance application';
  newAccountApp = 'MSP Account Change Request';
  continueAccountApp = 'Continue MSP Account Change Request';
  continueAccountLetter = 'Continue Account Confirmation letter application';
  newBenefitApp = 'New Supplementary Benefits application';
  continueBenefitApp = 'Continue Supplementary Benefits application';


  // routes
  checkEligibility = ROUTES_ENROL.CHECK_ELIG.fullpath;

  constructor(
    private mspDataService: MspDataService,
    private mspBenefitDataService: MspBenefitDataService,
    private router: Router
  ) {}

  clearSavedFinAssisApp() {
    console.log('deleting saved fin assist app.');
    this.mspDataService.removeFinAssistApplication();
    this.router.navigate(['/assistance/home']);
  }

  clearSavedMspApp() {
    this.mspDataService.removeMspApplication();
    this.router.navigate([this.checkEligibility]);
  }

  clearSavedAccountApp() {
    this.mspDataService.removeMspAccountApp();
    this.router.navigate(['/account/home']);
  }

  clearSavedAccountLetterApp() {
    this.mspDataService.removeMspAccountLetterApp();
    this.router.navigate(['/account-letter/personal-info']);
  }

  clearSavedBenefitAssisApp() {
    this.mspBenefitDataService.removeMspBenefitApp();
    this.router.navigate(['/benefit/eligibility']);
  }
}
