import {Component, ElementRef, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef} from '@angular/core';
import {Masking, NUMBER, SPACE} from '../../../msp/model/masking.model';
import {PasswordErrorMsg} from '../../model/PasswordErrorMsg.interface';

@Component({
  selector: 'msp-common-phn',
  templateUrl: './common-phn.component.html',
  styleUrls: ['./common-phn.component.scss']
})
export class CommonPhnComponent  {

  @Input() required: boolean = true;
  @Input() phnLabel: string = 'PHN (Prsona)';
  @Input() placeholder: string  = '1111 111 111';
  @Input() phn: string;
  @Input() isBCPhn: boolean = false;
  @Input() showError: boolean;
//  @Output() onChange = new EventEmitter<any>();
//  @ViewChild('phnRef') phnRef: ElementRef;
//  @ViewChild('phnfocus') phnFocus: ElementRef;
//  @Input() isForAccountChange: boolean = false;
  @Input() phnTextmask: Array<any>;
  @Input() uniquePHN: boolean = true;
  @Input() phnErrorUnique: string = "This PHN was already used for another family member. Please provide the PHN that is listed on the family member's BC Services Card.";

  @Output() phnChange = new EventEmitter<string>();  
  // Input Masking 
  public mask = [NUMBER, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER];
  public errMsg: PasswordErrorMsg ;
  public phnRegex: RegExp = /^[A-Za-z][0-9][A-Za-z]\s?[0-9][A-Za-z][0-9]$/;

  setPhn(value: string){
    this.phn = value;
    this.phnChange.emit(value);
  }

 /*
  isUnique(): boolean {
    //For tests, router url often isn't mocked.
    if (!this.getPersonList()) { console.log('====='); return null; }

    return this.getPersonList() //Detect what application person to use
      .map(x => x.previous_phn)
      .filter(x => x) //Filter 'undefined' out
      .filter(x => x.length >= 10) //PHN are 10 long. Don't process before.
      .filter(x => x === this.phn).length <= 1; //Allow for one, i.e. itself
     
  }*/

/*  focus() {
    this.phnFocus.nativeElement.focus();
  }
*/
  validatePHN (phn: string, isBCPhn: boolean = true, allowEmptyValue: boolean = false): boolean {
    // pre req checks
    if (phn === null || phn === undefined || phn.trim().length < 1){
      return allowEmptyValue;
    }

    phn = phn.replace(/\s/g, '');

    // Init weights and other stuff
    const weights: number[] = [-1, 2, 4, 8, 5, 10, 9, 7, 3, -1];
    let sumOfRemainders = 0;

    // Clean up string
    phn = phn.trim();

    // Rip off leading zeros with a regex
    const regexp = new RegExp('^0+');
    phn = phn.replace(regexp, '');

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
      const char = phn.charAt(i);

      // parse the number
      const num = Number(char);
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
    const checkDigit = 11 - (sumOfRemainders % 11);

    // if the result is 10 or 11, it is an invalid PHN
    if (checkDigit === 10 || checkDigit === 11) return false;

    // Compare against 10th digit
    const finalDigit = Number(phn.substring(9, 10));
    if (checkDigit !== finalDigit) return false;

    // All done!
    return true;
  }

  isPhnValid() {

    
    
    //this.phn =  this.phn != null ? this.phn.replace(/\s/g, '') : '';
    
    console.log(this.phn);
    console.log(this.validatePHN(this.phn));
    if(this.validatePHN(this.phn)) {

      return null;
    } else {
      return true;
    }
  } 

 /* private filterUnique(x, i, a): boolean {
    return x && a.indexOf( x ) === i;
  }*/
   


}


