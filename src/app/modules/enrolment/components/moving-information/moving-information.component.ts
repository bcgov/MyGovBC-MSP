import { Component, OnInit, forwardRef, EventEmitter, Input, Output } from '@angular/core';
import { Base, PROVINCE_LIST, BRITISH_COLUMBIA, COUNTRY_LIST, SimpleDate } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { StatusInCanada, CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';
import { environment } from '../../../../../environments/environment';
import { Relationship } from '../../../../models/relationship.enum';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import * as moment_ from 'moment';
const moment = moment_;

enum OopDateValidationCodes {
  VALID,  // Valid
  OUT_OF_RANGE, // Not within last 12 months
  DEPARTURE_INVALID // departure date must be prior to return date
}

@Component({
  selector: 'msp-moving-information',
  templateUrl: './moving-information.component.html',
  styleUrls: ['./moving-information.component.scss'],

  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})
export class MovingInformationComponent extends Base implements OnInit {

  @Input() person: MspPerson;
  @Output() personChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

  // Web links
  links = environment.links;
  countryList = COUNTRY_LIST;
  // Remove BC from province list
  provinceList = PROVINCE_LIST.map( x => {
    if ( x.provinceCode !== BRITISH_COLUMBIA ) {
      return x;
    }
  }).filter( x => x );

  relationship: string = 'you';

  departureDateLabel = 'Departure date';
  returnDateLabel = 'Return date';


  private _oopDepartureDateError: OopDateValidationCodes = OopDateValidationCodes.VALID;
  private _oopReturnDateError: OopDateValidationCodes = OopDateValidationCodes.VALID;

  // All times in this application are UTC
  private _today = moment().utc();

  constructor() {
    super();
  }

  ngOnInit() {
    if ( !this.isApplicant ) {
      this.relationship = 'they';
    }
  }

  get isApplicant() {
    return this.person.relationship === Relationship.Applicant;
  }

  get isProvinceMove() {
    return this.person.currentActivity === CanadianStatusReason.MovingFromProvince;
  }

  get isCountryMove() {
    return this.person.currentActivity === CanadianStatusReason.MovingFromCountry;
  }

  get isLivingWithoutMSP() {
    return this.person.currentActivity === CanadianStatusReason.LivingInBCWithoutMSP;
  }

  get isCanadianResident() {
    return this.person.status === StatusInCanada.CitizenAdult;
  }

  get isPermanentResident() {
    return this.person.status === StatusInCanada.PermanentResident;
  }

  get isTemporaryResident() {
    return this.person.status === StatusInCanada.TemporaryResident;
  }

  get requestLivedInBC() {
    return this.isCanadianResident && this.isLivingWithoutMSP;
  }

  get requestPermMoveInfo() {
    //console.log( 'requestPermMoveInfo: ', this.person.livedInBCSinceBirth, this.requestLivedInBC );
    if ( this.requestLivedInBC ) {
      // Convert to boolean
      return this.person.livedInBCSinceBirth !== undefined && this.person.livedInBCSinceBirth !== null;
    }
    return this.isCanadianResident || this.isPermanentResident || this.isTemporaryResident;
  }

  get canContinueProcess() {

    //console.log( 'canContinueProcess: ', this.person.madePermanentMoveToBC );
    if ( this.person.madePermanentMoveToBC !== null &&
         this.person.madePermanentMoveToBC !== undefined ) {

      if ( this.requestLivedInBC ) {
        return this.person.livedInBCSinceBirth !== undefined &&
               this.person.livedInBCSinceBirth !== null &&
               this.person.madePermanentMoveToBC === true;
      }
      return this.person.madePermanentMoveToBC === true || this.isTemporaryResident;
    }
    return true;
  }

  get requestProvinceMoveInfo() {
    return (this.isCanadianResident && (this.isProvinceMove ||
           (this.isLivingWithoutMSP && this.person.livedInBCSinceBirth === false))) ||
           (this.isPermanentResident && this.isProvinceMove);
  }

  get requestCountryMoveInfo() {
    return (this.isCanadianResident || this.isPermanentResident) && this.isCountryMove;
  }

  get requestArrivalInBCInfo() {
    return ((this.isCanadianResident || this.isPermanentResident) &&
           (this.isProvinceMove || this.isCountryMove)) || this.isTemporaryResident;
  }

  get arrivalDateRequired() {
    return (this.isCountryMove &&
           (this.isCanadianResident || this.isPermanentResident)) ||
           this.isTemporaryResident;
  }

  get requestProvHealthNumber() {
    return this.isProvinceMove && (this.isCanadianResident || this.isPermanentResident);
  }

  get requestArmForceInfo() {
    return this.isCanadianResident ||
          (this.isApplicant && this.isPermanentResident);
  }

  get requestRecentMoveToBC() {
    //console.log( 'requestRecentMoveToBC ', this.requestLivedInBC, this.person.livedInBCSinceBirth );
    if ( this.requestLivedInBC ) {
      return this.person.livedInBCSinceBirth === false;
    }
    return true;
  }

  get requestArrivalToCanada() {
    //console.log( 'requestArrivalToCanada ', this.requestLivedInBC, this.person.livedInBCSinceBirth );
    if ( this.requestLivedInBC ) {
      return this.person.livedInBCSinceBirth === false;
    }
    return true;
  }

  get isValidDepartureDate() {
    return this._oopDepartureDateError === OopDateValidationCodes.VALID;
  }

  get isValidReturnDate() {
    return this._oopReturnDateError === OopDateValidationCodes.VALID;
  }

  get departureDateError() {
    let message = this.departureDateLabel;

    switch ( this._oopDepartureDateError ) {
      case OopDateValidationCodes.OUT_OF_RANGE:
        message = message.concat( ' must be within the last 12 months.' );
        break;
      case OopDateValidationCodes.DEPARTURE_INVALID:
        message = message.concat( ' must be prior to the return date.' );
        break;
      default:
    }
    return message;
  }

  get returnDateError() {
    let message = this.returnDateLabel;

    switch ( this._oopReturnDateError ) {
      case OopDateValidationCodes.OUT_OF_RANGE:
        message = message.concat( ' must be within the last 12 months.' );
        break;
      case OopDateValidationCodes.DEPARTURE_INVALID:
          message = message.concat( ' must be after the departure date.' );
          break;
    default:
    }
    return message;
  }

  validateDepartureDate($event) {
    this.person.departureDate = $event;

    if ( OopDateValidationCodes.DEPARTURE_INVALID === this._oopReturnDateError ) {
      // clear error - only display invalid departure date in one location
      this._oopReturnDateError = OopDateValidationCodes.VALID;
    }

    this._oopDepartureDateError = this.validateDateRange( this.person.departureDate );
    if ( this._oopDepartureDateError === OopDateValidationCodes.VALID ) {
      this._oopDepartureDateError = this.invalidDepartureDate( this.person.departureDate, this.person.returnDate );
    }
  }

  validateReturnDate($event) {
    this.person.returnDate = $event;

    if ( OopDateValidationCodes.DEPARTURE_INVALID === this._oopDepartureDateError ) {
      // clear error - only display invalid departure date in one location
      this._oopDepartureDateError = OopDateValidationCodes.VALID;
    }

    this._oopReturnDateError = this.validateDateRange( this.person.returnDate );
    if ( this._oopReturnDateError === OopDateValidationCodes.VALID ) {
      this._oopReturnDateError = this.invalidDepartureDate( this.person.departureDate, this.person.returnDate );
    }
  }

  private invalidDepartureDate( departureDate: SimpleDate, returnDate: SimpleDate ) {

    const _depart = Object.keys(departureDate).filter( x => departureDate[x] === null ||  departureDate[x] === undefined );
    const _ret = Object.keys(returnDate).filter( x => returnDate[x] === null || returnDate[x] === undefined );

    if ( _depart.length === 0  && _ret.length === 0 ) {
      const diff = moment({
        year: returnDate.year,
        month: returnDate.month - 1,
        day: returnDate.day })
        .diff( moment({
          year: departureDate.year,
          month: departureDate.month - 1,
          day: departureDate.day }), 'days', true );

        // console.log( 'invalid departure must be prior to return day: ', diff );

        return (diff <= 0) ? OopDateValidationCodes.DEPARTURE_INVALID : OopDateValidationCodes.VALID;
    }
    return OopDateValidationCodes.VALID;
  }

  private validateDateRange( date: SimpleDate ) {

    const diff = this._today.diff( moment( { year: date.year,
                                             month: date.month - 1,
                                             day: date.day } ), 'months', true );

    // console.log( 'past 12 months: ', diff );
    // Date validation should catch future dates
    return (diff > 12) ? OopDateValidationCodes.OUT_OF_RANGE : OopDateValidationCodes.VALID;
  }

}
