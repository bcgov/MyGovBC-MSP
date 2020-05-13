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
  templateUrl:'./assist-rates-modal.component.html',
  styleUrls: ['./assist-rates-modal.component.scss']
})
export class AssistRatesModalComponent implements OnInit {
  @Input() entries: any[];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

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
  }

  close() {
    this.closeModal.emit(true);
  }
  test() {
    this.closeModal.emit(true);
  }
}
