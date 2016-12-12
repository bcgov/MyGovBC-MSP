import {Component, Inject, Input, NgModule, Output, EventEmitter} from '@angular/core';
import {Address} from "../../model/address.model";

require('./address.component.less');

@Component({
  selector: 'msp-address',
  templateUrl: './address.component.html'
})

export class MspAddressComponent {
  lang = require('./i18n');
  private _useResidentialAddressLine2: boolean = false;
  private _useResidentialAddressLine3: boolean = false;
  private _useMailingAddressLine2: boolean = false;
  private _useMailingAddressLine3: boolean = false;

  /**
   * Model Inputs
   */
  @Input() residentialAddress: Address;
  @Input() mailingSameAsResidentialAddress: boolean;
  @Output() mailingSameAsResidentialAddressChange = new EventEmitter<boolean>();
  @Input() mailingAddress: Address;
  @Input('mailingOnly') mailingOnly: boolean;
  @Input() mailingAddressHeading:string = this.lang('./en/index.js').mailingAddressHeading


  /**
   * When user click 'Need another address line?'
   */
  useAnotherResidentialAddressLine() {
    if (!this.useResidentialAddressLine2) {
      this.useResidentialAddressLine2 = true;
    }
    else if (!this._useResidentialAddressLine3) {
      this.useResidentialAddressLine3 = true;
    }
  }

  get useResidentialAddressLine2() {
    if (this._useResidentialAddressLine2 ||
       this.residentialAddress.addressLine2) {
      return true;
    }
    return false;
  }

  set useResidentialAddressLine2(value: boolean) {
    this._useResidentialAddressLine2 = value;
    if (!this._useResidentialAddressLine2) {
      this.residentialAddress.addressLine2 = "";
    }
  }

  get useResidentialAddressLine3() {
    if (this._useResidentialAddressLine3 ||
      this.residentialAddress.addressLine3) {
      return true;
    }
    return false;
  }

  set useResidentialAddressLine3(value: boolean) {
    this._useResidentialAddressLine3 = value;
    if (!this._useResidentialAddressLine3) {
      this.residentialAddress.addressLine3 = "";
    }
  }

  /**
   * When user click 'Need another address line?'
   */
  useAnotherMailingAddressLine() {
    if (!this.useMailingAddressLine2) {
      this.useMailingAddressLine2 = true;
    }
    else if (!this.useMailingAddressLine3) {
      this.useMailingAddressLine3 = true;
    }
  }

  get useMailingAddressLine2() {
    if (this._useMailingAddressLine2 ||
      this.mailingAddress.addressLine2) {
      return true;
    }
    return false;
  }

  set useMailingAddressLine2(value: boolean) {
    this._useMailingAddressLine2 = value;
    if (!this._useMailingAddressLine2) {
      this.mailingAddress.addressLine2 = "";
    }
  }

  get useMailingAddressLine3() {
    if (this._useMailingAddressLine3 ||
      this.mailingAddress.addressLine3) {
      return true;
    }
    return false;
  }

  set useMailingAddressLine3(value: boolean) {
    this._useMailingAddressLine3 = value;
    if (!this._useMailingAddressLine3) {
      this.mailingAddress.addressLine3 = "";
    }
  }

  useDifferentMailingAddress() {
    this.mailingSameAsResidentialAddress = false;
    this.mailingSameAsResidentialAddressChange.emit(this.mailingSameAsResidentialAddress);
  }

  useSameMailingAddress() {
    this.mailingSameAsResidentialAddress = true;
    this.mailingAddress = new Address();
    this.mailingSameAsResidentialAddressChange.emit(this.mailingSameAsResidentialAddress);
  }
}
