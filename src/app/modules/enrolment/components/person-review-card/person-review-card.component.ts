import { Component, Input } from '@angular/core';
import { Address, getCountryDescription, getProvinceDescription } from 'moh-common-lib';
import { ColumnClass } from '../../../msp-core/components/review-part/review-part.component';
import { Gender, GenderStrings } from '../../../../models/gender.enum';
import { format } from 'date-fns';
import { StatusInCanada, CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';
import { getStatusStrings, getStatusReasonStrings } from '../../../msp-core/components/canadian-status/canadian-status.component';
import { Relationship } from '../../../../models/relationship.enum';

export interface IPersonReviewCard {
  // Personal Information
  fullname?: string;
  gender?: Gender;
  dateOfBirth?: Date;

  // Canadian status
  status?: StatusInCanada;
  currentActivity?: CanadianStatusReason;
  relationship?: Relationship;

  // Moving Information
  livedInBCSinceBirth?: boolean;
  movedFromProvinceOrCountry?: string;

  // Arrival in dates (BC/Canaada)
  arrivalToBCDate?: Date;
  arrivalToCanadaDate?: Date;

  // Out of Province within last 12 months for more than 30 days
  outsideBCFor30Days?: boolean;
  departureReason?: string;
  departureDestination?: string;
  oopDepartureDate?: Date;
  oopReturnDate?: Date;

  // Health Numbers
  healthNumberFromOtherProvince?: string;
  hasPreviousBCPhn?: boolean;
  previousBCPhn?: string;

  // Armed Forces
  hasBeenReleasedFromArmedForces?: boolean;
  dischargeDate?: Date;

  // School information for full-time students
  fullTimeStudent?: boolean;
  inBCafterStudies?: boolean;

    // For children 19-24, we need the school name and address
  schoolName?: string;
  schoolCompletionDate?: Date;
  schoolAddress?: Address;

  // If school out BC, require departure date
  departureDateForSchool?: Date;

  documentCount?: number;

}

enum YES_NO {
  YES = 'Yes',
  NO = 'No'
}

// Used getters so that in the future if we have to refactor the HMTL is not impacted
@Component({
  selector: 'msp-person-review-card',
  templateUrl: './person-review-card.component.html',
  styleUrls: ['./person-review-card.component.scss']
})
export class PersonReviewCardComponent<T extends IPersonReviewCard> {

  @Input() person: T;
  @Input() editRouterLink: string;
  @Input() title: string;

  // Formatting for column sizes
  columnClass: ColumnClass = {label: 'col-sm-4', value: 'col-sm-8 font-weight-bold'};

  private _dateFormat = 'MMMM d, yyyy';
  private _statusStrings = getStatusStrings();
  private _statusReasonStrings = getStatusReasonStrings();

  constructor() {}

  get movedFromLabel(): string {
     return  'Moved from ' + ( this._isCountryMove() ? 'country' : 'province' );
  }

  get gender() {
    return this.person.gender ? GenderStrings[this.person.gender] : null;
  }

  get dateOfBirth() {
    return this._convertDateToString( this.person.dateOfBirth );
  }

  get hasStatus() {
    return ( this.person.status !== undefined && this.person.status !== null );
  }

  get status() {
    let _canadianStatus = null;

    if (  this.hasStatus ) {
        _canadianStatus = this._statusStrings[this.person.status];

      if ( this.person.currentActivity !== null && this.person.currentActivity !== undefined ) {
        _canadianStatus = _canadianStatus.concat( '>' + this._statusReasonStrings[this.person.currentActivity] );
      }
    }
    return _canadianStatus;
  }

  get hasLivedInBCSinceBirth() {
    return this._isDefined( this.person.livedInBCSinceBirth );
  }

  get livedInBCSinceBirth() {
    return this._convertBooleanToString(  this.person.livedInBCSinceBirth );
  }

  get arrivalToBCDate() {
    return this._convertDateToString( this.person.arrivalToBCDate );
  }

  get arrivalToCanadaDate() {
    return this._convertDateToString( this.person.arrivalToCanadaDate );
  }

  /** Outside BC for 30 days - start */
  get hasBeenOutsideBCFor30Days() {
    return this._isDefined( this.person.outsideBCFor30Days );
  }
  get displayOutsideBCFor30Days() {
    return this.person.outsideBCFor30Days === true;
  }
  get outsideBCFor30Days() {
    return this._convertBooleanToString( this.person.outsideBCFor30Days );
  }
  get oopDepartureDate() {
    return this._convertDateToString( this.person.oopDepartureDate );
  }
  get oopReturnDate() {
    return this._convertDateToString( this.person.oopReturnDate );
  }
  /** Outside BC for 30 days - end */

  /** Released Armed Forces - start */
  get hasBeenReleasedFromArmedForces() {
    return this._isDefined( this.person.hasBeenReleasedFromArmedForces );
  }
  get displayReleasedDate() {
    return this.person.hasBeenReleasedFromArmedForces === true;
  }
  get releasedFromArmedForces() {
    return this._convertBooleanToString( this.person.hasBeenReleasedFromArmedForces );
  }
  get dischargeDate() {
    return this._convertDateToString( this.person.dischargeDate );
  }
  /** Released Armed Forces - end */

  /** Full-time student - start */
  get hasFullTimeStudent() {
    return this._isDefined( this.person.fullTimeStudent );
  }
  get displayFullTimeStudentInfo() {
    return this.person.fullTimeStudent === true;
  }
  get fullTimeStudent() {
    return this._convertBooleanToString( this.person.fullTimeStudent );
  }
  get hasInBCafterStudies() {
    return this._isDefined( this.person.inBCafterStudies );
  }
  get inBCafterStudies() {
    return this._convertBooleanToString( this.person.inBCafterStudies );
  }
  get displaySchoolInfo() {
    return this.person.relationship === Relationship.Child19To24;
  }
  get schoolCompletionDate() {
    return this._convertDateToString( this.person.schoolCompletionDate );
  }
  get departureDateForSchool() {
    return this._convertDateToString( this.person.departureDateForSchool );
  }
  /** Full-time student - end */

  get documentCount() {
    const str = this.person.documentCount +  ' file';
    return str +  (this.person.documentCount !== 1 ? 's' : '');
  }

  get movedFromProvinceOrCountry() {
    return this._isCountryMove() ?
      getCountryDescription( this.person.movedFromProvinceOrCountry ) :
      getProvinceDescription( this.person.movedFromProvinceOrCountry  );
  }

  private _isDefined( value: any ) {
    return ( value !== null && value !== undefined );
  }

  private _convertBooleanToString( val: boolean ) {
    if ( this._isDefined( val ) ) {
      return val ? YES_NO.YES : YES_NO.NO;
    }
    return null;
  }

  private _convertDateToString( dt: Date ) {
    if ( dt ) {
      return format( dt, this._dateFormat );
    }
    return null;
  }

  private _isCountryMove() {
    return ( this.person.status === StatusInCanada.TemporaryResident ||
             this.person.currentActivity === CanadianStatusReason.MovingFromCountry );
  }
}
