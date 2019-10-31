import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolForm } from '../../models/enrol-form';
import { EnrolDataService } from '../../services/enrol-data.service';

@Component({
  templateUrl: './address.component.html'
})
export class EnrolAddressComponent extends EnrolForm {

  constructor( protected enrolDataService: EnrolDataService,
               protected pageStateService: PageStateService,
               protected router: Router ) {
    super( enrolDataService, pageStateService, router );
  }

  get application() {
    return this.enrolDataService.application;
  }

  get residentialAddress() {
    return this.application.residentialAddress;
  }

  get mailingAddress() {
    return this.application.mailingAddress;
  }

  get mailingSameAsResidentialAddress() {
    return this.application.mailingSameAsResidentialAddress;
  }

  get phoneNumber() {
    return this.application.phoneNumber;
  }

  set phoneNumber( val: string ) {
    this.application.phoneNumber = val;
  }

  continue() {
    this._nextUrl = ROUTES_ENROL.REVIEW.fullpath;
    this._canContinue = super.canContinue();
    super.continue();
  }

  toggleCheckBox(){
    this.application.mailingSameAsResidentialAddress = !this.application.mailingSameAsResidentialAddress;
  }
}
