import { Component, OnInit, Input } from '@angular/core';
import { IRateBracket } from '../../pages/home/home-constants';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'msp-assist-rates-helper-modal',
  template: `
    <h4>What year do you want to see the MSP premium rates for?</h4>
    <select (change)="selectYear($event)">
      <ng-container *ngIf="yearOptions$ | async as opts">
        <option *ngFor="let year of opts" (change)="selectYear(year)">{{
          year
        }}</option>
      </ng-container>
      <ng-container *ngIf="selectedYear$ | async as selected">
        zzz
        <table class="table table-bordered">
          <tr>
            <th scope="col" *ngFor="let header of tableHeaders">
              {{ header }}
            </th>
          </tr>
          <tr *ngFor="let item of selected">
            <th scope="col">{{ item.netIncome }}</th>
            <th scope="col">{{ item.onePerson }}</th>
            <th scope="col">{{ item.twoFamily }}</th>
            <th scope="col">{{ item.threeFamily }}</th>
          </tr>
        </table>
      </ng-container>
    </select>
  `,
  styleUrls: ['./assist-rates-helper-modal.component.scss']
})
export class AssistRatesHelperModalComponent implements OnInit {
  @Input() rateData: any;

  yearOptions: number[] = [];
  yearOptions$: Observable<number[]>;
  selectedYear$: Observable<IRateBracket[]>;
  yearTitle$: Observable<string>;

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
    console.log(this.yearOptions);
    this.yearOptions$ = of(opts);
  }

  selectYear(event: any) {
    const year = event.target.value;
    const yearTitle = `${year}(January 1, ${year} to December 31, ${year})`;
    this.yearTitle$ = of(yearTitle);
    const selectedYear = this.rateData[year];
    const arr = [];
    for (const key of Object.keys(selectedYear)) {
      arr.push(selectedYear[key]);
    }
    this.selectedYear$ = of(arr);
    console.log('array', arr);
  }
}
