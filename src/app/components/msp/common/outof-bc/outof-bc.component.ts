import {Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, OnChanges} from '@angular/core'
import {OutofBCRecord} from "../../model/outof-bc-record.model";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'msp-outof-bc-record',
  templateUrl: './outof-bc.component.html'
})
export class MspOutofBCRecordComponent implements OnChanges, AfterViewInit{
  lang = require('./i18n');
  @ViewChild('formRef') form: NgForm;
  
  @Input()
  outofBCRecord: OutofBCRecord;

  @Output()
  onUpdate: EventEmitter<OutofBCRecord> = new EventEmitter<OutofBCRecord>();
  @Output()
  onDelete: EventEmitter<OutofBCRecord> = new EventEmitter<OutofBCRecord>();

  ngOnChanges(){

  }

  ngAfterViewInit(){
    this.form.valueChanges.subscribe(values => {
      // console.log('outofbc record value changes, %o', values);
      this.onUpdate.emit(values);
    });
    
  }

  delete(id:string){
    // console.log('delete outofBCRecode of id ' + id);
    this.onDelete.emit(this.outofBCRecord);
  }
}