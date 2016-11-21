import {
  Component, Input, Output, OnChanges, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit
} from '@angular/core';

import {FinancialAssistApplication} from '../../../model/financial-assist-application.model';
require('./deduction-calculator.less');

@Component({
  selector: 'deduction-calculator',
  templateUrl: './deduction-calculator.html'
})

export class DeductionCalculatorComponent{
  @Input() application: FinancialAssistApplication;

  constructor(){

  }
}