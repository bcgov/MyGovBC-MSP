import { Component } from '@angular/core';
import { MspDataService } from '../../services/msp-data.service';
import { Router } from '@angular/router';
import { MspBenefitDataService } from '../../modules/benefit/services/msp-benefit-data.service';
import { ROUTES_ENROL } from '../../modules/enrolment/models/enrol-route-constants';
import { ROUTES_ACL } from '../../modules/request-acl/request-acl-route-constants';
import { AclDataService } from '../../modules/request-acl/services/acl-data.service';
import { EnrolDataService } from '../../modules/enrolment/services/enrol-data.service';

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
  newEnrollApp = 'New MSP Application for Enrolment';
  continueEnrollApp = 'Continue MSP Application for Enrolment';

  newPaApp = 'New MSP Application for Retroactive Premium Assistance';
  continuePaApp = 'Continue MSP Application for Retroactive Premium Assistance';

  newAccountApp = 'New MSP Account Change Request';
  continueAccountApp = 'Continue MSP Account Change Request';

  newAccountLetter = 'New MSP Account Confirmation Letter Request';
  continueAccountLetter = 'Continue MSP Account Confirmation Letter Request';

  newBenefitApp = 'New MSP Application for Supplementary Benefits';
  continueBenefitApp = 'Continue MSP Application for Supplementary Benefits';

  // routes
  checkEligibility = ROUTES_ENROL.CHECK_ELIG.fullpath;
  acl = ROUTES_ACL.REQUEST_ACL.fullpath;

  constructor(
    private mspDataService: MspDataService,
    private mspBenefitDataService: MspBenefitDataService,
    private aclDataService: AclDataService,
    private enrolDataService: EnrolDataService,
    private router: Router
  ) {}

  clearSavedFinAssisApp() {
    this.mspDataService.removeFinAssistApplication();
    this.router.navigate(['/assistance/home']);
  }

  clearSavedMspApp() {
    this.enrolDataService.removeApplication();
    this.router.navigate([this.checkEligibility]);
  }

  clearSavedAccountApp() {
    this.mspDataService.removeMspAccountApp();
    this.router.navigate(['/deam/home']);
  }

  clearSavedBenefitAssisApp() {
    this.mspBenefitDataService.removeMspBenefitApp();
    this.router.navigate(['/benefit/eligibility']);
  }

  clearSavedAclApplication() {
    this.aclDataService.removeApplication();
    this.router.navigate([this.acl]);
  }
}
