import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
  AfterViewInit
} from '@angular/core';
import { BaseComponent } from 'app/models/base.component';
import { MspDataService } from 'app/services/msp-data.service';
import { NgForm } from '@angular/forms';
import { PremiumRatesYear } from './home-constants';
import {
  debounceTime,
  tap,
  distinctUntilChanged,
  filter,
  map
} from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { AssistanceYear } from '../../models/assistance-year.model';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { fromEvent, merge } from 'rxjs';
import { ConsentModalComponent } from 'moh-common-lib';

// TODO: remove lodash
import * as moment from 'moment';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { AssistStateService } from '../../services/assist-state.service';

@Component({
  selector: 'msp-assist-home',
  template: `
    <common-page-section layout="noTips">
      <h2>Apply for Retroactive Premium Assistance</h2>
      <p>
        Retroactive Premium Assistance is available for up to six years prior to
        the current tax year for those on self-administered accounts. If you
        were covered on a group account during the period you are applying for,
        contact your group administrator.
      </p>

      <p>
        To be assessed for retroactive Premium Assistance, you must submit this
        form to Health Insurance BC (HIBC) with a copy of the Notice of
        Assessment (NOA) or Notice of Reassessment (NORA) from Canada Revenue
        Agency (CRA) for the applicable tax year.
      </p>

      <p>
        <!-- TODO: click to show modal -->
        <button class="btn btn-link p-0" (click)="openModal(modal)">
          MSP premium rates
        </button>
        are based on the previous tax year’s adjusted net income. (For example,
        2019 premiums are based on 2018 income.)
      </p>

      <p class="border-bottom mb-2">
        You will be required during this application to upload a copy of your
        Canada Revenue Agency Notice of Assessment or Notice of Reassessment
        (and your spouse’s, if applicable)
      </p>
      <form #formRef="ngForm" novalidate>
        <h3>
          What premium years would you like to apply for retroactive assistance?
        </h3>
        <div class="row">
          <div class="col-12">
            <common-checkbox
              class="col-2"
              *ngFor="let option of options; index as i"
              [(ngModel)]="option.apply"
              [checked]="option.apply"
              [label]="option.year"
              (dataChange)="applyOption($event, i)"
              id="{{ option.year }}"
              name="{{ option.year }}"
            ></common-checkbox>
          </div>
        </div>
      </form>
    </common-page-section>
    <ng-template #modal>
      <msp-assist-rates-helper-modal
        [rateData]="rateData"
      ></msp-assist-rates-helper-modal>
    </ng-template>

    <common-consent-modal
      #mspConsentModal
      [isUnderMaintenance]="false"
      [title]="'Information collection notice'"
      agreeLabel="I have read and understand this information"
      [processName]="consentProcessName"
      (accept)="
        finAssistApp.infoCollectionAgreement = $event;
        this.dataSvc.saveFinAssistApplication()
      "
    >
      <p>
        <strong
          >Keep your personal information secure – especially when using a
          shared device like a computer at a library, school or café.</strong
        >
        To delete any information that was entered, either complete the
        application and submit it or, if you don’t finish, close the web
        browser.
      </p>
      <p>
        <strong>Need to take a break and come back later?</strong> The data you
        enter on this form is saved locally to the computer or device you are
        using until you close the web browser or submit your application.
      </p>
      <p>
        <strong
          >Information in this application is collected by the Ministry of
          Health</strong
        >
        under section 26(a), (c) and (e) of the Freedom of Information and
        Protection of Privacy Act and will be used to determine eligibility for
        provincial health care benefits in BC and administer Premium Assistance.
        Should you have any questions about the collection of this personal
        information please
        <a
          href="http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us"
          target="_blank"
          >contact Health Insurance BC
          <i class="fa fa-external-link" aria-hidden="true"></i></a
        >.
      </p>
    </common-consent-modal>
  `,
  styleUrls: ['./home.component.scss']
})
export class AssistanceHomeComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  // @ViewChild('formRef') form: NgForm;
  // finAssistApp: FinancialAssistApplication;
  title = 'Apply for Retroactive Premium Assistance';
  options: AssistanceYear[];
  rateData: {};
  modalRef: BsModalRef;
  pastYears = [];
  consentProcessName = 'apply for Premium Assistance';
  @ViewChild('mspConsentModal') mspConsentModal: ConsentModalComponent;
  @ViewChild('formRef') prepForm: NgForm;

  get finAssistApp(): FinancialAssistApplication {
    return this.dataSvc.finAssistApp;
  }

  get assistanceYearsList(): AssistanceYear[] {
    return this.finAssistApp.assistYears;
  }

  constructor(
    cd: ChangeDetectorRef,
    public dataSvc: MspDataService,
    private modalSvc: BsModalService,
    private route: ActivatedRoute,
    private stateSvc: AssistStateService
  ) {
    super(cd);
  }

  ngOnInit() {
    this.options = this.dataSvc.finAssistApp.assistYears;
    const data = {};
    // for (let assistYear of this.options) {
    const helperData = new PremiumRatesYear();
    let index = 0;
    for (let year in helperData.options) {
      // let index = helperData.options[year];
      data[year] = { ...helperData.brackets[index] };
      index++;
    }
    // }
    this.rateData = data;
    if (this.options.length < 1) this.initYearsList();
    this.stateSvc.setIndex(this.route.snapshot.routeConfig.path);
  }

  ngAfterViewInit() {
    if (!this.dataSvc.finAssistApp.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
    }

    this.prepForm.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.dataSvc.saveFinAssistApplication();
      });
  }

  applyOption(bool: boolean, i: number) {
    this.options[i].apply = bool;
    this.dataSvc.saveFinAssistApplication();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalSvc.show(template, {
      backdrop: true,
      class: 'modal-md',
      keyboard: false
    });
  }
  initYearsList() {
    const recentTaxYear = moment().year(); // this.finAssistApp.MostRecentTaxYear; //< 2020 ? 2020 : this.finAssistApp.MostRecentTaxYear;
    const cutOffYear = 2020;
    const numberOfYears = 6 - (recentTaxYear - cutOffYear);
    let i = recentTaxYear < cutOffYear ? 2 : 1;

    while (i <= numberOfYears) {
      this.pastYears.push(cutOffYear - i);
      i++;
    }

    if (
      !this.finAssistApp.assistYears ||
      this.finAssistApp.assistYears.length < 7
    ) {
      this.finAssistApp.assistYears = this.pastYears.reduce(
        (tally, yearNum) => {
          const assistYear: AssistanceYear = new AssistanceYear();
          assistYear.apply = false;
          assistYear.year = yearNum;
          assistYear.docsRequired = true;
          assistYear.currentYear = this.finAssistApp.MostRecentTaxYear;

          if (yearNum === this.finAssistApp.MostRecentTaxYear) {
            assistYear.docsRequired = false;
          }
          tally.push(assistYear);

          return tally;
        },
        []
      );
    }
    this.dataSvc.saveFinAssistApplication();
    this.options = this.dataSvc.finAssistApp.assistYears;
  }

  acceptConsent(evt: boolean) {
    this.initYearsList();
    this.options = this.dataSvc.finAssistApp.assistYears;
    this.dataSvc.finAssistApp.infoCollectionAgreement = evt;
    this.dataSvc.saveFinAssistApplication();
  }
}
