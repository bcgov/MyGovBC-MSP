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

@Component({
  templateUrl: './address.component.html'
})
export class EnrolAddressComponent extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('address') address: ElementRef;
  @ViewChild('mailingAddress') mailingAddress: ElementRef;
  @ViewChild('phone') phone: ElementRef;

  countryList: CountryList[] = COUNTRY_LIST;
  provinceList: ProvinceList[] = PROVINCE_LIST;

  public defaultCountry = CANADA;
  public defaultProvince = BRITISH_COLUMBIA;

  subscriptions: Subscription[];

  constructor(private dataService: MspDataService,
              protected router: Router,
              private pageStateService: PageStateService) {
    super(router);
  }

  get mspApplication() {
    return  this.dataService.mspApplication;
  }

  ngOnInit(){
    this.pageStateService.setPageIncomplete(this.router.url, this.mspApplication.pageStatus);
  }

  ngAfterViewInit() {
    if (this.form) {
      this.subscriptions = [
        this.form.valueChanges.pipe(
          debounceTime(100)
        ).subscribe(() => {
          this.dataService.saveMspApplication();
        })
      ];
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }

  canContinue(): boolean {
    return super.canContinue();
  }

  continue() {
    if ( !this.canContinue() ) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }

    this.pageStateService.setPageComplete(this.router.url, this.mspApplication.pageStatus);
    this.navigate(ROUTES_ENROL.REVIEW.fullpath);
  }
}
