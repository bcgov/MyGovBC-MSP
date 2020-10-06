import { Component, OnInit, Input } from '@angular/core';
import { IRateBracket } from '../../pages/home/home-constants';
import { Observable, of, Subject } from 'rxjs';
import devOnlyConsoleLog from 'app/_developmentHelpers/dev-only-console-log';

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
              <td scope="col">{{ item.netIncome }}</td>
              <td scope="col">{{ item.onePerson | currency }}</td>
              <td scope="col">{{ item.twoFamily | currency }}</td>
              <td scope="col" *ngIf="tableHeaders.length > 3">
                {{ item.threeFamily | currency }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./assist-rates-helper-modal.component.scss']
})
export class AssistRatesHelperModalComponent implements OnInit {
  @Input() rateData: IRateBracket[][];
  yearOptions$: Observable<number[]>;
  selectedYear$: Subject<IRateBracket[]> = new Subject();
  yearTitle$: Observable<string>;
  yearSummary$: Observable<string>;
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
      opts.push(parseInt(key));
    }
    opts.sort((a, b) => b - a);
    this.yearOptions$ = of(opts);
    this.selectedYear$.subscribe(obs => devOnlyConsoleLog(obs));
  }

  selectYear(event: any) {
    const year = event.target.value;
    const selectedYear = this.rateData[year];

    if (parseInt(year) === 2018 || parseInt(year) === 2017) {
      this.tableHeaders = [
        'Adjusted Net Income',
        'One Person',
        'Family of Two'
      ];
    } else {
      this.tableHeaders = [
        'Adjusted Net Income',
        'One Person',
        'Family of Two',
        'Family of Three or More'
      ];
    }

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
  }
}
