import {Component, Input, EventEmitter, Output, 
  OnDestroy, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {NgForm, NgControl, FormControl, ValidatorFn} from "@angular/forms";

@Component({
  selector: 'msp-phn',
  templateUrl: './phn.component.html',

})

export class MspPhnComponent implements AfterViewInit, OnInit, OnDestroy{
  lang = require('./i18n');

  @Input() required: boolean = false;
  @Input() phnLabel: string = this.lang("./en/index.js").phnLabel;
  @Input() phn: string;
  @Output() phnChange = new EventEmitter<string>();
  @Input() bcPhn: boolean = false;
  @Input() showError:boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;

  @Output() isFormValid = new EventEmitter<boolean>();
  @Output() registerComponent = new EventEmitter<MspPhnComponent>();
  @Output() unRegisterComponent = new EventEmitter<MspPhnComponent>();

  ngOnInit(){
    this.registerComponent.emit(this);

    if(!this.required){
      if(this.phn === null || this.phn === undefined || this.phn.trim() === ""){
        this.isFormValid.emit(true);
      }else{
        this.isFormValid.emit(this.form.valid);
      }
    }else{
      this.isFormValid.emit(this.form.valid);
    }
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
      this.isFormValid.emit(this.form.valid);
    });
  }

  setPhn(value:string){
    this.phn = value;
    this.phnChange.emit(value);  
  }

  ngOnDestroy(){
    this.unRegisterComponent.emit(this);
  }
}