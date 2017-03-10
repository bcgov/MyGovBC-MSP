import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, NG_VALIDATORS, FormControl} from '@angular/forms';
import ValidationService from '../../service/msp-validation.service';

@Directive({
  selector: '[sinCheck][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SinCheckValidator), multi: true
    }
  ]
})

export class SinCheckValidator implements Validator {

  constructor(private validationService:ValidationService){

  }

  validate(control: FormControl): {[key:string]:boolean;}  {

    // Get value out of control
    let sin = control.value;

    // pre req checks
    if (sin == null ||
      sin.length < 1) {
      return null;
    }

    if (this.validationService.validateSIN(sin)) {
      // return null for no errors
      return null;
    }
    else {
      // return "true" if we have errors
      return {"sinCheck": true}
    }
  }

}
