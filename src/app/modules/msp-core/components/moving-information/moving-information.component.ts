import { Component, OnInit, forwardRef, EventEmitter, Input, Output } from '@angular/core';
import { Base, PROVINCE_LIST, BRITISH_COLUMBIA, COUNTRY_LIST, ErrorMessage, LabelReplacementTag } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { startOfToday, subMonths, isAfter, subDays } from 'date-fns';
import { isBefore } from 'date-fns/esm';


export interface IMovingInfo {

  dateOfBirth: Date; // Used to set date ranges

  isApplicant: boolean;
  isSpouse: boolean;
  isCanadianResident: boolean;
  isPermanentResident: boolean;
  isTemporaryResident: boolean;
  isLivingWithoutMSP: boolean;

  isProvinceMove: boolean;
  isCountryMove: boolean;
  livedInBCSinceBirth: boolean;
  madePermanentMoveToBC: boolean;

  arrivalToBCDate: Date;
  arrivalToCanadaDate: Date;
  movedFromProvinceOrCountry: string;
  healthNumberFromOtherProvince: string;
  hasPreviousBCPhn: boolean;
  previousBCPhn: string;

  outsideBCFor30Days: boolean;
  departureReason: string;
  departureDestination: string;
  oopDepartureDate: Date;
  oopReturnDate: Date;

  hasBeenReleasedFromArmedForces: boolean;
  dischargeDate: Date;
}

// TODO: Setup as generic so that account application can use it, add variables as optional
// do questions are display when variables are present
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
export class MovingInformationComponent<T extends IMovingInfo> extends Base implements OnInit {

  @Input() person: T;
  @Output() personChange: EventEmitter<T> = new EventEmitter<T>();

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
  relationType: string = 'applicant\'s';

  departureDateLabel = 'Departure date';
  returnDateLabel = 'Return date';
  yesterday = subDays( startOfToday() , 1);
  twelveMonthsAgo: Date = subMonths( this.yesterday, 12 );

  oopDepartureErrorMsg: ErrorMessage = {
    invalidRange: LabelReplacementTag + ' must be within the last 12 months and prior to return date.'
  };

  oopReturnErrorMsg: ErrorMessage = {
    invalidRange: LabelReplacementTag + ' must be within the last 12 months and after departure date.'
  };

  private _relationshipLabel = '{RelationshipLabel}';
  recentMoveBCErrorMsg: ErrorMessage = {
    invalidRange: 'The ' + this._relationshipLabel + ' most recent move to BC cannot be before the ' +
      this._relationshipLabel + ' date of birth.',
    noFutureDatesAllowed: 'Most recent move to BC date cannot be in the future.'
  };
  recentMoveCanadaErrorMsg: ErrorMessage = {
    invalidRange: 'The ' + this._relationshipLabel + ' most recent move to Canada cannot be before the ' +
      this._relationshipLabel + ' date of birth and cannot be after the move to B.C. date.',
    noFutureDatesAllowed: 'Most recent move to Canada date cannot be in the future.'
  };

  dischargeDateErrorMsg: ErrorMessage = {
    invalidRange:  LabelReplacementTag + ' cannot be before the ' + this._relationshipLabel + ' date of birth.',
    noFutureDatesAllowed: LabelReplacementTag + ' cannot be in the future.'
  };

  constructor() {
    super();
  }

  ngOnInit() {

    if ( !this.isApplicant ) {

      if ( this.person.isSpouse ) {
        this.relationship = 'your spouse';
        this.relationType = 'spouse\'s';
      } else {
        this.relationship = 'the child';
        this.relationType = 'child\'s';
      }
    }
    const regExp = new RegExp( this._relationshipLabel, 'g' );

    // Update messages to display correct relationship (appliant, spouse, child )
    this.recentMoveBCErrorMsg.invalidRange = this.recentMoveBCErrorMsg.invalidRange.replace( regExp, this.relationType );
    this.recentMoveCanadaErrorMsg.invalidRange = this.recentMoveCanadaErrorMsg.invalidRange.replace( regExp, this.relationType );
    this.dischargeDateErrorMsg.invalidRange = this.dischargeDateErrorMsg.invalidRange.replace( regExp, this.relationType );
  }

  // Used in HTML - wrapper so when changes happen there is no impact to Automated tests for TEST Team
  get isApplicant() {
    return this.person.isApplicant;
  }

  // Used in HTML - wrapper so when changes happen there is no impact to Automated tests for TEST Team
  get isLivingWithoutMSP() {
    return this.person.isLivingWithoutMSP;
  }

  // Used in HTML - wrapper so when changes happen there is no impact to Automated tests for TEST Team
  get isTemporaryResident() {
    return this.person.isTemporaryResident;
  }

  get requestLivedInBC() {
    return this.person.isCanadianResident && this.isLivingWithoutMSP;
  }

