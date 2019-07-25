import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'app/models/base.component';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';
import { Address } from 'moh-common-lib';
import { ActivatedRoute } from '@angular/router';
import { AssistStateService } from '../../services/assist-state.service';

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
      <common-page-section layout="double">
        <common-address
          [address]="address"
          (addressChange)="updateAddress($event)"
          isRequired="true"
          allowExtralines="true"
          disableGeocoder="true"
        ></common-address>
        <!--
        <div class="row">
          <common-street
            class="col-11"
            [(ngModel)]="address.addressLine1"
            name="addressLine1"
            id="addressLine1"
            maxlen="25"
            required
          ></common-street>
          <div class="col-1">
            <div class="row h-50"></div>
            <div class="row">
              <button class=" btn btn-transparent" (click)="addLine()">
                <i class="fa fa-plus"></i>
                <span class="hidden">Add another address line</span>
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
            id="addressLine2"
            maxlen="25"
            required
          ></common-street>
          <div class="col-1">
            <div class="row h-50"></div>
            <div class="row">
              <button (click)="removeLine(2)" class=" btn btn-transparent">
                <i class="fa fa-minus"></i>
                <span class="hidden">Remove address line 2</span>
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
            id="addressLine3"
            maxlen="25"
            required
          ></common-street>
          <div class="col-1">
            <div class="row h-50"></div>
            <div class="row">
              <button class=" btn btn-transparent" (click)="removeLine(3)">
                <i class="fa fa-minus"></i>
                <span class="hidden">Remove address line 3</span>
              </button>
            </div>
          </div>
        </div>
        <common-city
          [(ngModel)]="address.city"
          name="city"
          id="city"
          required
        ></common-city>
        <common-country
          name="country"
          [countryList]="countryList"
          [(ngModel)]="address.country"
          id="country"
          required
        ></common-country>
        <common-province
          name="province"
          [(ngModel)]="address.province"
          id="province"
          required
        ></common-province>
        <common-postal-code
          [(ngModel)]="address.postal"
          name="postal"
          id="postal"
          required
        ></common-postal-code>
-->
      </common-page-section>
      <h3 class="border-bottom">{{ phoneTitle }}</h3>
      <common-page-section layout="tips">
        <common-phone-number
          name="phoneNumber"
          [label]="phoneLabel"
          [phoneNumber]="phone"
          [(ngModel)]="phone"
          (onChange)="savePhone($event)"
          maxlen="25"
          required="false"
        ></common-phone-number>
        <aside>
          <h5>Tip</h5>
          <p>{{ phoneTip }}</p>
        </aside>
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
  phoneTip =
    'Please provide a phone number so you may be contacted in case of any issues with your application.';


  // form variables
  address: Address;
  phone: string;

  financialAssistApplication: FinancialAssistApplication;

  touched$ = this.stateSvc.touched.asObservable();

  constructor(
    cd: ChangeDetectorRef,
    private dataService: MspDataService,
    private stateSvc: AssistStateService,
    private route: ActivatedRoute
  ) {
    super(cd);
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
    this.personalInfoForm.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged()
      )
      .subscribe(obs => {
        console.log('values changed');
        this.dataService.saveFinAssistApplication();
      });

    this.touched$.subscribe(obs => {
      if (obs) {
        const controls = this.personalInfoForm.controls;
        for (let control in controls) {
          controls[control].markAsTouched();
        }
      }
    });

    this.stateSvc.setIndex(this.route.snapshot.routeConfig.path);
  }

  getAddressLines(address: Address) {
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
  updateAddress(evt: Address) {
    console.log('update event', evt);
    this.address.addressLine1 = evt.street;
  }
}
