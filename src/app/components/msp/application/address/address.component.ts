import {Component, ViewChild} from '@angular/core'
import {NgForm} from "@angular/forms";
import DataService from '../../service/msp-data.service';
import {MspApplication} from "../../model/application.model";
import {Address} from "../../model/address.model";
import {BaseComponent} from "../../common/base.component";
import {MspAddressComponent} from "../../common/address/address.component";
import {MspPhoneComponent} from "../../common/phone/phone.component";

@Component({
  templateUrl: './address.component.html'
})
export class AddressComponent extends BaseComponent {
  lang = require('./i18n');

  @ViewChild('formRef') form: NgForm;
  @ViewChild('address') address: MspAddressComponent;
  @ViewChild('phone') phone: MspPhoneComponent;
  
  mspApplication: MspApplication;

  constructor(private dataService: DataService) {
    super();
    this.mspApplication = this.dataService.getMspApplication();
  }

  ngAfterViewInit():void {
    super.ngAfterViewInit();

    this.form.valueChanges.subscribe(values => {
      this.dataService.saveMspApplication();
    });
  }

  handlePhoneNumberChange(evt:any) {
    this.mspApplication.phoneNumber = evt;    
    this.dataService.saveMspApplication();
  }

  toggleMailingSameAsResidentialAddress(evt:boolean){
    this.mspApplication.mailingSameAsResidentialAddress = evt;
    if(evt){
      this.mspApplication.mailingAddress = new Address();
    }
    this.dataService.saveMspApplication();
  }

  handleAddressUpdate(evt:any){
    // console.log('address update event: %o', evt);
    this.dataService.saveMspApplication();
  }

  canContinue(){
    return this.isAllValid();
  }
}