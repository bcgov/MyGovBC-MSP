import {
  Component, Input, Output, EventEmitter, ViewChild
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

  @Input()showError: boolean;
  @Output() onUpdate: EventEmitter<OutofBCRecord> = new EventEmitter<OutofBCRecord>();
  @Output() onDelete: EventEmitter<OutofBCRecord> = new EventEmitter<OutofBCRecord>();
  @ViewChild('mspDepartureDate') mspDepartureDate: MspDepartureDateComponent;
  @ViewChild('mspReturnDate') mspReturnDate: MspReturnDateComponent;
  @ViewChild('formRef') form:NgForm;

  delete(id:string){
    this.onDelete.emit(this.outofBCRecord);
  }
}