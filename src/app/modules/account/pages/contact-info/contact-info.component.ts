
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import {ProcessService, ProcessUrls} from '../../../../services/process.service';
import { environment } from '../../../../../environments/environment';
import { MspAccountApp, MspPerson } from '../../models/account.model';
import { ChangeDetectorRef, Input, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Address, PROVINCE_LIST, COUNTRY_LIST, CheckCompleteBaseService } from 'moh-common-lib';

import {
  CountryList,
  ProvinceList,
  CANADA,
  BRITISH_COLUMBIA
} from 'moh-common-lib';
import { MspAddressConstants } from '../../../../models/msp-address.constants';
//import { ROUTES_ENROL } from '../../../models/enrol-route-constants';


import { BaseComponent } from '../../../../models/base.component';


@Component({
  selector: 'msp-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent extends BaseComponent  implements OnInit {

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
   provinceList: ProvinceList[] = PROVINCE_LIST;
 
   public defaultCountry = CANADA;
   public defaultProvince = BRITISH_COLUMBIA;
 
   mspAccountApp: MspAccountApp;
 
   constructor(private dataService: MspAccountMaintenanceDataService,
               private _router: Router,
               private _processService: ProcessService,
               private cd: ChangeDetectorRef) {
     super(cd);
     this.mspAccountApp = this.dataService.accountApp;
   }
 
   ngOnInit(){
     //this.initProcessMembers(ContactInfoComponent.ProcessStepNum, this._processService);
     //this._processService.setStep(BenefitAddressComponent.ProcessStepNum, false);
   }

   toggleCheckBox(){
    this.mspAccountApp.mailingSameAsResidentialAddress = !this.mspAccountApp.mailingSameAsResidentialAddress;
    this.dataService.saveMspAccountApp();
  }
 
   ngAfterViewInit(): void {

   /*  if ( this.mspAccountApp.mailingAddress.addressLine1 != null) {
        this.dataService.accountApp.mailingAddress.hasValue = true;
     }
 
     if ( this.mspAccountApp.mailingAddress.province === undefined || this.mspAccountApp.mailingAddress.province === null ) {
        this.dataService.accountApp.mailingAddress.province = '';
     }
 
     this.form.valueChanges.subscribe(values => {
       this.dataService.saveMspAccountApp();
     });*/
   }
 
   handlePhoneNumberChange(evt: any) {
     this.mspAccountApp.phoneNumber = evt;
    // this.dataService.saveBenefitApplication();
   }

   handleAddressUpdate(evt: any){
     console.log(evt);
     console.log('address update event: %o', evt);
     evt.addressLine1 = evt.street;
     if (evt.addressLine1 != null) {
      // this.dataService.benefitApp.mailingAddress.hasValue = true;
     }
  //   this.dataService.saveBenefitApplication();
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
       //this._processService.setStep(BenefitAddressComponent.ProcessStepNum, true);
       //this._router.navigate(['/benefit/review']);
     }
   }

}
