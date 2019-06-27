import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { MspDataService } from 'app/services/msp-data.service';
import { AssistanceYear } from '../../models/assistance-year.model';
import { BaseComponent } from 'app/models/base.component';
import { PersonDocuments } from 'app/components/msp/model/person-document.model';
import { AssistStateService } from '../../services/assist-state.service';
import { ActivatedRoute } from '@angular/router';

export interface spouseYears {
  apply: boolean;
  year: number;
}

@Component({
  selector: 'msp-spouse',
  template: `
    <h2>{{ title }}</h2>
    <p class="border-bottom">{{ description }}</p>

    <button
      *ngIf="!showTaxYears"
      class="btn btn-primary btn-md"
      (click)="addSpouse()"
    >
      Add Spouse
    </button>
    <ng-container *ngIf="showTaxYears">
      <h2>{{ yearTitle }}</h2>
      <div class="border-bottom">
        <div class="row">
          <span class="col-11">{{ yearDescription }}</span>
          <button
            *ngIf="showTaxYears"
            class="col-1 btn btn-transparent float-right"
            (click)="removeSpouse()"
          >
            <i class="fa fa-times ecks"></i>
          </button>
        </div>
      </div>
      <label>In what years did you have a spouse on your MSP account?</label>
      <div class="row">
        <div class="col-12">
          <common-checkbox
            *ngFor="let year of assistanceYears"
            class="col-1"
            [label]="year"
            [data]="checkYear(year)"
            (dataChange)="toggleYear($event, year)"
          ></common-checkbox>
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
  `,
  styleUrls: ['./spouse.component.scss']
})
export class SpouseComponent extends BaseComponent implements OnInit {
  title = 'Tell us if you had a spouse and upload official documents';
  description =
    'If you had a spouse or common-law partner on your MSP Account during any of the years you are requesting assistance for, you are required to upload a copy of their Canada Revenue Agency Notice of Assessment or Notice of Reassessment for each year of the requested assistance.';
  yearTitle = 'Your spouse or common-law partner';
  yearDescription =
    'Tell us if you had a spouse or common-law partner on your MSP account in any of the years of requested assistance';
  documentsTitle = 'Documents';
  documentsDescription = `Upload spouse's Notice of Assessement or Reassessement from Canada Revenue Agency for 2015 and 2016`;

  finAssistApp: FinancialAssistApplication;
  documents: PersonDocuments;

  assistanceYears = [];
  assistanceYearsDocs = [];
  selectedYears: spouseYears[] = [];

  showTaxYears = false;

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
    let arr = [];
    const checkYear = (year: AssistanceYear) => {
      return year.apply ? year : null;
    };
    for (let year of assistYears) {
      arr.push(checkYear(year));
    }
    this.assistanceYears = arr.filter(itm => itm != null).map(itm => itm.year);

    this.assistanceYearsDocs = arr;
    this.showTaxYears = this.finAssistApp.hasSpouseOrCommonLaw;
    if (this.finAssistApp.hasSpouseOrCommonLaw)
      this.documents = this.finAssistApp.spouse.documents;

    const years = this.finAssistApp.assistYears;
    let hasSpouse = years.some(itm => itm.hasSpouse);
    if (hasSpouse) this.parseSpouse(years);
    this.stateSvc.setIndex(this.route.snapshot.routeConfig.path);
  }

  parseSpouse(arr: AssistanceYear[]) {
    let i = 0;
    for (let assistYear of this.finAssistApp.assistYears) {
      if (assistYear.hasSpouse) {
        let itm = this.finAssistApp.assistYears[i];
        if (!itm.spouseFiles) itm.spouseFiles = [];
        this.selectedYears.push(itm);
      }
      i++;
    }
  }

  addSpouse() {
    this.finAssistApp.setSpouse = true;
    this.showTaxYears = this.finAssistApp.hasSpouseOrCommonLaw;
    this.dataSvc.saveFinAssistApplication();
  }
  removeSpouse() {
    this.finAssistApp.setSpouse = false;
    this.showTaxYears = this.finAssistApp.hasSpouseOrCommonLaw;
    this.dataSvc.saveFinAssistApplication();
  }
  toggleYear(bool: boolean, year: number) {
    // console.log(this.finAssistApp);
    if (bool) {
      const itm = this.findYear(year);
      let i = 0;
      for (let assistYear of this.finAssistApp.assistYears) {
        if (assistYear.year === year) this.finAssistApp.assistYears[i] = itm;
        i++;
      }
      this.selectedYears.push(itm);
    } else {
      const itm = this.findYear(year);
      itm.hasSpouse = false;
      let i = 0;
      for (let assistYear of this.finAssistApp.assistYears) {
        if (assistYear.year === year) this.finAssistApp.assistYears[i] = itm;
        i++;
      }
      this.selectedYears = this.selectedYears.filter(itm => itm.year !== year);
    }
    this.dataSvc.saveFinAssistApplication();
  }

  findYear(year: number) {
    const [...years] = this.finAssistApp.assistYears.filter(
      itm => itm.year === year
    );
    const { ...itm } = years[0];
    if (!itm.spouseFiles) itm.spouseFiles = [];
    itm.hasSpouse = true;
    return itm;
  }

  checkYear(year: number) {
    for (let obj of this.finAssistApp.assistYears) {
      if (obj.year === year) {
        if (obj.hasSpouse) {
          return obj.hasSpouse;
        }
        return false;
      }
    }
  }
}
