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
import { debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { AssistanceYear } from '../../models/assistance-year.model';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { ConsentModalComponent } from 'moh-common-lib';

// TODO: remove lodash
import { ActivatedRoute } from '@angular/router';
import { AssistStateService } from '../../services/assist-state.service';
import { AssistRatesModalComponent } from '../../components/assist-rates-modal/assist-rates-modal.component';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'msp-assist-home',
  template: `
    <common-page-section layout="tips">
      <h2>Apply for Retroactive Premium Assistance</h2>
      <p>
        Retroactive Premium Assistance provides assistance for previously
        charged Medical Services Plan premiums. Medical Services Plan premiums

        <a class="btn btn-link p-0" href="{{links.MSP_ASSISTANCE}}">
          Medical Services Plan premiums
        </a>
        are based on the previous tax year's
        <button class="btn btn-link p-0" (click)="openModal(modal)">
          adjusted net income
        </button>
      </p>
      <p>
        To be assessed for Retroactive Premium Assistance, complete this form
        and upload a copy of the Notice of Assessment or Notice of Reassessment
        from Canada Revenue Agency (CRA) for each requested tax year.
      </p>
      <aside>
        <div class="row">
          <div class="col-2">
            <i class="fa fa-exclamation-triangle" style="font-size: 40px;"></i>
          </div>
          <div class="col-10">
            <p>
              If you were covered on a group account during the period you are
              applying for, contact your group administrator.
            </p>
          </div>
        </div>
      </aside>
    </common-page-section>

    <common-page-section class="border-bottom" layout="noTips">
    </common-page-section>
    <common-page-section layout="tips">
      <form #formRef="ngForm" novalidate>
        <h3>
          Which years do you think your income might qualify you for Retroactive
          Premium Assistance?
        </h3>
        <!--
        <p>
          <span>
            Note:
          </span>
          <button class="btn btn-link p-0" (click)="openModal(modal)">
            Income eligibility
          </button>
          <span>
            for Retroactive Permium Assistance.
          </span>
        </p>
        -->
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
      <ng-container *ngIf="touched$ | async as touched">
        <p class="text-danger" *ngIf="touched && validSelection">
          A tax year is required
        </p>
      </ng-container>
      <aside>
        <p>
          <b>
            Where’s tax year 2019?
          </b>
        </p>
        <p>
          MSP premiums were eliminated on January 1, 2020. Because the 2019 tax year would 
          apply towards a year in which no premiums were charged, it is not available for selection.
        </p>
      </aside>
    </common-page-section>
    <ng-template #modal>
      <msp-assist-rates-modal
        (closeModal)="closeModal()"
      ></msp-assist-rates-modal>
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
        Personal information is collected under the authority of the Medicare Protection Act 
        and section 26 (a), (c) and (e) of the Freedom of Information and Protection of 
        Privacy Act for the purposes of administration of the Medical Services Plan. If you 
        have any questions about the collection and use of your personal information, please 
        <a href="{{links.MSP_RESIDENT_CONTACT}}" target="_blank"
          >contact Health Insurance BC
          <i class="fa fa-external-link" aria-hidden="true"></i></a
        >.
      </p>
    </common-consent-modal>
  `
})
export class AssistanceHomeComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild('mspConsentModal') mspConsentModal: ConsentModalComponent;
  @ViewChild('modal') ratesModal: AssistRatesModalComponent;
  @ViewChild('formRef') prepForm: NgForm;

  touched$ = this.stateSvc.touched.asObservable();

  links = environment.links;

  title = 'Apply for Retroactive Premium Assistance';
  consentProcessName = 'apply for Premium Assistance';

  options: AssistanceYear[];
  rateData: {};
  modalRef: BsModalRef;
  pastYears = [];

  get finAssistApp(): FinancialAssistApplication {
    return this.dataSvc.finAssistApp;
  }

  get assistanceYearsList(): AssistanceYear[] {
    return this.finAssistApp.assistYears;
  }

  get validSelection() {
    const app = this.finAssistApp.assistYears;
    return app.every(itm => itm.apply === false);
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
    // const data = {};
    // for (let assistYear of this.options) {
    // const helperData = new PremiumRatesYear();
    // let index = 0;
    // for (let year in helperData.options) {
    // let index = helperData.options[year];
    // data[year] = { ...helperData.brackets[index] };
    // index++;
    // }
    // }
    // this.rateData = data;
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
        if (this.prepForm.dirty) this.stateSvc.touched.next(true);
        this.dataSvc.saveFinAssistApplication();
      });
  }

  applyOption(bool: boolean, i: number) {
    this.options[i].apply = bool;
    if (!bool) {
      this.options[i].hasSpouse = false;
      this.options[i].spouseFiles = undefined;
    }
    this.dataSvc.saveFinAssistApplication();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalSvc.show(this.ratesModal, {
      class: 'modal-md'
    });

    // this.ratesModal.close();
  }
  initYearsList() {
    const recentTaxYear = new Date().getFullYear(); // this.finAssistApp.MostRecentTaxYear; //< 2020 ? 2020 : this.finAssistApp.MostRecentTaxYear;
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

  closeModal() {
    console.log('clicked');
    this.modalRef.hide();
  }

  acceptConsent(evt: boolean) {
    this.initYearsList();
    this.options = this.dataSvc.finAssistApp.assistYears;
    this.dataSvc.finAssistApp.infoCollectionAgreement = evt;
    this.dataSvc.saveFinAssistApplication();
  }
}
