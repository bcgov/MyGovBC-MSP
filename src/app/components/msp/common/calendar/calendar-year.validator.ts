import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, NG_VALIDATORS, FormControl} from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[validateCalendarYear][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CalendarYearValidator), multi: true
    }
  ]
})
export class CalendarYearValidator {

  validate(control: FormControl): {[key:string]:boolean;}  {
    // console.log('year value at validator: ' + control.value);
    // Get value out of control
    let year:string = control.value;

    let y:number = parseInt(year);

    if( moment().get('y') - y > 150){
      return {"yearDistantPast": true}
    }
    if( y - moment().get('y') > 150){
      return {"yearDistantFuture": true}
    }

    return null;
  }
  
}