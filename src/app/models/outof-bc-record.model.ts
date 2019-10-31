import {UUID} from 'angular2-uuid';
import * as _ from 'lodash';
import { compareAsc } from 'date-fns';

export class OutofBCRecord {
  readonly id: string;

  constructor(){
    this.id = UUID.UUID();
  }
  reason: string;
  location: string;
  departureDate: Date;
  returnDate: Date;

  /**
   * All fields provided with value
   */
  isValid(): boolean {
    return !this.isEmpty && !!this.reason
    && !this.isEmptyString(this.reason)
    && !this.isEmptyString(this.location)
    && !!this.returnDate
    && !!this.departureDate;
  }

  /**
   * Check return date is not prior to departure date.
   * Returns undefined if both dates are not set.
   */
  get isDateOrderValid(): boolean {
    if (this.hasDeparture && this.hasReturn){
      return compareAsc( this.departureDate, this.returnDate) >= 0;
    }

    return undefined;
  }

  private isEmptyString(s: string): boolean {
    return s === null || s === undefined
    || s.trim().length < 1;
  }

  get isEmpty(): boolean {
    return this.isEmptyString(this.reason) && !this.departureDate
    && !this.returnDate;
  }

  get hasDeparture(): boolean {
    return this.departureDate !== null || this.departureDate !== undefined;
  }


  get hasReturn(): boolean {
    return this.returnDate !== null || this.returnDate !== undefined;
  }

}


/**
 * Storage definition
 */
export class OutofBCRecordDto {
  
  id: string;
  reason: string;
  location: string;
  departureDate: Date;
  returnDate: Date;
}
