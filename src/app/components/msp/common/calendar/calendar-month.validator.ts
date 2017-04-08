import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, NG_VALIDATORS, FormControl} from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[validateCalendarMonth][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CalendarMonthValidator), multi: true
    }
  ]
})
export class CalendarMonthValidator {

  validate(control: FormControl): {[key:string]:boolean;}  {

    // Get value out of control
    let month:string = control.value;

    if(month){
      let m:number = parseInt(month);
      // console.log('calendar month: %d', m);
      // console.log('calendar month required?: %o', control);
      if(!(m > 0 && m < 13)){
        return {"calendarMonthOutOfRange": true}
      }
      return null;
    }else{
        return {"calendarMonthEmptyValue": true}
    }
  }
  
}