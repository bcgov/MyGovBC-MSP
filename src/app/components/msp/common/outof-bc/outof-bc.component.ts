import {Component, Input, Output, EventEmitter, AfterViewInit,
  OnInit, OnDestroy, ViewChild, OnChanges} from '@angular/core'
import {OutofBCRecord} from "../../model/outof-bc-record.model";
import {NgForm} from "@angular/forms";
import {MspReturnDateComponent} from "../return-date/return-date.component";
import {MspDepartureDateComponent} from "../departure-date/departure-date.component";

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'msp-outof-bc-record',
  templateUrl: './outof-bc.component.html'
})
export class MspOutofBCRecordComponent implements AfterViewInit{
  lang = require('./i18n');
  private validationSubscription:Subscription;
  @ViewChild('formRef') form: NgForm;
  
  @Input()
  outofBCRecord: OutofBCRecord;

  @Input()showError: boolean;
  @Output()
  onUpdate: EventEmitter<OutofBCRecord> = new EventEmitter<OutofBCRecord>();
  @Output()
  onDelete: EventEmitter<OutofBCRecord> = new EventEmitter<OutofBCRecord>();

  @Output() isFormValid = new EventEmitter<boolean>();
  @Output() registerComponent = new EventEmitter<MspOutofBCRecordComponent>();
  @Output() unRegisterComponent = new EventEmitter<MspOutofBCRecordComponent>();

  @ViewChild(MspDepartureDateComponent) departureDateComp: MspDepartureDateComponent;
  @ViewChild(MspReturnDateComponent) returnDateComp: MspReturnDateComponent;

  ngAfterViewInit(){
  }

  ngOnInit(){
    let curFormValidation:Observable<boolean> = this.form.valueChanges.map(
      (values) => {
        return this.form.valid;
      }
    );
    this.validationSubscription = this.departureDateComp.isFormValid
      .combineLatest(
        this.returnDateComp.isFormValid,
        curFormValidation
      )
      .subscribe( values => {
        let combined:boolean|{} = values.reduce(
          function(acc, cur){
            return acc && cur;
          },true
        );
        // console.log('outof-bc component validation status %s', combined);
        this.isFormValid.emit(combined as boolean);
      }
    );

    this.form.valueChanges.subscribe(values => {
      // console.log('outofbc record value changes, %o', values);
      this.onUpdate.emit(values);
    });
    this.registerComponent.emit(this);
  }

  ngOnDestroy(){
    this.validationSubscription.unsubscribe();
    this.unRegisterComponent.emit(this);
  }

  delete(id:string){
    // console.log('delete outofBCRecode of id ' + id);
    this.onDelete.emit(this.outofBCRecord);
  }


}