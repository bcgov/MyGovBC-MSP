export default class MspValidationService {

  
    /**
     * 
     * @param phn Empty value (null, undefined, empty string) are treated as invalid.
     * @param isBCPhn 
     */
  validatePHN (phn: string, isBCPhn:boolean = true, allowEmptyValue:boolean = false): boolean {
    // pre req checks
    if (phn === null || phn === undefined || phn.trim().length < 1){
      return allowEmptyValue;      
    }

    // Init weights and other stuff
    let weights:number[] = [-1, 2, 4, 8, 5, 10, 9, 7, 3, -1];
    let sumOfRemainders = 0;

    // Clean up string
    phn = phn.trim();

    // Rip off leading zeros with a regex
    let regexp = new RegExp('^0+');
    phn = phn.replace(regexp, "");

    // Test for length
    if (phn.length != 10) {
      return false;
    }
    // Look for a number that starts with 9 if BC only
    if (isBCPhn &&
      phn[0] != '9') {
      return false;
    }
    // Number cannot have 9
    else if (!isBCPhn &&
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
  

  validateSIN (sin: string): boolean {
    // pre req checks
    if (sin === null || sin === undefined ||
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