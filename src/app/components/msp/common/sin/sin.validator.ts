import { Directive, forwardRef, Input } from '@angular/core';
import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms';
import { MspValidationService } from '../../service/msp-validation.service';
import { errorHandler } from '@angular/platform-browser/src/browser';


/**
 * Validates an input for having a valid SIN number.  Use the (optional)
 * secondary field "sinList" to provide a list of all SINS to compare against
 * for uniqueness.
 *
 * @example
 * <input type="text"
 *      [(ngModel)]="person.sin"
 *      sinCheck //Check if it's a valid SIN
 *      [sinList]="getSinList()" //(optional) check if it's a unique SIN
 *      required
 *      pattern="[1-9]{1}\d{2}\s?\d{3}\s?\d{3}">
 * @class SinCheckValidator
 * @implements {Validator}
 */
@Directive({
  selector: '[sinCheck][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS, useExisting: forwardRef(() => SinCheckValidator), multi: true
    }
  ]
})

export class SinCheckValidator implements Validator {

  /**
   * (optional) An array of SINS, used to test uniqueness. If a SIN is a
   * duplicate, it fails with the `uniqueSin` error property.
   */
  @Input() sinList: string[];

  constructor(private validationService: MspValidationService) {
  }

  validate(control: FormControl): { [key: string]: boolean; } {

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

    //only check unqiueness if it's been touched. avoids false-positives for
    //duplicates when refreshing page with values loaded via localStorage
  /*
    if (control.touched && this.sinList && this.sinList.length) {
      errorObj["uniqueSin"] = !this.isUnique(sin);
    }
    */

    //if all error properties are false, return null, because that's what templates expect.
    const hasNoErrors = Object.keys(errorObj)
      .map(k => { return errorObj[k] })
      .filter(x => x)
      .length <= 0;

    if (hasNoErrors) {
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
