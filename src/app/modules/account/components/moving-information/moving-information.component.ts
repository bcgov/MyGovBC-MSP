import { Component, OnInit, forwardRef, EventEmitter, Input, Output } from '@angular/core';
import { Base, PROVINCE_LIST, BRITISH_COLUMBIA, COUNTRY_LIST, ErrorMessage } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { StatusInCanada, CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';
import { environment } from '../../../../../environments/environment';
import { Relationship } from 'app/models/relationship.enum';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { formatDateField } from '../../helpers/date';
import { isBefore, subDays, addDays, addMonths } from 'date-fns';

// TO BE removed - differenece need to be added to msp-core moving-info so that it will work with account
@Component({
  selector: 'msp-child-moving-information',
  templateUrl: './moving-information.component.html',
  styleUrls: ['./moving-information.component.scss'],

  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: forwardRef(() => NgForm)
    }
  ]
})

export class ChildMovingInformationComponent extends Base implements OnInit {
  @Input() person: MspPerson;
  @Output() personChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

  // Web links
  links = environment.links;
  countryList = COUNTRY_LIST;
  // Remove BC from province list
  provinceList = PROVINCE_LIST.map(x => {
    if (x.provinceCode !== BRITISH_COLUMBIA) {
      return x;
    }
  }).filter(x => x);
  readonly Child19To24: Relationship = Relationship.Child19To24;

