import {Component, Input, EventEmitter, Output, ViewChild, AfterViewInit} from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'msp-health-number',
  templateUrl: './health-number.component.html'
})
export class HealthNumberComponent implements AfterViewInit{
  lang = require('./i18n');

  @Input()healthNumber:string;
  @Input()required:boolean;
  @Output()healthNumberChange:EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('formRef') form: NgForm;

  ngAfterViewInit(){
    // this.form.valueChanges.subscribe(values => {
    //   this.healthNumberChange.emit(values);
    // });
  }

  updateHealthNumber(evt:string){
      this.healthNumberChange.emit(evt);
  }

}