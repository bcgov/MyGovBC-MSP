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
import { ROUTES_ASSIST } from '../../models/assist-route-constants';

@Component({
  selector: 'msp-assist-home',
  template: `
    <common-page-section layout="tips">
      <h1>Apply for Retroactive Premium Assistance</h1>
      <p>
        Retroactive Premium Assistance provides assistance for previously
        charged Medical Services Plan premiums. Medical Services Plan premiums

        <a class="btn btn-link p-0" href="http://gov.bc.ca/MSP/retropremiumassistance" target="_blank">
          Medical Services Plan premiums <i class="fa fa-external-link" aria-hidden="true"></i>
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
    <common-page-section layout="tips">
      <form #formRef="ngForm" novalidate>
        <h2>
          Which years do you think your income might qualify you for Retroactive
          Premium Assistance?
        </h2>
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
      <common-error-container [displayError]="(touched$ | async) && validSelection">
        A tax year is required
      </common-error-container>
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
    <msp-consent-modal
      #mspConsentModal
      [isMaintenanceMode]="false"
      [consentProcessName]="consentProcessName"
      (accept)="
        finAssistApp.infoCollectionAgreement = $event;
        this.dataSvc.saveFinAssistApplication()
      "
    >
    </msp-consent-modal>
  `
})
export class AssistanceHomeComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild('mspConsentModal') mspConsentModal: ConsentModalComponent;
  @ViewChild('modal') ratesModal: AssistRatesModalComponent;
  @ViewChild('formRef') prepForm: NgForm;

  touched$ = this.stateSvc.touched.asObservable();

  links = environment.links;
  consentProcessName = 'Apply for Premium Assistance';

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
    if (this.options.length < 1) {
      this.initYearsList();
    }
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
        console.log( 'change in home page' );
        // No form validation only need at least one checkbox marked
        this.stateSvc.setPageStatus( this.route.snapshot.routeConfig.path, !this.validSelection );

        if ( this.prepForm.dirty ) {
          this.stateSvc.touched.next( true );
        }

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
