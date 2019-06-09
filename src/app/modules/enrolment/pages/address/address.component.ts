import { ChangeDetectorRef, Input, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../components/msp/service/msp-data.service';
import { MspApplication } from '../../../../components/msp/model/application.model';
import { BaseComponent } from '../../../../components/msp/common/base.component';
import { ProcessService } from '../../../../components/msp/service/process.service';
import { Router } from '@angular/router';
import { Address } from 'moh-common-lib';

import {
  CountryList,
  ProvinceList,
  CANADA,
  BRITISH_COLUMBIA
} from 'moh-common-lib';
import { countryData, provinceData } from '../../../../models/msp-constants';

@Component({
  templateUrl: './address.component.html'
})
export class EnrolAddressComponent extends BaseComponent {

  // Constants TODO: Figure out whether used in html
  outsideBCFor30DaysLabel = 'Have you or any family member been outside BC for more than 30 days in total during the past 12 months?';
  addAnotherOutsideBCPersonButton = 'Add Another Person';
  sameMailingAddress = 'Use this as my mailing address.';
  provideDifferentMailingAddress = 'I want to provide a mailing address that is different from the residential address above.';


  static ProcessStepNum = 4;

  @ViewChild('formRef') form: NgForm;
  @ViewChild('address') address: ElementRef;
  @ViewChild('mailingAddress') mailingAddress: ElementRef;
  @ViewChild('phone') phone: ElementRef;
  
  countryList: CountryList[] = countryData;
  provinceList: ProvinceList[] = provinceData;

  public defaultCountry = CANADA;
  public defaultProvince = BRITISH_COLUMBIA;


  mspApplication: MspApplication;

  constructor(private dataService: MspDataService,
              private _router: Router,
              private _processService: ProcessService,
              private cd: ChangeDetectorRef) {
    super(cd);
    this.mspApplication = this.dataService.getMspApplication();
    this.mspApplication.mailingSameAsResidentialAddress = true;
  }
  ngOnInit(){
    this.initProcessMembers(EnrolAddressComponent.ProcessStepNum, this._processService);
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.dataService.saveMspApplication();
    });
  }

  handlePhoneNumberChange(evt: any) {
    console.log('Abhi phone num--'+evt);
    this.mspApplication.phoneNumber = evt;
    this.dataService.saveMspApplication();
  }

  toggleMailingSameAsResidentialAddress(evt: boolean){
    this.mspApplication.mailingSameAsResidentialAddress = !evt;
    if (evt){
      this.mspApplication.mailingAddress = new Address();
    }
    this.dataService.saveMspApplication();
  }

  toggleCheckBox(){
    this.mspApplication.mailingSameAsResidentialAddress = !this.mspApplication.mailingSameAsResidentialAddress;
    this.dataService.saveMspApplication();
  }

  handleAddressUpdate(evt: any){
    console.log(evt);
    console.log('address update event: %o', evt);
    evt.addressLine1 = evt.street;
    this.dataService.saveMspApplication();
  }

  canContinue(){
    return this.isAllValid();
  }

  continue() {
    // console.log('personal info form itself valid: %s', this.form.valid);
    console.log('combinedValidationState on address: %s', this.isAllValid());
    
    if (!this.isAllValid()){
      console.log('Please fill in all required fields on the form.');
    }else{
     // this._processService.setStep(4, true);
      this._router.navigate(['/msp/application/review']);
    }
  }
}