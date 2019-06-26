import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'app/models/base.component';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';
import { COUNTRY_LIST, PROVINCE_LIST } from 'moh-common-lib';
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
      </common-page-section>
      <common-page-section>
        <div class="row">
          <common-street
            class="col-11"
            [(ngModel)]="address.addressLine1"
            name="addressLine1"
          ></common-street>
          <div class="col-1">
            <div class="row h-50"></div>
            <div class="row">
              <button class=" btn btn-transparent" (click)="addLine()">
                <i class="fa fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="row" *ngIf="addressLine2">
          <common-street
            class="col-11"
            label="Address line 2"
            [(ngModel)]="address.addressLine2"
            name="addressLine2"
          ></common-street>
          <div class="col-1">
            <div class="row h-50"></div>
            <div class="row">
              <button (click)="removeLine(2)" class=" btn btn-transparent">
                <i class="fa fa-minus"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="row" *ngIf="addressLine3">
          <common-street
            class="col-11"
            label="Address line 3"
            [(ngModel)]="address.addressLine3"
            name="addressLine3"
          ></common-street>
          <div class="col-1">
            <div class="row h-50"></div>
            <div class="row">
              <button class=" btn btn-transparent" (click)="removeLine(3)">
                <i class="fa fa-minus"></i>
              </button>
            </div>
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
      </common-page-section>
      <h3 class="border-bottom">{{ phoneTitle }}</h3>
      <common-page-section>
        <common-phone-number
          name="phoneNumber"
          [label]="phoneLabel"
          [phoneNumber]="phone"
          [(ngModel)]="phone"
          (onChange)="savePhone($event)"
        ></common-phone-number>
      </common-page-section>
    </form>
  `,
  styleUrls: ['./assist-contact.component.scss']
})
export class AssistContactComponent extends BaseComponent implements OnInit {
  @ViewChild('formRef') personalInfoForm: NgForm;

  addressLine2 = false;
  addressLine3 = false;

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
    this.countryList = COUNTRY_LIST;
    this.provinceList = PROVINCE_LIST;
    this.financialAssistApplication = this.dataService.finAssistApp;
  }

  ngOnInit() {
    this.address = this.financialAssistApplication.mailingAddress;
    this.phone = this.financialAssistApplication.phoneNumber;
    this.addressLines = this.getAddressLines(this.address);

    const enableLines = num => {
      while (num > 1) {
        this.address[`addressLine${num}`] = true;
        num -= 1;
      }
    };

    enableLines(this.addressLines);
    console.log('address', this.address);
    this.personalInfoForm.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged()
      )
      .subscribe(obs => {
        console.log(obs);
        this.dataService.saveFinAssistApplication();
      });
  }

  getAddressLines(address: Address) {
    // console.log(typeof address.addressLine2);
    if (address.addressLine3) return 3;
    if (typeof address.addressLine2 === 'string') {
      return 2;
    } else return 1;
  }

  addLine() {
    const i = this.getAddressLines(this.address);
    if (i === 3) return;
    const lineToAdd = `addressLine${i + 1}`;
    this.address[lineToAdd] = '';
    console.log('added line', lineToAdd);
    console.log('address', this.address);
    this[lineToAdd] = true;
  }

  removeLine(num: number) {
    const lineToRemove = `addressLine${num}`;
    this.address[lineToRemove] = undefined;
    this[lineToRemove] = false;
  }

  savePhone(evt: any) {
    this.financialAssistApplication.phoneNumber = evt;
  }
}
