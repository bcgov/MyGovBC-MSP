import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'msp-assist-rates-modal',
  template: `
    <div class="modal-dialog">
      <div class="modal-header modal-header-primary">
        <h2>What is Adjusted Net Income?</h2>
      </div>
      <button class="btn btn-transparent float-right close-btn">
        <i class="fa fa-times ecks" (click)="close()"></i>
        <span class="hidden">Close modal</span>
      </button>
      <div class="modal-body">
        <p class="border-bottom">
          Estimate your adjusted net income for the tax year(s) below for which
          you are applying. If you feel your adjusted net income will qualify
          you for assistance, we encourage you to apply and your application
          will be reviewed.
        </p>
        <div class="row">
          <div class="col-md-5">
            <div class="row align-items-center">
              <h3 class="col-12 centered">
                Adjusted Net Income threshold for Retroactive Premium Assistance
              </h3>
            </div>
            <table class="table border-bottom ">
              <tr class="d-flex primary-background">
                <th
                  scope="col"
                  class="col-5 primary-background"
                  style="margin: auto auto;"
                >
                  Tax Year
                </th>
                <th scope="col" class="col-7 primary-background">
                  Adjusted Net Income
                </th>
              </tr>

              <tr *ngFor="let entry of entries" class="d-flex">
                <td scope="col" class="col-5 border-left">
                  {{ entry.year }}
                </td>
                <td scope="col" class="col-7  border-left border-right">
                  {{ entry.amount }}
                </td>
              </tr>
            </table>
          </div>

          <div class="col-md-7">
            <h3>Estimate your Adjusted Net Income</h3>
            <p>
              Your net income plus spouse's net income (if applicable) from line
              236 from the Notice of Assessment or Reassessment less total
              deductions that apply to you
            </p>
            <h3>Estimate your deductions</h3>
            <p>Calculate based on the tax year for which you are applying.</p>
            <div *ngFor="let deduction of deductions" class="row">
              <div class="col-7">
                <strong *ngIf="deduction[2]">{{ deduction[2] }}</strong
                ><span>{{ deduction[0] }}</span>
              </div>
              <div class="col-5">
                <span>{{ deduction[1] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./assist-rates-modal.component.scss']
})
export class AssistRatesModalComponent implements OnInit {
  @Input() entries: any[];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;

  deductions = [
    ['Spouse:', '$3,000'],
    ['if you were over 65', '$3,000', 'Age: '],
    ['if spouse was over 65', '$3,000', 'Age: '],
    ['number of children', '$3,000 per child', 'Children: '],
    ['Child care expenses on tax return', '50% of line 214'],
    ['Universal Child Care Benefit', 'line 117'],
    ['number of individuals', '$3,000 per individual', 'Disability: '],
    ['Registered Disability Savings Plan', 'line 125']
  ];

  constructor() {
    this.entries = [
      { year: '2013', amount: '$30,000' },
      { year: '2014', amount: '$30,000' },
      { year: '2015', amount: '$30,000' },
      { year: '2016', amount: '$42,000' },
      { year: '2017', amount: '$42,000' },
      { year: '2018', amount: '$42,000' }
    ];
  }

  ngOnInit() {
    console.log('entries', this.entries);
  }

  close() {
    console.log('clicked');
    // this.closeModal.emit(true);
  }
  test() {
    console.log('test');
  }
}
