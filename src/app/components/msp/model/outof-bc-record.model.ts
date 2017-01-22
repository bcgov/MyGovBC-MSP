import {UUID} from "angular2-uuid";
import * as _ from 'lodash';

export class OutofBCRecord {
  readonly id:string;

  constructor(){
    this.id = UUID.UUID();
  }
  reasonAndLocation:string;
  departureDay: number;
  departureMonth:string;
  departureYear:number;
  
  returnDay:number;
  returnMonth:string;
  returnYear:number;

  /**
   * All fields provided with value
   */
  isValid():boolean {
    return !this.isEmpty
    && this.reasonAndLocation.length > 0
    && _.isNumber(this.departureDay)
    && _.isNumber(this.departureYear)
    && _.isString(this.departureMonth)
    && _.isNumber(this.returnDay)
    && _.isNumber(this.returnYear)
    && _.isString(this.returnMonth);
  }

  private isEmptyString(s:string):boolean {
    return s === null || s === undefined 
    || s.trim().length < 1
  }

  private isNotNumber(n:any){
    return n === null || n === undefined || !_.isNumber(n)
  }

  get isEmpty():boolean {
    return this.isEmptyString(this.reasonAndLocation)
    && this.isEmptyString(this.departureMonth)
    && this.isEmptyString(this.returnMonth)
    && this.isNotNumber(this.departureDay)
    && this.isNotNumber(this.departureYear)
    && this.isNotNumber(this.returnDay)
    && this.isNotNumber(this.returnYear);
  }
}