  relationship: string = 'you';
  departureDateErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be more than 30 days before return date and within the next six months.'
  }
  returnDateErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be more than 30 days after departure date.'
  }
  dischargeDateErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be greater than the date of birth.'
  }
  departure12MonthsErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be within the last 12 months, and more than 30 days before the return date.'
  }
  adoptionDateErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be after the birthdate.'
  }
  studiesBeginDateErrorMessage: ErrorMessage = {
    invalidRange: 'Studies must begin after departure date and before date of completion.'
  }
  studiesFinishedDateErrorMessage: ErrorMessage = {
    invalidRange: "Studies must end after departure date and today's date."
  }
  dateToday: Date = new Date();

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.isSpouse) {
      this.relationship = 'spouse';
    } else if (this.isChild) {
      this.relationship = 'child';
    }
  }

  get isApplicant() {
    return this.person.relationship === Relationship.Applicant;
  }

  get isSpouse() {
    return this.person.relationship === Relationship.Spouse;
  }

  get isChild() {
    return this.person.relationship === Relationship.ChildUnder19 ||
           this.person.relationship === Relationship.Child19To24;
  }

  get isOveragedChild() {
    return this.person.relationship === Relationship.Child19To24;
  }

  // Has a reason been selected
  get isStatus() {
    return this.person.currentActivity;
  }

  // Has lived in B.C. since birth
  get isLivedInBCSinceBirth() {
    return this.person.currentActivity !== undefined && this.person.currentActivity !== 0;
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

  // Not new to BC
  get isCanadianNotBC() {
    return this.person.status === StatusInCanada.CitizenAdult;
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

  get isTemporaryResident() {
    return this.person.status === StatusInCanada.TemporaryResident;
  }

  get requestSchoolInfo() {
    return this.isCanadianFromCountry || this.isCanadianFromProv || this.isCanadianNotBC ||
           this.isResidentFromCountry || this.isResidentFromProv || this.isResidentNotBC;
  }

  get requestPermMoveInfo() {
    return this.isCanadianFromProv || this.isCanadianFromCountry ||
          (this.isCanadianNotBC && this.person.livedInBCSinceBirth) || this.isResidentFromProv ||
           this.isResidentFromCountry || this.isResidentNotBC;
  }

  get arrivalDateRequired() {
    return this.isCanadianFromCountry || this.isResidentFromProv || this.isResidentFromCountry ||
           this.isResidentNotBC;
  }

  get requestAdditionalMoveInfo() {
    return this.isCanadianFromProv || this.isCanadianFromCountry ||
          (this.isCanadianNotBC && this.person.livedInBCSinceBirth !== undefined) ||
          this.isResidentFromProv || this.isResidentFromCountry || this.isResidentNotBC;
  }

  get possessiveRelationshipNoun() {
    switch (this.person.relationship) {
      case Relationship.Applicant:
        return 'you';
      case Relationship.Spouse:
        return 'your spouse';
      default:
        return 'this child'
    }
  }

  get startDischargeDate() {
    if (this.person.dateOfBirth){
      const startDate = this.person.dateOfBirth;
      startDate.setDate(this.person.dateOfBirth.getDate() + 1);
      return startDate;
    }
    else {
      return null;
    }
  }

  get date12MonthsAgo(): Date {
    const date: Date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date;
  }

  get date6MonthsFromNow(): Date {
    const date: Date = new Date();
    return addMonths(date, 6);
  }

  get mostRecentMoveToBCErrorMessage() {
    if (this.person.dateOfBirth) {
      return {
        invalidRange: `Date must be between ${formatDateField(this.person.dateOfBirth)} and ${formatDateField(this.dateToday)}.`
      }
    } else {
      return {
        invalidRange: `Date must be before ${formatDateField(this.dateToday)}.`
      }
    }
  }

  get arrivalDateInCanadaErrorMessage() {
    if (this.person.dateOfBirth && this.person.arrivalToBCDate) {
      return {
        invalidRange: `Date must be between ${formatDateField(this.person.dateOfBirth)} and ${formatDateField(this.person.arrivalToBCDate)}.`
      }
    } else {
      return {
        invalidRange: `Date must be before ${formatDateField(this.dateToday)}.`
      }
    }
  }

  get departureDateDuring12MonthsEndRange() {
    if (this.person.returnDateDuring12MonthsDate
      && this.person.returnDateDuring12MonthsDate instanceof Date
      && isBefore(this.person.returnDateDuring12MonthsDate, this.dateToday)) {
      return subDays(this.person.returnDateDuring12MonthsDate, 31);
    } else {
      return this.dateToday;
    }
  }

  get returnDateDuring12MonthsStartRange() {
    if (this.person.departureDateDuring12MonthsDate
      && this.person.departureDateDuring12MonthsDate instanceof Date) {
      return addDays(this.person.departureDateDuring12MonthsDate, 31)
    } else {
      return null;
    }
  }

  // Leaving today earliest
  get departureDateDuring6MonthsStartRange() {
    return this.dateToday;
  }

  // Latest they can leave is 31 days before six months from now
  get departureDateDuring6MonthsEndRange() {
    return subDays(addMonths(this.dateToday, 6), 31);
  }

  // Earliest they can get back is 31 days after the departure date
  get returnDateDuring6MonthsStartRange() {
    if (this.person.departureDateDuring6MonthsDate
      && this.person.departureDateDuring6MonthsDate instanceof Date) {
      return addDays(this.person.departureDateDuring6MonthsDate, 31)
    } else {
      return addDays(this.dateToday, 31);
    }
  }

  // Can't start before you've left
  get studiesBeginDateStartRange() {
    return !!this.person.studiesDepartureDate && addDays(this.person.studiesDepartureDate, 1);
  }

  // Can't begin after you finish
  get studiesBeginDateEndRange() {
    return !!this.person.studiesFinishedDate ? subDays(this.person.studiesFinishedDate, 1) : null;
  }

  // Can't finish before you begin or today
  get studiesFinishedDateStartRange() {
    return !!this.person.studiesBeginDate && isBefore(this.dateToday, this.person.studiesBeginDate) ? addDays(this.person.studiesBeginDate, 1) : addDays(this.dateToday, 1);
  }

  // Placeholder incase we need more validation for the end date
  get studiesFinishedDateEndRange() {
    return null;
  }

  get showlivedInBC() {
    return (
      this.person.status === StatusInCanada.CitizenAdult
    );
  }

  get showRecentMove() {
    return (this.person.currentActivity !== undefined
            && this.person.livedInBCSinceBirth === false)
            || (this.person.livedInBCSinceBirth === false
            && this.isChild);
  }

  get showFromProv() {
    return ((
      this.person.status === StatusInCanada.CitizenAdult &&
      (this.person.currentActivity === CanadianStatusReason.MovingFromProvince ||
      this.person.currentActivity === CanadianStatusReason.LivingInBCWithoutMSP)) ||
      (this.person.status === StatusInCanada.PermanentResident &&
      this.person.currentActivity === CanadianStatusReason.MovingFromProvince
    )) && !this.isChild;
  }

  get showFromCountry() {
    return ((
      this.person.status === StatusInCanada.CitizenAdult &&
      this.person.currentActivity === CanadianStatusReason.MovingFromCountry) ||
      (this.person.status === StatusInCanada.PermanentResident &&
      this.person.currentActivity === CanadianStatusReason.MovingFromCountry) ||
      this.person.status === StatusInCanada.TemporaryResident
    ) && !this.isChild;
  }

  get showHealthNumber() {
    return (
      (this.person.status === StatusInCanada.CitizenAdult &&
      (this.person.currentActivity === CanadianStatusReason.MovingFromProvince ||
      this.person.currentActivity === CanadianStatusReason.LivingInBCWithoutMSP)) ||
      (this.person.status === StatusInCanada.PermanentResident &&
      this.person.currentActivity === CanadianStatusReason.MovingFromProvince) ||
      this.isChild
    );
  }

  get hasBeenReleasedFromArmedForces() {
    return this.person.hasBeenReleasedFromArmedForces;
  }

  set hasBeenReleasedFromArmedForces(val: boolean) {
    this.person.hasBeenReleasedFromArmedForces = val;
    this.personChange.emit(this.person);
  }

  setDeclarationForOutsideOver60Days(event: boolean) {
    this.person.declarationForOutsideOver60Days = event;
    if (this.person.declarationForOutsideOver60Days === false){
      this.person.departureReason = null;
      this.person.departureDestination = null;
    }
  }
}
