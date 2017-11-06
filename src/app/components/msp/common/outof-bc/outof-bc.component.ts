import {
  Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef
} from '@angular/core'
import {OutofBCRecord} from "../../model/outof-bc-record.model";
import {NgForm} from "@angular/forms";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {BaseComponent} from "../base.component";
import {MspDepartureDateComponent} from "../departure-date/departure-date.component";
import {MspReturnDateComponent} from "../return-date/return-date.component";

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
  @ViewChild('formRef') form:NgForm;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  delete(id:string){
    this.onDelete.emit(this.outofBCRecord);
  }
}