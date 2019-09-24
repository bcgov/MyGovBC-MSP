import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MspDataService } from '../../../../services/msp-data.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolForm } from '../../models/enrol-form';

@Component({
  templateUrl: './review.component.html'
})
export class ReviewComponent extends EnrolForm {

  // routes
  personal_info = ROUTES_ENROL.PERSONAL_INFO.fullpath;
  spouse_info = ROUTES_ENROL.SPOUSE_INFO.fullpath;
  address_info = ROUTES_ENROL.CONTACT.fullpath;
  child_info = ROUTES_ENROL.CHILD_INFO.fullpath;

  constructor( protected dataService: MspDataService,
               protected pageStateService: PageStateService,
               protected router: Router ) {
    super( dataService, pageStateService, router );
  }

  get hasSpouse() {
    return this.mspApplication.spouse ? true : false;
  }

  get hasChildren() {
    return this.mspApplication.children && this.mspApplication.children.length > 0;
  }

  continue() {
    this._canContinue = true;
    this._nextUrl = ROUTES_ENROL.AUTHORIZE.fullpath;
    super.continue();
  }
}
