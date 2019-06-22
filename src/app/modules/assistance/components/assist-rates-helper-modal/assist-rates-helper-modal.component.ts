import { Component, OnInit, Input } from '@angular/core';
import { IRateBracket } from '../../pages/home/home-constants';
import { Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'msp-assist-rates-helper-modal',
  template: `
    <div class="card">
      <div class="card-body">
        <h4>What year do you want to see the MSP premium rates for?</h4>
        <select (change)="selectYear($event)">
          <ng-container *ngIf="yearOptions$ | async as opts">
            <option selected disabled>Year</option>
            <option *ngFor="let year of opts" (change)="selectYear(year)">{{
              year
            }}</option>
          </ng-container>
        </select>

        <div *ngIf="selectedYear$ | async as selected" class="p-3">
          <br />
          <div *ngIf="yearTitle$ | async as title" class="row pt-2">
            <span class="col-12">
              <b>{{ title }}</b>
            </span>
          </div>
          <div *ngIf="taxReturnInfo$ | async as returnInfo" class="row pb-2">
            <span class="col-12">{{ returnInfo }} </span>
          </div>

          <table class="table table-bordered">
            <tr>
              <th scope="col" *ngFor="let header of tableHeaders">
                {{ header }}
              </th>
            </tr>
            <tr *ngFor="let item of selected">
              <th scope="col">{{ item.netIncome }}</th>
              <th scope="col">{{ item.onePerson | currency }}</th>
              <th scope="col">{{ item.twoFamily | currency }}</th>
              <th scope="col">{{ item.threeFamily | currency }}</th>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./assist-rates-helper-modal.component.scss']
})
export class AssistRatesHelperModalComponent implements OnInit {
  @Input() rateData: any;
  yearOptions$: Observable<number[]>;
  selectedYear$: Subject<IRateBracket[]> = new Subject();
  yearTitle$: Observable<string>;
  yearSummary$: Observable<string>;
  // Provide income information(CRA Notice of Assessment or Notice of Reassessment) for the tax year
  incomeThreshold$: Observable<string>;
  taxReturnInfo$: Observable<string>;
  tableHeaders = [
    'Adjusted Net Income',
    'One Person',
    'Family of Two',
    'Family of Three or More'
  ];

  constructor() {}

  ngOnInit() {
    const opts = [];
    for (const key in this.rateData) {
      // this.yearOptions.push(key);
      opts.push(parseInt(key));
    }
    opts.sort((a, b) => b - a);
    // console.log(this.yearOptions);
    this.yearOptions$ = of(opts);
    this.selectedYear$.subscribe(obs => console.log(obs));
  }

  selectYear(event: any) {
    const year = event.target.value;
    const selectedYear = this.rateData[year];
    const yearTitle = `${year}(January 1, ${year} to December 31, ${year})`;
    const taxReturnInfo = `Provide income information(CRA Notice of Assessment or Notice of Reassessment) for the ${year -
      1} tax year`;
    this.yearTitle$ = of(yearTitle);
    const arr = [];
    for (const key of Object.keys(selectedYear)) {
      arr.push(selectedYear[key]);
    }
    this.selectedYear$.next(arr);
    const incomeThreshold = `Adjusted net income threshold for Retroactive Premiums Assistance: ${
      arr[arr.length - 1].netIncome
    }`;
    this.incomeThreshold$ = of(incomeThreshold);
    this.taxReturnInfo$ = of(taxReturnInfo);
    console.log('array', arr);
  }
}
