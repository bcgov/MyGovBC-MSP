import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, NG_VALIDATORS, FormControl} from '@angular/forms';
import {MspValidationService} from '../../service/msp-validation.service';
import { errorHandler } from '@angular/platform-browser/src/browser';

@Directive({
  selector: '[sinCheck][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SinCheckValidator), multi: true
    }
  ]
})

export class SinCheckValidator implements Validator {

  /**
   * A list of SINs, which will be used to test uniquness. If the sin on the
   * element matches any in the sinList, it will fail validation with a
   * `uniqueSin` error property..
   */
  @Input() sinList: string[];

  constructor(private validationService:MspValidationService){

  }

  validate(control: FormControl): {[key:string]:boolean;}  {

    // Get value out of control
    const sin = control.value;

    // pre req checks
    if (sin == null ||
      sin.length < 1) {
      return null;
    }

    const errorObj = {
      "sinCheck": !this.validationService.validateSIN(sin),
    }

    //add properties for each validation failure
    if (this.sinList && this.sinList.length){
      errorObj["uniqueSin"] = !this.isUnique(sin);
    }

    const hasNoErrors = Object.keys(errorObj)
    .map(k => { return errorObj[k]})
    .filter(x => x)
    .length <= 0;

    //Template code expects "null" to not show any errors in the template.
    if (hasNoErrors){
      return null;
    }

    return errorObj;
  }

  private isUnique(sin: string): boolean {
    return this.sinList
      .filter(x => x) //Filter 'undefined' out
      .filter(x => x === sin).length === 0; //The sin won't appear in the list until after passing validation, so we expect to see exactly 0.
  }

}
