import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'app/models/base.component';
import { Address } from 'moh-common-lib';

@Component({
  selector: 'msp-core-contact-info',
  templateUrl: './core-contact-info.component.html',
  styleUrls: ['./core-contact-info.component.scss']
})

export class CoreContactInfoComponent extends BaseComponent {

  @Input() address: Address;
  @Output() addressChange = new EventEmitter<Address>();

  @Input() mailingSameAsResidentialAddress: boolean;
  @Output() mailingSameAsResidentialAddressChange = new EventEmitter<boolean>();

  @Input() mailingAddress: Address;
  @Output() mailingAdddressChange = new EventEmitter<Address>();

  @Input() phoneNumber: string;
  @Output() phoneNumberChange = new EventEmitter<string>();

  // remove - replace references to address in here to simply the address input (this.address or address)
  // mspApplication: MspApplication;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
    // REmove mspAapplication entirely. Do NOT USE MSPDATASERVICE
  }

  ngOnInit() {
  }

  handleAddressChange(addr: any){
    this.address = addr;
    this.addressChange.emit(addr);
  }

  handleMailingAddressChange(addr: any){
    this.mailingAddress = addr;
    this.mailingAdddressChange.emit(addr);
  }

  handlePhoneNumberChange(phone: any) {
    this.phoneNumber = phone;
    this.phoneNumberChange.emit(phone);
  }

  toggleMailingSameAsResidentialAddress(evt: boolean){
    // remove application and replace with emits.
    this.mailingSameAsResidentialAddress = !evt;
    if (evt){
      this.mailingAddress = new Address();
    }
  }

  toggleCheckBox(){
    this.mailingSameAsResidentialAddress = !this.mailingSameAsResidentialAddress;
  }

}
