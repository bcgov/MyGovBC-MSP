import {forwardRef, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Masking, NUMBER, SPACE} from '../../model/masking.model';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import { ControlContainer, ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * RadioComponent is a single radio which can be used to have multiple radios based on 
 * the radio label values.
 * 
 * @example
 *       	<common-sin [required]="true" label='SIN Number' [data]="person.sin"  >
 *        </common-sin>
 *       
 * @export
 */
@Component({
  selector: 'msp-common-sin',
  templateUrl: './common-sin.component.html',
  styleUrls: ['./common-sin.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => CommonSinComponent )}
  ]
})

export class CommonSinComponent extends Masking implements OnInit, ControlValueAccessor {

  @Input() sinList: string[] = [];
  @Input() label: string = 'Social Insurance Number (SIN)';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Output() uniqueSinError: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sinChange = new EventEmitter<string>();
  public mask = [NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER];
  public placeholder = '046 454 286';
  @Input() pattern: string = "[1-9]{1}\d{2}\s?\d{3}\s?\d{3}";
  @Input() data : string;
  public uniqueSinErrMsg: string = 'Social Insurance Number (SIN) was already used for another family member.';
  @Input() uniqueSins: boolean = true;
  private _regex: RegExp = /^[0-9 ]*$/;
  

  /**
   * We use rxjs for performance benefits to reduce the calls to checking uniqueness of PHNs
   */
  private checkSinUniqueness = new BehaviorSubject(null );

  public _onChange = (_: any) => {};
  public _onTouched = () => {};

  constructor( private cdref: ChangeDetectorRef ) {
    super(cdref);
  }

  ngOnInit() {
    // Setup listener
    this.checkSinUniqueness
        .pipe(
            distinctUntilChanged(),
            debounceTime(200),
        )
        .subscribe(list => {

          // List text is complete - no placeholder '_' present
          if ( list && list .filter( x => this._regex.test(x) ).length > 1 ) {
            console.log(list);
            //this.uniqueSins = this.isUnique( list  );
            //this.uniqueSinError.emit( (this.uniqueSins ? false : true ) );

            // Since we use debounceTime(), updates can happen after Angular change
            // detection is done, so we have to manually invoke it.
            this.cdref.detectChanges();
          }
        });
  }

  isUnique( list: string[] ): boolean {
    const sortedList = list.sort().filter( x => x );
    const uniqueList = sortedList.filter( this.filterUnique );
    return ( uniqueList.length === sortedList.length );
  }

  private filterUnique(x, i, a): boolean {
    return x && a.indexOf( x ) === i;
  }

  isSinValid() {
    if(!this.data) {
      return null;
    } 
      
    const isValid = this.validateSIN(this.data);
    console.log(isValid);
    return isValid;
    
    

  } 

  dataChange(changes: string) {
    //console.log( 'changes: ', changes );
    this.data = changes;
    this.sinChange.emit(changes);
    this._onChange(changes);
		this._onTouched();

    // text is complete - no placeholder '_' present
    if ( changes && this._regex.test( this.value ) ) {

      // check SIN uniqueness
      this.checkSinUniqueness.next(this.sinList);

    }
  
  }

  ngOnDestroy(){
    this.checkSinUniqueness.unsubscribe();
  }

  validateSIN (sin: string): boolean {
    // pre req checks
    if (sin === null || sin === undefined ||
      sin.length < 1) return false;

    // Init weights and other stuff
    const weights: number[] = [1, 2, 1, 2, 1, 2, 1, 2, 1];
    let sum = 0;

    // Clean up string
    sin = sin.trim();

    // Rip off spaces a regex
    const regexp = new RegExp('[ ]', 'g');
    sin = sin.replace(regexp, '');

    // Test for length
    if (sin.length != 9) return false;


    // Walk through each character
    for (let i = 0; i < sin.length; i++) {

      // pull out char
      const char = sin.charAt(i);

      // parse the number
      const num = Number(char);
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

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }
}


