import { Component, OnInit, Input } from '@angular/core';
//TODO: remove after convert files that use msp-confirmation to common-confirm-template
@Component({
  selector: 'msp-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  @Input() title = 'Confirmation message';
  @Input() confirmationNum: string;
  @Input() success: boolean;
  @Input() message: string;

  resultStyle(bool: boolean) {
    return 'failure';
    // return bool ? 'success' : 'failure';
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
    this.month = monthChart[date.getUTCMonth() + 1];
    this.day = date.getDate();
    this.year = date.getFullYear();
  }
}
