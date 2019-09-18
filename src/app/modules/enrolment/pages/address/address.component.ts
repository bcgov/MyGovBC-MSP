import { ChangeDetectorRef, Input, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspApplication } from '../../models/application.model';
import { BaseComponent } from '../../../../models/base.component';
import { ProcessService } from '../../../../services/process.service';
import { Router } from '@angular/router';
import { Address, PROVINCE_LIST, COUNTRY_LIST, CheckCompleteBaseService } from 'moh-common-lib';

import {
  CountryList,
  ProvinceList,
  CANADA,
  BRITISH_COLUMBIA
} from 'moh-common-lib';
import { MspAddressConstants } from '../../../../models/msp-address.constants';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { CoreContactInfoComponent } from 'app/modules/msp-core/components/core-contact-info/core-contact-info.component';

@Component({
  templateUrl: './address.component.html'
})
export class EnrolAddressComponent extends BaseComponent {

  static ProcessStepNum = 4;

  @ViewChild('formRef') form: NgForm;
  @ViewChild('address') address: ElementRef;
  @ViewChild('mailingAddress') mailingAddress: ElementRef;
  @ViewChild('phone') phone: ElementRef;

  countryList: CountryList[] = COUNTRY_LIST;
  provinceList: ProvinceList[] = PROVINCE_LIST;

  public defaultCountry = CANADA;
  public defaultProvince = BRITISH_COLUMBIA;

  private cdr: ChangeDetectorRef;
  mspApplication: MspApplication;

  constructor(private dataService: MspDataService,
              private _router: Router,
              private pageStateService: PageStateService,
              private cd: ChangeDetectorRef) {
    super(cd);
    this.mspApplication = this.dataService.mspApplication;

  }
  ngOnInit(){
    this.pageStateService.setPageIncomplete(this._router.url, this.mspApplication.pageStatus);
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.dataService.saveMspApplication();
    });
  }

  canContinue(): boolean {
    const controls = this.form.form.controls;
    for (const control in controls) {
      if (controls[control].invalid) {
        return false;
      }
    }
    return true;
  }

  continue() {
    if (this.canContinue() === false){
      console.log('Please fill in all required fields on the form.');
    } else{
      this.pageStateService.setPageComplete(this._router.url, this.mspApplication.pageStatus);
      this._router.navigate([ROUTES_ENROL.REVIEW.fullpath]);
    }
  }
}
