import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, NG_VALIDATORS, FormControl} from '@angular/forms';

@Directive({
  selector: '[sinCheck][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SinCheckValidator), multi: true
    }
  ]
})

export class SinCheckValidator implements Validator {

  validate(control: FormControl): {[key:string]:boolean;}  {

    // Get value out of control
    let sin = control.value;

    // pre req checks
    if (sin == null ||
      sin.length < 1) {
      return null;
    }

    if (this.isValid(sin)) {
      // return null for no errors
      return null;
    }
    else {
      // return "true" if we have errors
      return {"sinCheck": true}
    }
  }

  isValid (sin: string): boolean {
    // pre req checks
    if (sin == null ||
      sin.length < 1) return false;

    // Init weights and other stuff
    let weights:number[] = [1,2,1,2,1,2,1,2,1];
    let sum = 0;

    // Clean up string
    sin = sin.trim();

    // Rip off spaces a regex
    let regexp = new RegExp('[ ]', 'g');
    sin = sin.replace(regexp, "");

    // Test for length
    if (sin.length != 9) return false;


    // Walk through each character
    for (let i = 0; i < sin.length; i++) {

      // pull out char
      let char = sin.charAt(i);

      // parse the number
      let num = Number(char);
      if (Number.isNaN(num)) return false;

      // multiply the value against the weight
      let result = num * weights[i];

      // If two digit result, substract 9
      if (result > 9) {
        result = result - 9;
      }

      // add it to our sum
      sum += result;
    }

    // The sum must be divisible by 10
    if (sum % 10 != 0) {
      return false;
    }

    // All done!
    return true;
  }
}
