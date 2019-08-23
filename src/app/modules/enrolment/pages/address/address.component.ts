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
import { CoreContactInfoComponent } from 'app/modules/msp-core/components/core-contact-info/core-contact-info.component';

@Component({
  templateUrl: './address.component.html'
})
export class EnrolAddressComponent extends BaseComponent {

  // // LABEL CONSTANTS
  // contactInfoLabel = 'Contact Information';
  // contractInfoText = 'Please provide the Account Holder\'s contact information.';
  // residentialAddressLabel = 'Residential Address';
  // residentialAddressText = 'Enter your residential address - that\'s the address your currently reside at in B.C.';
  // sameMailingAddress = 'This is my mailing address.';
  // mailingAddressLabel = 'Mailing Address';
  // mailingAddressText = 'Enter your mailing address - if it\'s different';
  // differentMailingAddress = 'My mailing address is different';
  // phoneLabel = 'Phone';
  // phoneText = 'Please provide a phone number so you may be contacted in case of any issues with your application.';

  // // Constants TODO: Figure out whether used in html
  // outsideBCFor30DaysLabel = 'Have you or any family member been outside BC for more than 30 days in total during the past 12 months?';
  // addAnotherOutsideBCPersonButton = 'Add Another Person';
  // provideDifferentMailingAddress = 'I want to provide a mailing address that is different from the residential address above.';

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
  private coreContactInfo = new CoreContactInfoComponent(this.cdr);

  constructor(private dataService: MspDataService,
              private _router: Router,
             // private _processService: ProcessService,
              private cd: ChangeDetectorRef,
             // private checkCompleteBaseService: CheckCompleteBaseService
               ) {
    super(cd);
    this.mspApplication = this.dataService.getMspApplication();
    //this.mspApplication.mailingSameAsResidentialAddress = true;
  }
  ngOnInit(){
   // this.initProcessMembers(EnrolAddressComponent.ProcessStepNum, this._processService);
    //this.checkCompleteBaseService.setPageIncomplete();
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.dataService.saveMspApplication();
    });
  }

  handlePhoneNumberChange(evt: any) {
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

  // handlePhoneUpdate(evt: any)(){}

  canContinue(){
    // re-write this with proper validations.
    console.log('ADDRESS - MAILING SAME AS RESIDENTIAL?:' + this.coreContactInfo.hasSameResidentialAddress());
    if (this.coreContactInfo.hasSameResidentialAddress()) {
      // if (!isValidMailingAddress()){
      //   return false;
      // }
      return true;
    }
    return false;
    // if (isValidResidentialAddress()){
    //   return true;
    // });
    // if (this.mspApplication.mailingSameAsResidentialAddress === false){
    //   return true;
    // }
    // return false;
  }

  continue() {
  console.log('combinedValidationState on address: %s', );
    if (!this.isAllValid()){
      console.log('Please fill in all required fields on the form.');
    }else{
     // this._processService.setStep(4, true);
     // this.checkCompleteBaseService.setPageComplete();
      this._router.navigate([ROUTES_ENROL.REVIEW.fullpath]);
    }
  }
}
