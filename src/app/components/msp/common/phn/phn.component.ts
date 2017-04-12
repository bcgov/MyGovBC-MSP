import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'msp-phn',
  templateUrl: './phn.component.html',
})

export class MspPhnComponent extends BaseComponent {
  lang = require('./i18n');

  @Input() required: boolean = false;
  @Input() phnLabel: string = this.lang("./en/index.js").phnLabel;
  @Input() phn: string;
  @Output() phnChange = new EventEmitter<string>();
  @Input() bcPhn: boolean = false;
  @Input() showError:boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }

  setPhn(value:string){
    this.phn = value;
    this.phnChange.emit(value);  
  }
}