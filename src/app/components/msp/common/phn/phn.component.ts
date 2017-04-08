import {Component, Input, EventEmitter, Output, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {NgForm, NgControl, FormControl, ValidatorFn} from "@angular/forms";

@Component({
  selector: 'msp-phn',
  templateUrl: './phn.component.html',

})

export class MspPhnComponent implements AfterViewInit, OnInit{
  lang = require('./i18n');

  @Input() required: boolean = false;
  @Input() phnLabel: string = this.lang("./en/index.js").phnLabel;
  @Input() phn: string;
  @Output() phnChange = new EventEmitter<string>();
  @Input() bcPhn: boolean = false;
  @Input() showError:boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;

  @Input() isFormValid = new EventEmitter<boolean>();
  @Input() registerComponent = new EventEmitter<MspPhnComponent>();

  ngOnInit(){
    
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
    this.isFormValid.emit(this.form.valid);
  }

  setPhn(value:string){
    this.phn = value;
    this.phnChange.emit(value);  

    if(this.required){
      this.isFormValid.emit(this.form.valid);
    }else{
      this.isFormValid.emit(true);
    }
  }
}