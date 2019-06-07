import {Component, OnChanges, DoCheck, EventEmitter, Input, OnInit, Output, ChangeDetectorRef} from '@angular/core';
import { BaseComponent } from '../base.component';
import { Base } from 'moh-common-lib';


export interface PasswordErrorMsg {
  required?: string;
  minLength?: string;
  invalid?: string;
}


@Component({
  selector: 'msp-common-income-inputtext',
  templateUrl: './common-income-inputtext.component.html',
  styleUrls: ['./common-income-inputtext.component.scss']
})
export class CommonIncomeInputtextComponent extends Base implements OnInit, OnChanges {

  
  @Input() required: boolean = true;
  @Input() data: string;
  @Input() pattern: string = '^[0-9]{1}[0-9]{0,5}(\.[0-9]{1,2})?$';
  @Input() maxLen: string = '12';
  @Input() label: string;

  public errMsg: PasswordErrorMsg ;
  @Output() incomeChange: EventEmitter<string> = new EventEmitter<string>();
  
  // default messages
  private requiredMsgSeg: string = 'Please provide income information';
  private minLength: string = 'Too many characters';
  private invalid: string = 'Invalid number, use numbers and a period only, e.g., 12345.67';
  
  constructor() {
    super();
  }

  ngOnInit() {
    this.errMsg =    {
      required: this.requiredMsgSeg,
      minLength: this.minLength,
      invalid: this.invalid
     
    };
  }

  ngOnChanges(changes) {
  }

 

  setIncomeVal(event: string) {
    console.log('didi ===>'+event);
    if(event == '') event = undefined;
    
    this.data = event;
    this.incomeChange.emit(this.data);
  }

  
}


