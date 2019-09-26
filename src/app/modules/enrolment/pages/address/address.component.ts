import { ChangeDetectorRef, Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspApplication } from '../../models/application.model';
import { BaseComponent } from '../../../../models/base.component';
import { Router } from '@angular/router';
import { PROVINCE_LIST, COUNTRY_LIST, AbstractForm } from 'moh-common-lib';

import {
  CountryList,
  ProvinceList,
  CANADA,
  BRITISH_COLUMBIA
} from 'moh-common-lib';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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
