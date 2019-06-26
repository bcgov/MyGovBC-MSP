import { ChangeDetectorRef, Input, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {BenefitApplication} from '../../models/benefit-application.model';
import { BaseComponent } from '../../../../models/base.component';
import { ProcessService } from '../../../../services/process.service';
import { Router } from '@angular/router';


import {  ProvinceList, CountryList, CANADA, BRITISH_COLUMBIA, Address, COUNTRY_LIST, CheckCompleteBaseService } from 'moh-common-lib';
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
  
  countryList: CountryList[] = COUNTRY_LIST;
  provinceList: ProvinceList[] = [
    {
      provinceCode: 'AB',
      description: 'Alberta',
	  country:'CAN'
	  
    },
    {
      provinceCode: 'BC',
      description: 'British Columbia',
	  country:'CAN'
    },
    {
      provinceCode: 'MB',
      description: 'Manitoba',
	  country:'CAN'
    },
    {
      provinceCode: 'NB',
      description: 'New Brunswick',
	  country:'CAN'
    },
    {
      provinceCode: 'NL',
      description: 'Newfoundland and Labrador',
	  country:'CAN'
    },
    {
      provinceCode: 'NS',
      description: 'Nova Scotia',
	  country:'CAN'
    },
    {
      provinceCode: 'NU',
      description: 'Nunavut',
	  country:'CAN'
    },
    {
      provinceCode: 'NT',
      description: 'Northwest Territories',
	  country:'CAN'
    },
    {
      provinceCode: 'ON',
      description: 'Ontario',
	  country:'CAN'
    },
    {
      provinceCode: 'PE',
      description: 'Prince Edward Island',
	  country:'CAN'
    },
    {
      provinceCode: 'QC',
      description: 'Quebec',
	  country:'CAN'
    },
    {
      provinceCode: 'SK',
      description: 'Saskatchewan',
	  country:'CAN'
    },
    {
      provinceCode: 'YT',
      description: 'Yukon',
	  country:'CAN'
    }
  ];

  public defaultCountry = CANADA;
  public defaultProvince = BRITISH_COLUMBIA;


  mspApplication: BenefitApplication;

  constructor(private dataService: MspBenefitDataService,
              private _router: Router,
              private _processService: ProcessService,
              private cd: ChangeDetectorRef) {
    super(cd);
    this.mspApplication = this.dataService.benefitApp;
  }

  ngOnInit(){
    this.initProcessMembers(BenefitAddressComponent.ProcessStepNum, this._processService);
  }

  ngAfterViewInit(): void {
    
    if( this.mspApplication.residentialAddress.addressLine1 != null) {
      this.dataService.benefitApp.residentialAddress.hasValue = true;
    }

    this.form.valueChanges.subscribe(values => {
      
      this.dataService.saveBenefitApplication();
    });
  }

  handlePhoneNumberChange(evt: any) {
    this.mspApplication.phoneNumber = evt;
    this.dataService.saveBenefitApplication();
  }

  toggleMailingSameAsResidentialAddress(evt: boolean){
    this.mspApplication.mailingSameAsResidentialAddress = !evt;
    if (evt){
      this.mspApplication.mailingAddress = new Address();
    }
    this.dataService.saveBenefitApplication();
  }

  toggleCheckBox(){
    this.mspApplication.mailingSameAsResidentialAddress = !this.mspApplication.mailingSameAsResidentialAddress;
    this.dataService.saveBenefitApplication();
  }

  handleAddressUpdate(evt: any){
    console.log(evt);
    console.log('address update event: %o', evt);
    evt.addressLine1 = evt.street;
    if(evt.addressLine1 != null) {
      this.dataService.benefitApp.residentialAddress.hasValue = true;

    }
    this.dataService.saveBenefitApplication();
  }

  canContinue(){
    this._processService.setStep(BenefitAddressComponent.ProcessStepNum, true);
    return this.isAllValid();
  }

  continue() {
    // console.log('personal info form itself valid: %s', this.form.valid);
    console.log('combinedValidationState on address: %s', this.isAllValid());
    
    if (!this.isAllValid()){
      console.log('Please fill in all required fields on the form.');
    }else{
      this._processService.setStep(BenefitAddressComponent.ProcessStepNum, true);
      this._router.navigate(['/benefit/review']);
    }
  }
}
