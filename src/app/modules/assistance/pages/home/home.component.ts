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
  templateUrl: './home.component.html'
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
    this.stateSvc.setPageIncomplete( this.route.snapshot.routeConfig.path );
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
        console.log( 'change in home page', !this.validSelection );
        // No form validation only need at least one checkbox marked
        this.stateSvc.setPageValid( this.route.snapshot.routeConfig.path, !this.validSelection );
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
      class: 'modal-xl'
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
