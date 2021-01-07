import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'app/models/base.component';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MspDataService } from 'app/services/msp-data.service';
import { Address } from 'moh-common-lib';
import { ActivatedRoute } from '@angular/router';
import { AssistStateService } from '../../services/assist-state.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'msp-assist-contact',
  templateUrl: './assist-contact.component.html',
  styleUrls: ['./assist-contact.component.scss']
})
export class AssistContactComponent extends BaseComponent implements OnInit {
  @ViewChild('formRef') personalInfoForm: NgForm;

  addressLine2 = false;
  addressLine3 = false;
  readonly addressServiceUrl: string = environment.appConstants.addressApiBaseUrl;

  addressLines = 0;

  title = 'Contact Info';
  subtitle = 'Provide the Account Holder\'s contact information.';
  mailTitle = 'Mailing Address';
  mailSubtitle = 'Enter your <strong>current</strong> mailing address';
  phoneTitle = 'Phone';
  phoneLabel = 'Phone number (optional)';
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
    // this.addressLines = this.getAddressLines(this.address);

    // const enableLines = num => {
    //   while (num > 1) {
    //     this.address[`addressLine${num}`] = true;
    //     num -= 1;
    //   }
    // };

    // enableLines(this.addressLines);
    this.personalInfoForm.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged()
      )
      .subscribe(obs => {
        this.stateSvc.setPageValid( this.route.snapshot.routeConfig.path, this.personalInfoForm.valid );
        this.dataService.saveFinAssistApplication();
      });

    this.touched$.subscribe(obs => {
      if (obs) {
        const controls = this.personalInfoForm.controls;
        for (const control in controls) {
          controls[control].markAsTouched();
        }
      }
    });

    this.stateSvc.setPageIncomplete( this.route.snapshot.routeConfig.path );
  }

  // getAddressLines(address: Address) {
  //   if (address.addressLine3) return 3;
  //   if (typeof address.addressLine2 === 'string') {
  //     return 2;
  //   } else return 1;
  // }

  // addLine() {
  //   const i = this.getAddressLines(this.address);
  //   if (i === 3) return;
  //   const lineToAdd = `addressLine${i + 1}`;
  //   this.address[lineToAdd] = '';
  //   this[lineToAdd] = true;
  // }

  // removeLine(num: number) {
  //   const lineToRemove = `addressLine${num}`;
  //   this.address[lineToRemove] = undefined;
  //   this[lineToRemove] = false;
  // }

  savePhone(evt: any) {
    this.financialAssistApplication.phoneNumber = evt;
  }
}
