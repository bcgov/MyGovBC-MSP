import { ChangeDetectorRef, Input, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { BenefitApplication } from '../../models/benefit-application.model';
import { BaseComponent } from '../../../../models/base.component';
import { ProcessService } from '../../../../services/process.service';
import { Router } from '@angular/router';

import {  ProvinceList, PROVINCE_LIST, CountryList, CANADA, BRITISH_COLUMBIA, Address, COUNTRY_LIST, CheckCompleteBaseService } from 'moh-common-lib';
import { environment } from 'environments/environment';
//import { CountryList,ProvinceList,countryData, provinceData } from '../../../../models/msp-constants';

@Component({
  templateUrl: './address.component.html'
})

export class BenefitAddressComponent extends BaseComponent {
  // Constants TODO: Figure out whether used in html
  outsideBCFor30DaysLabel = 'Have you or any family member been outside BC for more than 30 days in total during the past 12 months?';
  addAnotherOutsideBCPersonButton = 'Add Another Person';
  sameMailingAddress = 'Use this as my mailing address.';
  provideDifferentMailingAddress = 'I want to provide a mailing address that is different from the residential address above.';

  static ProcessStepNum = 3;

  @ViewChild('formRef') form: NgForm;
  @ViewChild('address') address: ElementRef;
  @ViewChild('mailingAddress') mailingAddress: ElementRef;
  @ViewChild('phone') phone: ElementRef;

  mspApplication: BenefitApplication;
  public readonly addressServiceUrl: string = environment.appConstants.addressApiBaseUrl;

  constructor(private dataService: MspBenefitDataService,
              private _router: Router,
              private _processService: ProcessService,
              private cd: ChangeDetectorRef) {
    super(cd);
    this.mspApplication = this.dataService.benefitApp;
  }

  ngOnInit() {
    this.initProcessMembers(BenefitAddressComponent.ProcessStepNum, this._processService);
    this._processService.setStep(BenefitAddressComponent.ProcessStepNum, false);
  }

  ngAfterViewInit(): void {
    if ( this.mspApplication.mailingAddress.addressLine1 != null) {
      this.dataService.benefitApp.mailingAddress.hasValue = true;
    }

    if ( this.mspApplication.mailingAddress.province === undefined || this.mspApplication.mailingAddress.province === null ) {
      this.dataService.benefitApp.mailingAddress.province = '';
    }

    this.form.valueChanges.subscribe(values => {
      this.dataService.saveBenefitApplication();
    });
  }

  handlePhoneNumberChange(evt: any) {
    this.mspApplication.phoneNumber = evt;
    this.dataService.saveBenefitApplication();
  }

  handleAddressUpdate(evt: any){
    this.dataService.saveBenefitApplication();
  }

  canContinue() {
    const phonepattern =  '^[2-9]([0-9]{9})$';
    const regEx = new RegExp(phonepattern);
    return this.isAllValid();
  }

  continue() {

   // const phonepattern =  '^[2-9]([0-9]{9})$';
   // const phoneMatched = this.mspApplication.phoneNumber.match(phonepattern);

    if (!this.isAllValid()){
      console.log('Please fill in all required fields on the form.');
    } else {
      this._processService.setStep(BenefitAddressComponent.ProcessStepNum, true);
      this._router.navigate(['/benefit/review']);
    }
  }
}
