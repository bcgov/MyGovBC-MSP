import {Component, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef} from '@angular/core';
import {NgForm} from "@angular/forms";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'msp-health-number',
  templateUrl: './health-number.component.html'
})
export class HealthNumberComponent extends BaseComponent {
  lang = require('./i18n');

  @Input()showError: boolean;
  @Input()healthNumber:string;
  @Input()required:boolean;
  @Output()healthNumberChange:EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('formRef') form: NgForm;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  updateHealthNumber(evt:string){
    this.healthNumberChange.emit(evt);
  }
}