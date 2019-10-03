import { Component } from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import { Router } from '@angular/router';

import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolForm } from '../../models/enrol-form';

@Component({
  templateUrl: './address.component.html'
})
export class EnrolAddressComponent extends EnrolForm {

  constructor( protected dataService: MspDataService,
               protected pageStateService: PageStateService,
               protected router: Router ) {
  super( dataService, pageStateService, router );
  }
  
  continue() {
    this._canContinue = super.canContinue();
    this._nextUrl = ROUTES_ENROL.REVIEW.fullpath;
    super.continue();
  }
}
