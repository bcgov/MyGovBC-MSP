import {UUID} from "angular2-uuid";
import * as _ from 'lodash';


import * as moment from 'moment';

export class OutofBCRecord {
  readonly id:string;

  constructor(){
    this.id = UUID.UUID();
  }
  reason: string;
  location: string;
  departureDay: number;
  departureMonth:number;
  departureYear:number;
  
  returnDay:number;
  returnMonth: number;
  returnYear:number;

  /**
   * All fields provided with value
   */
  isValid():boolean {
    return !this.isEmpty && !!this.reason
    && !this.isEmptyString(this.reason)
    && !this.isEmptyString(this.location)
    && _.isNumber(this.departureDay)
    && _.isNumber(this.departureYear)
    && _.isString(this.departureMonth)
    && _.isNumber(this.returnDay)
    && _.isNumber(this.returnYear)
    && _.isString(this.returnMonth);
  }

  /**
   * Check return date is not prior to departure date.
   * Returns undefined if both dates are not set.
   */
  get isDateOrderValid(): boolean {
    if (this.hasDeparture && this.hasReturn){
      return this.departureDate.isSameOrBefore(this.returnDate);
    }

    return undefined;
  }

  private isEmptyString(s:string):boolean {
    return s === null || s === undefined 
    || s.trim().length < 1
  }

  private isNotNumber(n:any){
    return n === null || n === undefined || !_.isNumber(n)
  }

  get isEmpty():boolean {
    return this.isEmptyString(this.reason)
    && this.isNotNumber(this.departureMonth)
    && this.isNotNumber(this.returnMonth)
    && this.isNotNumber(this.departureDay)
    && this.isNotNumber(this.departureYear)
    && this.isNotNumber(this.returnDay)
    && this.isNotNumber(this.returnYear);
  }

  get hasDeparture(): boolean {
    return (this.departureDay != null &&
    this.departureMonth != null &&
    this.departureYear != null);
  }

  get departureDate() {
    return this.parseDate(this.departureYear, this.departureMonth, this.departureDay);
  }

  get hasReturn(): boolean {
    return (this.returnDay != null &&
    this.returnMonth != null &&
    this.returnYear != null);
  }

  get returnDate() {
    return this.parseDate(this.returnYear, this.returnMonth, this.returnDay);
  }

  private parseDate (year: number, month: number, day: number) {
    return moment({
      year: year,
      month: month - 1, // moment use 0 index for month :(
      day: day,
    }).utc(); // use UTC mode to prevent browser timezone shifting
  }
}