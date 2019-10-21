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

  continue() {
    this._canContinue = super.canContinue();
    this._nextUrl = ROUTES_ENROL.REVIEW.fullpath;
    super.continue();
  }
}
