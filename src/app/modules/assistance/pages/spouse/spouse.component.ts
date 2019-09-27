import { Component, OnInit, ChangeDetectorRef, ViewChild, SimpleChanges } from '@angular/core';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { MspDataService } from 'app/services/msp-data.service';
import { AssistanceYear } from '../../models/assistance-year.model';
import { BaseComponent } from 'app/models/base.component';
import { PersonDocuments } from 'app/components/msp/model/person-document.model';
import { AssistStateService } from '../../services/assist-state.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface SpouseYears {
  apply: boolean;
  year: number;
}

@Component({
  selector: 'msp-spouse',
  template: `
    <form #formRef="ngForm" novalidate>
      <h1>{{ title }}</h1>
      <p class="border-bottom">{{ description }}</p>

      <button
        [disabled]="showTaxYears"
        class="btn btn-primary btn-md"
        (click)="addSpouse()"
      >
        Add Spouse Information
      </button>

      <common-page-section layout='noTips' *ngIf="showTaxYears">
        <h2>{{ yearTitle }}</h2>
        <p class="border-bottom">
          {{ yearDescription }}
          <common-xicon-button *ngIf="showTaxYears" label= "Remove spouse" (click)="removeSpouse()">
          </common-xicon-button>
        </p>


        <ng-container *ngIf="showTaxYears">
          <h3>When did you have a spouse?</h3>
          <div class="row">
            <div class="col-12">
              <common-checkbox
                *ngFor="let year of assistanceYears"
                class="col-1"
                [label]="year"
                [data]="checkYear(year)"
                (dataChange)="toggleYear($event, year)"
                id="{{year}}"
              ></common-checkbox>
            <common-error-container [displayError]="(touched$ | async) && !validSelection">
              At least one tax year must be selected
            </common-error-container>
            </div>
          </div>

          <ng-container *ngIf="selectedYears.length > 0">
            <h2>{{ documentsTitle }}</h2>
            <p class="border-bottom">{{ documentsDescription }}</p>
            <ng-container>
              <msp-assist-cra-documents
                [assistanceYears]="selectedYears"
                isSpouse="true"
              ></msp-assist-cra-documents>
            </ng-container>
          </ng-container>
        </ng-container>
      </common-page-section>
    </form>
  `,
  styleUrls: ['./spouse.component.scss']
})
export class SpouseComponent extends BaseComponent implements OnInit {

  @ViewChild('formRef') spouseInfoForm: NgForm;

  touched$ = this.stateSvc.touched.asObservable();
  title = 'Add spouse information and upload documents';
  description =
    'Did you have a spouse or common-law partner during any of the years you are requesting Retroactive Premium Assistance? ' +
    'If so, you are required to upload your spouse\'s Notice of Assessment or Reassessment.';
  yearTitle = 'Your spouse or common-law partner';
  yearDescription = 'Select the tax year when you had a spouse';
  documentsTitle = 'Documents';
  documentsDescription = `Upload your spouse's Canada Revenue Agency Notice of Assessment or Reassessment for`;

  finAssistApp: FinancialAssistApplication;
  documents: PersonDocuments;

  assistanceYears = [];
  assistanceYearsDocs = [];
  selectedYears: SpouseYears[] = [];

  showTaxYears = false;

  urlIndex: number;

  get validSelection() {
    const app = this.finAssistApp.assistYears;
    console.log('this.finAssistApp.assistYears: ', this.finAssistApp.assistYears );
    return app.some(itm => itm.hasSpouse);
  }

  constructor(
    private dataSvc: MspDataService,
    cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private stateSvc: AssistStateService
  ) {
    super(cd);
    this.finAssistApp = this.dataSvc.finAssistApp;
  }


  ngOnInit() {
    const assistYears = this.finAssistApp.assistYears;
    const arr = [];
    const checkYear = (year: AssistanceYear) => {
      return year.apply ? year : null;
    };
    for (const year of assistYears) {
      arr.push(checkYear(year));
    }
    this.assistanceYears = arr.filter(itm => itm != null).map(itm => itm.year);

    this.assistanceYearsDocs = arr;
    this.showTaxYears = this.finAssistApp.hasSpouseOrCommonLaw;
    if (this.finAssistApp.hasSpouseOrCommonLaw) {
      this.documents = this.finAssistApp.spouse.documents;
    }

    const years = this.finAssistApp.assistYears;
    const hasSpouse = years.some(itm => itm.hasSpouse);
    if (hasSpouse) {
      this.parseSpouse(years);
    }

    if (this.finAssistApp.assistYears.some(itm => itm.hasSpouse))
      this.documentsDescription = `Upload your spouse's Canada Revenue Agency Notice of Assessment or Reassessment for ${this.createDocumentDesc(
        this.selectedYears
      )}`;

    this.urlIndex = this.stateSvc.findIndex( this.route.snapshot.routeConfig.path );
    this.stateSvc.setPageIncomplete( this.route.snapshot.routeConfig.path );
    this.setPageStatus();
  }

