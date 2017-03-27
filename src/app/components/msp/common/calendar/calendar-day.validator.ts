import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, NG_VALIDATORS, FormControl} from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[validateCalendarDay][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CalendarDayValidator), multi: true
    }
  ]
})
export class CalendarDayValidator {

  validate(control: FormControl): {[key:string]:boolean;}  {

    // Get value out of control
    let day:string = control.value;

    let d:number = parseInt(day);

    if(d > 31 || d< 1){
      return {"calendarDayOutOfRange": true}
    }

    return null;
  }
  
}