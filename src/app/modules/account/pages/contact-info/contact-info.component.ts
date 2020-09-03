import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspAccountApp } from '../../models/account.model';
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { PROVINCE_LIST, COUNTRY_LIST, PageStateService, ContainerService } from 'moh-common-lib';
import {ProcessService} from '../../../../services/process.service';

import {
  CountryList,
  ProvinceList,
  CANADA,
  BRITISH_COLUMBIA
} from 'moh-common-lib';

import { Subscription } from 'rxjs';
import { BaseForm } from '../../models/base-form';

@Component({
  selector: 'msp-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})

export class ContactInfoComponent extends BaseForm implements OnInit, AfterViewInit {
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
               protected router: Router,
               protected containerService: ContainerService,
               protected pageStateService: PageStateService,
               public _processService: ProcessService) {
     super(router, containerService, pageStateService, _processService);
     this.mspAccountApp = this.dataService.accountApp;
   }

   ngOnInit(){
    this.initProcessMembers(ContactInfoComponent.ProcessStepNum, this._processService);
    this._processService.setStep(ContactInfoComponent.ProcessStepNum, false);
  }

   toggleCheckBox(){
    this.mspAccountApp.mailingSameAsResidentialAddress = !this.mspAccountApp.mailingSameAsResidentialAddress;
    this.dataService.saveMspAccountApp();
  }

   ngAfterViewInit(): void {}

   handlePhoneNumberChange(evt: any) {
     this.mspAccountApp.phoneNumber = evt;
   }

   handleAddressUpdate(evt: any){
     evt.addressLine1 = evt.street;
   }

   canContinue(): boolean {
    return super.canContinue(); // && this.hasStatusDocuments;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this._processService.setStep(ContactInfoComponent.ProcessStepNum, false);
      this.markAllInputsTouched();
      return;
    }
    this._processService.setStep(ContactInfoComponent.ProcessStepNum, true);
    this.navigate('/deam/review');
  }
}
