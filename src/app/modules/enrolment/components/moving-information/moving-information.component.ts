import { Component, OnInit, forwardRef, EventEmitter, Input, Output } from '@angular/core';
import { Base, PROVINCE_LIST, BRITISH_COLUMBIA, COUNTRY_LIST, SimpleDate } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { MspPerson } from '../../../account/models/account.model';
import { StatusInCanada, CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';
import { environment } from '../../../../../environments/environment';
import { Relationship } from '../../../../models/relationship.enum';
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

  constructor(public cntr: ControlContainer ) {
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

  // Moved from another province
  get isCanadianFromProv() {
    return this.person.status === StatusInCanada.CitizenAdult &&
           this.person.currentActivity === CanadianStatusReason.MovingFromProvince;
  }

  // Moved from another Country
  get isCanadianFromCountry() {
    return this.person.status === StatusInCanada.CitizenAdult &&
           this.person.currentActivity === CanadianStatusReason.MovingFromCountry;
  }

  get isTemporaryResident() {
    return this.person.status === StatusInCanada.TemporaryResident;
  }

  // Not new to BC
  get isCanadianNotBC() {
    return this.person.status === StatusInCanada.CitizenAdult &&
           this.person.currentActivity === CanadianStatusReason.LivingInBCWithoutMSP;
  }

  // Moved from another province
  get isResidentFromProv() {
    return this.person.status === StatusInCanada.PermanentResident &&
           this.person.currentActivity === CanadianStatusReason.MovingFromProvince;
  }

  // Moved from another Country
  get isResidentFromCountry() {
    return this.person.status === StatusInCanada.PermanentResident &&
           this.person.currentActivity === CanadianStatusReason.MovingFromCountry;
  }

  // Not new to BC
  get isResidentNotBC() {
    return this.person.status === StatusInCanada.PermanentResident &&
           this.person.currentActivity === CanadianStatusReason.LivingInBCWithoutMSP;
  }

  get requestPermMoveInfo() {
   return this.isCanadianFromProv || this.isCanadianFromCountry ||
          (this.isCanadianNotBC && this.person.livedInBCSinceBirth === true) || this.isResidentFromProv ||
          this.isResidentFromCountry || this.isResidentNotBC || this.isTemporaryResident;
  }

  get arrivalDateRequired() {
    return this.isCanadianFromCountry || this.isResidentFromProv || this.isResidentFromCountry ||
           this.isResidentNotBC || this.isTemporaryResident;
  }

  get requestAdditionalMoveInfo() {
    return this.isCanadianFromProv || this.isCanadianFromCountry ||
          (this.isCanadianNotBC && this.person.livedInBCSinceBirth !== undefined) ||
          this.isResidentFromProv || this.isResidentFromCountry || this.isResidentNotBC ||
          this.isTemporaryResident;
  }

  get requestArmForceInfo() {
    return this.person.status === StatusInCanada.CitizenAdult ||
          (this.isApplicant && this.person.status === StatusInCanada.PermanentResident);
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
      default:
    }
    return message;
  }

  validateDepartureDate($event) {
    this.person.departureDate = $event;

    this._oopDepartureDateError = this.validateDateRange( this.person.departureDate );
    if ( this._oopDepartureDateError === OopDateValidationCodes.VALID ) {
      this._oopDepartureDateError = this.invalidDepartureDate( this.person.departureDate, this.person.returnDate );
    }
  }

  validateReturnDate($event) {
    this.person.returnDate = $event;

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

        console.log( 'invalid departure must be prior to return day: ', diff );

        return (diff <= 0) ? OopDateValidationCodes.DEPARTURE_INVALID : OopDateValidationCodes.VALID;
    }
    return OopDateValidationCodes.VALID;
  }

  private validateDateRange( date: SimpleDate ) {

    const diff = this._today.diff( moment( { year: date.year,
                                             month: date.month - 1,
                                             day: date.day } ), 'months', true );

    console.log( 'past 12 months: ', diff );
    // Date validation should catch future dates
    return (diff > 12) ? OopDateValidationCodes.OUT_OF_RANGE : OopDateValidationCodes.VALID;
  }

}