  get requestPermMoveInfo() {
    //console.log( 'requestPermMoveInfo: ', this.person.livedInBCSinceBirth, this.requestLivedInBC );
    if ( this.requestLivedInBC ) {
      // Convert to boolean
      return this.person.livedInBCSinceBirth !== undefined && this.person.livedInBCSinceBirth !== null;
    }
    return this.person.isCanadianResident || this.person.isPermanentResident || this.isTemporaryResident;
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
    return (this.person.isCanadianResident && (this.person.isProvinceMove ||
           (this.isLivingWithoutMSP && this.person.livedInBCSinceBirth === false))) ||
           (this.person.isPermanentResident && this.person.isProvinceMove);
  }

  get requestCountryMoveInfo() {
    return (this.person.isCanadianResident || this.person.isPermanentResident) &&
            this.person.isCountryMove;
  }

  get requestArrivalInBCInfo() {
    return ((this.person.isCanadianResident || this.person.isPermanentResident) &&
           (this.person.isProvinceMove || this.person.isCountryMove)) || this.isTemporaryResident;
  }

  get arrivalDateRequired() {
    return (this.person.isCountryMove &&
           (this.person.isCanadianResident || this.person.isPermanentResident)) ||
           this.isTemporaryResident;
  }

  get requestProvHealthNumber() {
    return this.person.isProvinceMove &&
           (this.person.isCanadianResident || this.person.isPermanentResident);
  }

  get requestArmForceInfo() {
    return this.person.isCanadianResident ||
          (this.isApplicant && this.person.isPermanentResident);
  }

  get requestRecentMoveToBC() {
    //console.log( 'requestRecentMoveToBC ', this.requestLivedInBC, this.person.livedInBCSinceBirth );
    if ( this.requestLivedInBC ) {
      return this.person.livedInBCSinceBirth === false;
    }
    return true;
  }

  get requestArrivalToCanada() {
    if ( this.requestLivedInBC ) {
      return this.person.livedInBCSinceBirth === false;
    }
    return true;
  }

  get oopDepartureEndRange() {

    // Return date has been entered
    if ( this.person.oopReturnDate ) {
      if ( isAfter( this.person.oopReturnDate, this.twelveMonthsAgo ) &&
           isBefore( this.person.oopReturnDate, this.yesterday ) ) {
        return this.person.oopReturnDate;
      }
    }
    return this.yesterday;
  }

  get oopReturnStartRange() {

    // Departure Date date has been entered
    if ( this.person.oopDepartureDate ) {
      if ( isAfter( this.person.oopDepartureDate, this.twelveMonthsAgo ) &&
            isBefore( this.person.oopDepartureDate, this.yesterday ) ) {
        return this.person.oopDepartureDate;
      }
    }
    return this.twelveMonthsAgo;
  }

  get startDateRange() {
    return this.person.dateOfBirth ? this.person.dateOfBirth : null;
  }

  get moveCanEndDateRange() {
    return this.person.arrivalToBCDate ? this.person.arrivalToBCDate : this.yesterday;
  }

  get permanentMoveLabel() {
    const msg = this.relationship + ' moved to B.C. permanently?';
    return (this.isApplicant ? 'Have ' : 'Has ') + msg;
  }

  get permanentMoveTip() {
    return 'A permanent move means that you ' +
           'intend to make B.C. your primary residence for 6 months or longer.';
  }

  get armedForceLabel() {
    const msg = this.relationship  + ' been released from the Canadian Armed Forces or an institution?';
    return (this.isApplicant ? 'Have ' : 'Has  ') + msg;
  }

  get previousHealthNumberLabel() {
    const msg = this.relationship + ' have a previous B.C. Personal Health Number?';
    return (this.isApplicant ? 'Do ' : 'Does  ') + msg;
  }

  get previousPHNLabel() {
    const msg = ' previous B.C. Personal Health Number (optional)';
    if ( this.person.isSpouse ) {
      return 'Your ' + this.relationType + msg;
    } else if ( !this.person.isApplicant ) { // children
      return 'The ' + this.relationType + msg;
    }
    return 'Your' + msg;
  }

  get absentLast12MonthsLabel() {
    const msg = ' been outside B.C. for more than 30 days in total in the past 12 months?';
    return (this.isApplicant ? 'Have ' : 'Has ') + this.relationship + msg;
  }

  get absentLast12MonthsInstruct() {
    let msg = 'If ';

    msg = msg.concat( this.relationship,
                      (this.isApplicant ? 'have ' : 'has '),
                      'been living in B.C. for less than 12 months, please indicate any absences since arrival.');
    return msg;
  }

  get countryMoveLabel() {
    let msg = 'Which country ';
    msg = msg.concat( (this.isApplicant ? 'are ' : 'is '), this.relationship, 'moving from ?' );
    return msg;
  }

  get livedInBCSinceBirthLabel() {
    const msg = 'lived in B.C. since birth?';
    return (this.isApplicant ? 'Have ' : 'Has ') + this.relationship + msg;
  }
}
