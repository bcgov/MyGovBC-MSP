import { Component, ViewChild } from '@angular/core';
// import { MspDataService } from '../service/msp-data.service';
import { MspDataService } from '../../services/msp-data.service';

import { Router } from '@angular/router';
import { MspBenefitDataService } from '../../modules/benefit/services/msp-benefit-data.service';

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
    this.router.navigate(['/enrolment/prepare']);
  }

  clearSavedAccountApp() {
    this.mspDataService.removeMspAccountApp();
    this.router.navigate(['/account/prepare']);
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
