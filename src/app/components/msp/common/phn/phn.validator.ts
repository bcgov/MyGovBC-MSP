import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, NG_VALIDATORS, FormControl} from '@angular/forms';

@Directive({
  selector: '[mod11Check][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => Mod11CheckValidator), multi: true
    }
  ],
  host: {'[attr.mod11Check]': 'mod11Check ? mod11Check : null'}
})

export class Mod11CheckValidator implements Validator {

  @Input('mod11Check') bcPhn: boolean;


  validate(control: FormControl): {[key:string]:boolean;}  {

    // Get value out of control
    let phn = control.value;

    // pre req checks
    if (phn == null ||
      phn.length < 1) return null;

    if (this.isValid(phn)) {
      // return null for no errors
      return null;
    }
    else {
      // return "true" if we have errors
      return {"mod11Check": true}
    }
  }

  isValid (phn: string): boolean {

    // pre req checks
    if (phn == null ||
      phn.length < 1) return false;

    // Init weights and other stuff
    let weights:number[] = [-1, 2, 4, 8, 5, 10, 9, 7, 3, -1];
    let sumOfRemainders = 0;

    // Clean up string
    phn = phn.trim();

    // Rip off leading zeros with a regex
    let regexp = new RegExp('^0+');
    phn = phn.replace(regexp, "");

    // Test for length
    if (phn.length != 10) return false;

    // Look for a number that starts with 9 if BC only
    if (this.bcPhn &&
      phn[0] != '9') {
      return false;
    }
    // Number cannot have 9
    else if (!this.bcPhn &&
      phn[0] == '9') {
        return false;
    }

    // Walk through each character
    for (let i = 0; i < phn.length; i++) {

      // pull out char
      let char = phn.charAt(i);

      // parse the number
      let num = Number(char);
      if (Number.isNaN(num)) return false;

      // Only use the multiplier if weight is greater than zero
      let result = 0;
      if (weights[i] > 0) {
        // multiply the value against the weight
        result = num * weights[i];

        // divide by 11 and save the remainder
        result = result % 11;

        // add it to our sum
        sumOfRemainders += result;
      }
    }

    // mod by 11
    let checkDigit = 11 - (sumOfRemainders % 11);

    // if the result is 10 or 11, it is an invalid PHN
    if (checkDigit === 10 || checkDigit === 11) return false;

    // Compare against 10th digit
    let finalDigit = Number(phn.substring(9,10));
    if (checkDigit !== finalDigit) return false;

    // All done!
    return true;
  }
}
