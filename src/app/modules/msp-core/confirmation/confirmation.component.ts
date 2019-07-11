import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'msp-confirmation',
  template: `
    <common-page-section>
      <h2>{{ title }}</h2>
      <div [ngClass]="resultStyle">
        <div class="container">
          <h3>
            <i class="fa fa-check-circle" aria-hidden="true"></i> Your
            application has been submitted
          </h3>
          <p class="font-weight-normal h4">
            {{ month }} {{ day }}, {{ year }} - Reference #
            {{ confirmationNum ? confirmationNum : 'N/A' }}
          </p>
        </div>
      </div>
    </common-page-section>
    <common-page-section>
      <h2>Next Steps</h2>
      <hr />

      <ul>
        <!--     <li>
          <h3
            [innerHTML]="lang('./en/index.js').printEmailInstructions"
            onclick="window.print();"
            class="pointer"
          ></h3>
        </li>
        -->
        <li *ngFor="let instruction of generalInstructions">
          <span>{{ instruction }}</span>
        </li>
      </ul>
    </common-page-section>
  `,
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  @Input() title = 'Confirmation Message';
  @Input() confirmationNum: string = 'A12345678';
  @Input() success: boolean;

  get resultStyle() {
    return this.success ? '.success' : '.failure';
  }

  generalInstructions = [
    'Important: Keep your reference number - write it down, or print this page for your records',
    `Health Insurance BC will notify you whether you have qualified for Retroactive Premium Assistance.`
  ];

  month;
  day;
  year;

  constructor() {}

  ngOnInit() {
    const monthChart = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December'
    };
    const date = new Date();
    this.month = monthChart[date.getUTCMonth()];
    this.day = date.getDate();
    this.year = date.getFullYear();
  }
}
