import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'app/models/base.component';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';
import { countryData } from 'app/modules/msp-core/constants/countries';
import provinceData from 'app/modules/msp-core/constants/provinces';
import { Address, ProvinceList } from 'moh-common-lib';

@Component({
  selector: 'msp-assist-contact',
  template: `
    <form #formRef="ngForm" novalidate>
      <common-page-section layout="noTips">
        <h2>{{ title }}</h2>
        <p>{{ subtitle }}</p>
        <h3>{{ mailTitle }}</h3>
        <p class="border-bottom">{{ mailSubtitle }}</p>
        <div class="row">
          <common-street
            class="col-11"
            [(ngModel)]="address.addressLine1"
            name="addressLine1"
          ></common-street>
          <div class="col-1">
            <button class=" bt btn-default">
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <div class="row">
          <common-street
            class="col-11"
            label="Address line 2"
            [(ngModel)]="address.addressLine2"
            name="addressLine2"
          ></common-street>
          <div class="col-1">
            <button class=" bt btn-default">
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <div class="row">
          <common-street
            class="col-11"
            label="Address line 3"
            [(ngModel)]="address.addressLine3"
            name="addressLine3"
          ></common-street>
          <div class="col-1">
            <button class=" bt btn-default">
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <common-city [(ngModel)]="address.city" name="city"></common-city>
        <common-country
          name="country"
          [countryList]="countryList"
          [(ngModel)]="address.country"
        ></common-country>
        <common-province
          name="province"
          [(ngModel)]="address.province"
        ></common-province>
        <common-postal-code
          [(ngModel)]="address.postal"
          name="postal"
        ></common-postal-code>
        <h3 class="border-bottom">{{ phoneTitle }}</h3>
        <common-phone-number
          name="phone"
          [label]="phoneLabel"
          [(ngModel)]="phone"
        ></common-phone-number>
      </common-page-section>
    </form>
  `,
  styleUrls: ['./assist-contact.component.scss']
})
export class AssistContactComponent extends BaseComponent implements OnInit {
  @ViewChild('formRef') personalInfoForm: NgForm;
  addressLines = 0;

  title = 'Contact Info';
  subtitle = "Please provide the Account Holder's information";
  mailTitle = 'Mailing Address';
  mailSubtitle = 'Enter your current mailing address';
  phoneTitle = 'Contact';
  phoneLabel = 'Phone Number (optional)';

  countryList: { countryCode: string; description: string }[];
  provinceList: { provinceCode: string; description: string }[];

  // form variables
  address: Address;
  phone: string;

  financialAssistApplication: FinancialAssistApplication;
  // streetLabel = 'Full street address, rural route, PO Box or general delivery'
  // cityLabel = 'City'
  // provinceLabel = 'Province or state'
  // countryLabel

  constructor(cd: ChangeDetectorRef, private dataService: MspDataService) {
    super(cd);
    this.countryList = countryData;
    this.provinceList = provinceData;
    this.financialAssistApplication = this.dataService.finAssistApp;
  }

  ngOnInit() {
    this.address = this.financialAssistApplication.mailingAddress;
    this.phone = this.financialAssistApplication.applicant.phoneNumber;
    this.addressLines = this.getAddressLines(this.address);
    console.log(this.address);
    this.personalInfoForm.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged()
      )
      .subscribe(val => {
        console.log('run', val);
        this.dataService.finAssistApp.mailingAddress = val;
        this.dataService.saveFinAssistApplication();
      });
  }

  getAddressLines(address: Address) {
    if (address.addressLine3) return 3;
    if (address.addressLine2) return 2;
    else return 1;
  }

  addLine() {}
}
