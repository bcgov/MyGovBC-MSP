import { Component, OnInit } from '@angular/core';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { MspDataService } from 'app/services/msp-data.service';
import { AssistanceYear } from '../../models/assistance-year.model';

@Component({
  selector: 'msp-spouse',
  template: `
    <h2>{{ title }}</h2>
    <p class="border-bottom">{{ description }}</p>

    <button
      *ngIf="!showTaxYears"
      class="btn btn-primary btn-md"
      (click)="toggleSpouse()"
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
            [checked]="checkYear(year)"
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
          ></msp-assist-cra-documents>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
  styleUrls: ['./spouse.component.scss']
})
export class SpouseComponent implements OnInit {
  title = 'Tell us if you had a spouse and upload official documents';
  description =
    'If you had a spouse or common-law partner on your MSP Account during any of the years you are requesting assistance for, you are required to upload a copy of their Canada Revenue Agency Notice of Assessment or Notice of Reassessment for each year of the requested assistance.';
  yearTitle = 'Your spouse or common-law partner';
  yearDescription =
    'Tell us if you had a spouse or common-law partner on your MSP account in any of the years of requested assistance';
  documentsTitle = 'Documents';
  documentsDescription = `Upload spouse's Notice of Assessement or Reassessement from Canada Revenue Agency for 2015 and 2016`;

  finAssistApp: FinancialAssistApplication;

  assistanceYears = [];
  assistanceYearsDocs = [];
  selectedYears = [];

  showTaxYears = true;

  constructor(private dataSvc: MspDataService) {
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
  }

  toggleSpouse() {
    this.showTaxYears = !this.showTaxYears;
  }
  toggleYear(bool: boolean, year: number) {
    console.log('event', year);
    bool
      ? this.selectedYears.push(this.findYear(year))
      : (this.selectedYears = this.selectedYears.filter(
          itm => itm.year !== year
        ));
    // let values = this.findYear(year);
    // let { ...selection } = values[0];
    // selection.apply = bool;
    // selection.files = [];
    // console.log(selection);
    // this.selectedYears.push(selection);
    // console.log(this.selectedYears);
  }

  findYear(year: number) {
    const [...years] = this.finAssistApp.assistYears.filter(
      itm => itm.year === year
    );
    const { ...itm } = years[0];
    itm.files = [];
    return itm;
  }

  checkYear(year: number) {
    let test =
      this.selectedYears.filter(itm => itm.year === year).length > 0
        ? true
        : false;
    console.log(test);
    return test;
  }
}
