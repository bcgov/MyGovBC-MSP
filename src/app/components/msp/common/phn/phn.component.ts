import {Component, Input} from '@angular/core'

require('./phn.component.less')
@Component({
  selector: 'msp-phn',
  templateUrl: './phn.component.html'
})

export class MspPhnComponent {
  lang = require('./i18n');

  @Input() required: boolean = true;
  @Input() phnLabel: String = this.lang("./en/index.js").phnLabel;
  @Input() phn: String;

  constructor() {
  }

  /**
   * Modulus 11 check
   * @returns {boolean}
   */
  mod11Check(): boolean {

    // pre req checks
    if (this.phn === null) return false;

    // Init weights and other stuff
    let weights:number[] = [-1, 2, 4, 8, 5, 10, 9, 7, 3, -1];
    let sumOfRemainders = 0;

    // Clean up string
    this.phn = this.phn.trim();

    // Rip off leading zeros with a regex
    let regexp = new RegExp('^0+');
    this.phn = this.phn.replace(regexp, "");

    // Test for length
    if (this.phn.length != 10) return false;

    // Walk through each character

    for (let i = 0; i < this.phn.length; i++) {

      // pull out char
      let char = this.phn.charAt(i);

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
    let finalDigit = Number(this.phn.substring(9,10));
    if (checkDigit !== finalDigit) return false;

    // We've finally made it!
    return true;
  }
}

/**
 * MOD11 check rules:

 Input to this routine is PHN with no leading zeroes (10 digits - including leading zeroes a PHN is 13 digits).
 The number is broken down into single digits and each digit is weighted. The weights are:

 Digit (by position)  1  2  3  4  5  6  7  8  9  10
 Weight                  2  4  8  5  109 7  3

 The check digit process should ignore any leading zeroes, the first digit (always a 9 for BC) and the last digit (which is not included in computation, but is reserved as the “check digit”). Each digit (2-9) is multiplied by its weight and divided by 11. The remainder is loaded into an array. The array values are added to obtain a total. The total is divided by 11, and the remainder is subtracted from 11 to yield a check digit value. This value is compared to the 10th digit and if equal, the PHN is valid, otherwise the PHN is invalid.
 The PHN used in the example would be represented as 0009012372173 with leading zeroes.
 Example:

 PHN      9  0  1  2  3  7  2  1  7  3
 Weight      2  4  8  5  109  7  3
 Product    0  4  16157 0  1 8  7  21
 (Divide each by 11)
 Remainder is -  0  4  5  4  4  7  7  10

 Sum of remainder values is 41. Divide 41 by 11 to yield a remainder of 8. Subtract remainder from 11 (11-8) =3 which is the check digit (10th digit).  If the result did not match the check digit, the PHN is not valid.
 If the result is 10 or 11, the PHN is not valid.

 (Source: http://www.health.gov.bc.ca/access/pdf/catalogu/tech/app_d.pdf)

 If the first digit of the 10-digit PHN (ignoring leading zeroes) is not 9, the PHN is not valid.

 If the PHN is not 10 digits, or 13 digits with 3 leading zeroes, the PHN is not valid.

 */