  ngAfterViewInit() {
    this.subscriptionList.push(
      this.spouseInfoForm.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged()
        )
        .subscribe(() => {
          this.setPageStatus();
          this.dataSvc.saveFinAssistApplication();
        })
    );

    setTimeout(
      () =>
      this.subscriptionList.push(
          this.stateSvc.touched.asObservable().subscribe(obs => {
            if (obs) {
              const controls = this.spouseInfoForm.form.controls;
              for (const control in controls) {
                controls[control].markAsTouched();
              }
            }
          })
        ),
      500
    );
  }

  setPageStatus() {
    let valid = true;
    if ( this.finAssistApp.hasSpouseOrCommonLaw  ) {
      valid = this.spouseInfoForm.valid && this.validSelection;
    }
    this.stateSvc.setPageValid( this.route.snapshot.routeConfig.path, valid );
  }

  parseSpouse(arr: AssistanceYear[]) {
    let i = 0;
    for (const assistYear of this.finAssistApp.assistYears) {
      if (assistYear.hasSpouse) {
        const itm = this.finAssistApp.assistYears[i];
        if (!itm.spouseFiles) itm.spouseFiles = [];
        this.selectedYears.push(itm);
      }
      i++;
    }
  }

  addSpouse() {
    this.finAssistApp.setSpouse = true;
    this.showTaxYears = this.finAssistApp.hasSpouseOrCommonLaw;
    this.stateSvc.finAssistApp.pageStatus[this.urlIndex - 1].btnLabel = 'Continue';
    this.dataSvc.saveFinAssistApplication();
  }

  removeSpouse() {
    this.finAssistApp.setSpouse = false;
    this.showTaxYears = this.finAssistApp.hasSpouseOrCommonLaw;
    this.stateSvc.finAssistApp.pageStatus[this.urlIndex - 1].btnLabel = 'No Spouse';
    this.dataSvc.saveFinAssistApplication();
  }

  toggleYear(bool: boolean, year: number) {
    // console.log(this.finAssistApp);
    if (bool) {
      const itm = this.findYear(year);
      let i = 0;
      for (const assistYear of this.finAssistApp.assistYears) {
        if (assistYear.year === year) this.finAssistApp.assistYears[i] = itm;
        i++;
      }
      this.selectedYears.push(itm);
    } else {
      const itm = this.findYear(year);
      itm.hasSpouse = false;
      let i = 0;
      for (const assistYear of this.finAssistApp.assistYears) {
        if (assistYear.year === year) this.finAssistApp.assistYears[i] = itm;
        i++;
      }
      this.selectedYears = this.selectedYears.filter(x => x.year !== year);
    }
    this.dataSvc.saveFinAssistApplication();
    if (this.finAssistApp.assistYears.some(itm => itm.hasSpouse))
      this.documentsDescription = `Upload your spouse's Canada Revenue Agency Notice of Assessment or Reassessment for ${this.createDocumentDesc(
        this.selectedYears
      )}`;
  }

  findYear(year: number) {
    const [...years] = this.finAssistApp.assistYears.filter(
      x => x.year === year
    );
    const { ...itm } = years[0];
    if (!itm.spouseFiles) itm.spouseFiles = [];
    itm.hasSpouse = true;
    return itm;
  }

  checkYear(year: number) {
    for (const obj of this.finAssistApp.assistYears) {
      if (obj.year === year) {
        if (obj.hasSpouse) {
          return obj.hasSpouse;
        }
        return false;
      }
    }
  }
  createDocumentDesc(years: any[]) {
    return years
      .filter(itm => itm.hasSpouse)
      .map(itm => itm.year)
      .sort((a, b) => a - b)
      .reduce((a, b, i, arr) =>
        i === arr.length - 1 ? `${a} and ${b}.` : `${a}, ${b}`
      );
  }

  ngOnDestroy() {
    this.subscriptionList.forEach(itm => itm.unsubscribe());
  }
}
