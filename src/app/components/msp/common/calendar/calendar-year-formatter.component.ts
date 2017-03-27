import { Directive, HostListener, HostBinding, 
  ElementRef, Input, Output, EventEmitter } 
from '@angular/core';
import {NgModel,NgControl} from '@angular/forms';

import * as moment from 'moment';

@Directive({
  selector: '[calendarFieldFormatter]'
})
export class CalendarYearFormatter {

  @Output() ngModelChange: EventEmitter<string> = new EventEmitter<string>(false);
  @Input()calendarFieldFormatter:string;

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;

    let trimmed = input.value.trim();
    if(/[^\d]+/.test(input.value)){
      trimmed = trimmed.replace(/[^\d]/g, '');
    }
    
    if(this.calendarFieldFormatter.toLowerCase() === 'year'){
      trimmed = trimmed.substr(0, 4);
    }else{
      trimmed = trimmed.substr(0, 2);
    }

    input.value = trimmed;
    this.ngModelChange.emit(trimmed);
  }
}