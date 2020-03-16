
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspAccountApp } from '../../models/account.model';
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { PROVINCE_LIST, COUNTRY_LIST, AbstractForm } from 'moh-common-lib';

import {
  CountryList,
  ProvinceList,
  CANADA,
  BRITISH_COLUMBIA
} from 'moh-common-lib';

import { Subscription } from 'rxjs';


@Component({
  selector: 'msp-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent extends AbstractForm implements OnInit, AfterViewInit {

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
   subscriptions: Subscription[];

   constructor(private dataService: MspAccountMaintenanceDataService,
               protected router: Router) {
     super(router);
     this.mspAccountApp = this.dataService.accountApp;
   }

   ngOnInit(){
      //this.pageStateService.setPageIncomplete(this.router.url, this.dataService.accountApp.pageStatus);

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

   canContinue(): boolean {
    const valid = super.canContinue(); // && this.hasStatusDocuments;
/*
    if ( this.applicant.hasNameChange ) {
      valid = valid && this.hasNameDocuments;
    }

    if ( this.applicant.fullTimeStudent ) {
      valid = valid && this.applicant.inBCafterStudies;
    }*/
    return valid;
  }


  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    //this.pageStateService.setPageComplete(this.router.url, this.dataService.accountApp.pageStatus);
    this.navigate('/deam/review');
  }

}
