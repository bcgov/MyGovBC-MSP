import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { Address, Base } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'msp-core-contact-info',
  templateUrl: './core-contact-info.component.html',
  styleUrls: ['./core-contact-info.component.scss'],
  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})

export class CoreContactInfoComponent extends Base {

  @Input() address: Address;
  @Output() addressChange = new EventEmitter<Address>();

  @Input() mailingSameAsResidentialAddress: boolean = true;
  @Output() mailingSameAsResidentialAddressChange = new EventEmitter<boolean>();

  @Input() mailingAddress: Address;
  @Output() mailingAdddressChange = new EventEmitter<Address>();

  @Input() phoneNumber: string;
  @Output() phoneNumberChange = new EventEmitter<string>();

  constructor() {
    super();
  }

  handleAddressChange(addr: any){
    this.address = addr;
    this.address.addressLine1 = addr.street;
    if (this.address.addressLine1 !== null){
      this.address.hasValue = true;
    }
    this.addressChange.emit(addr);
  }

  handleMailingAddressChange(addr: any){
    this.mailingAddress = addr;
    this.mailingAddress.addressLine1 = addr.street;
    if (this.mailingAddress.addressLine1 !== null){
      this.mailingAddress.hasValue = true;
    }
    this.mailingAdddressChange.emit(addr);
  }

  handlePhoneNumberChange(phone: any) {
    this.phoneNumber = phone;
    this.phoneNumberChange.emit(phone);
  }

  toggleCheckBox(){
    this.mailingSameAsResidentialAddress = !this.mailingSameAsResidentialAddress;
    this.mailingSameAsResidentialAddressChange.emit(this.mailingSameAsResidentialAddress);
  }
}
