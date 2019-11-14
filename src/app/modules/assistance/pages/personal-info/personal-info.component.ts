import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BaseComponent } from '../../../../models/base.component';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { AssistanceYear } from '../../models/assistance-year.model';
import { AssistStateService } from '../../services/assist-state.service';

@Component({
  // templateUrl: './personal-info.component.html'
  template: `
    <h1>{{ title }}</h1>
    <h2>{{ subtitle }}</h2>
    <p class="border-bottom">{{ description }}</p>
    <form #formRef="ngForm" novalidate>
      <common-page-section layout="noTips">
        <msp-personal-information
          [person]="financialAssistApplication.applicant"
          (personChange)="saveAccountHolder()"
        ></msp-personal-information>
      </common-page-section>
      <h3>{{ documentsTitle }}</h3>
      <p class="border-bottom">{{ documentsDescription }}</p>
      <msp-assist-cra-documents
        [assistanceYears]="assistanceYears"
      ></msp-assist-cra-documents>
    </form>
  `
})
export class AssistancePersonalInfoComponent extends BaseComponent {

  @ViewChild('formRef') personalInfoForm: NgForm;
  financialAssistApplication: FinancialAssistApplication;

  title = 'Add personal information and upload documents';
  subtitle = 'Medical Services Plan Account Holder';
  description =
    'Enter your legal name as it appears on your BC Services Card or CareCard.';
  documentsTitle = 'Documents';
  documentsDescription =
    'Upload your Canada Revenue Agency Notice of Assessment or Reassessment for ';

  assistanceYears: any[];
  constructor(
    private dataService: MspDataService,
    private route: ActivatedRoute,
    private stateSvc: AssistStateService,
    cd: ChangeDetectorRef
  ) {
    super(cd);
    this.financialAssistApplication = this.dataService.finAssistApp;
  }

  ngAfterViewInit() {
    this.subscriptionList.push(
      this.personalInfoForm.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged()
        )
        .subscribe(() => {
          console.log( 'form values changed: form is ', this.personalInfoForm.valid );
          this.stateSvc.setPageValid( this.route.snapshot.routeConfig.path, this.personalInfoForm.valid );
          this.dataService.saveFinAssistApplication();
        })
    );
  }

  ngOnInit() {
    this.stateSvc.setPageIncomplete( this.route.snapshot.routeConfig.path );

    // Set Container data specific to page
    const assistYears = this.financialAssistApplication.assistYears;
    const arr = [];
    const checkYear = (year: AssistanceYear) => {
      return year.apply ? year : null;
    };
    for (const year of assistYears) {
      arr.push(checkYear(year));
    }
    this.assistanceYears = arr
      .filter(itm => itm != null)
      .map(itm => {
        const obj = itm;
        if (!obj.files) obj.files = [];
        return obj;
      });

    this.documentsDescription += this.createDocumentDesc(this.assistanceYears);

    setTimeout(
      () =>
      this.subscriptionList.push(
          this.stateSvc.touched.asObservable().subscribe(obs => {
            if (obs) {
              const controls = this.personalInfoForm.form.controls;
              console.log( 'controls: ', controls );
              for (const control in controls) {
                controls[control].markAsTouched();
              }
            }
          })
        ),
      500
    );
  }

  ngOnDestroy() {
    this.subscriptionList.forEach(itm => itm.unsubscribe());
  }

  createDocumentDesc(years: any[]) {
    if (years  && years.length ) {
      return years
        .map(itm => itm.year)
        .sort((a, b) => a - b)
        .reduce((a, b, i, arr) =>
          i === arr.length - 1 ? `${a} and ${b}.` : `${a}, ${b}`
        );
    }
  }

  // Final check to see if the country is present // DEF 153

  saveAccountHolder() {
    this.dataService.saveFinAssistApplication();
  }
}
