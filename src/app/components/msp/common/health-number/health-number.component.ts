import {Component, Input, EventEmitter, 
  OnDestroy, Output, ViewChild, AfterViewInit} from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'msp-health-number',
  templateUrl: './health-number.component.html'
})
export class HealthNumberComponent implements AfterViewInit, OnDestroy{
  lang = require('./i18n');

  @Input()showError: boolean;
  @Input()healthNumber:string;
  @Input()required:boolean;
  @Output()healthNumberChange:EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('formRef') form: NgForm;
  @Output() registerComponent = new EventEmitter<HealthNumberComponent>();
  @Output() unRegisterComponent = new EventEmitter<HealthNumberComponent>();
  @Output() isFormValid = new EventEmitter<boolean>();

  
  ngAfterViewInit(){
    this.registerComponent.emit(this);
    this.isFormValid.emit(this.form.valid);
    this.form.valueChanges.subscribe(
      value => {
        this.isFormValid.emit(this.form.valid);
      }
    );
  }

  updateHealthNumber(evt:string){
    this.healthNumberChange.emit(evt);
    this.isFormValid.emit(this.form.valid);
  }

  ngOnDestroy(){
    this.unRegisterComponent.emit(this);
  }
}