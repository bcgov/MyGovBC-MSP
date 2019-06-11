import {
  Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef
} from '@angular/core';
import {OutofBCRecord} from '../../model/outof-bc-record.model';
import {NgForm} from '@angular/forms';




import {BaseComponent} from '../../../../models/base.component';
import {MspDepartureDateComponent} from '../departure-date/departure-date.component';
import {MspReturnDateComponent} from '../return-date/return-date.component';

@Component({
  selector: 'msp-outof-bc-record',
  templateUrl: './outof-bc.component.html'
})
export class MspOutofBCRecordComponent extends BaseComponent {
  lang = require('./i18n');

  @Input() outofBCRecord: OutofBCRecord;

  @Input()futureReturnDate: boolean;
  @Input()futureDepartureDate: boolean;
  @Input()showError: boolean;
  @Output() onUpdate: EventEmitter<OutofBCRecord> = new EventEmitter<OutofBCRecord>();
  @Output() onDelete: EventEmitter<OutofBCRecord> = new EventEmitter<OutofBCRecord>();
  @ViewChild('mspDepartureDate') mspDepartureDate: MspDepartureDateComponent;
  @ViewChild('mspReturnDate') mspReturnDate: MspReturnDateComponent;
  @ViewChild('formRef') form: NgForm;
    @Input()maxMonthsRange: number;
    @Input()maxMonthsRangeErrorMsg: string;
    @Input()minMonthsRange: number;
    @Input()minMonthsRangeErrorMsg: string;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  delete(id: string){
    this.onDelete.emit(this.outofBCRecord);
  }

    isValid(): boolean {
        return this.mspReturnDate.inputDate().isAfter(this.mspDepartureDate.inputDate());
    }

}
