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
    invalidRange: 'Date must be at least 30 days before return date.'
  }
  returnDateErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be at least 30 days after departure date.'
  }
  dischargeDateErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be greater than the date of birth.'
  }
  departure12MonthsErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be within the last 12 months, and at least 30 days before the return date.'
  }
  adoptionDateErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be after the birthdate.'
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

  get departureDateDuring6MonthsEndRange() {
    if (this.person.returnDateDuring6MonthsDate
      && this.person.returnDateDuring6MonthsDate instanceof Date
      && isBefore(this.person.returnDateDuring6MonthsDate, addMonths(this.dateToday, 6))) {
      return subDays(this.person.returnDateDuring6MonthsDate, 31);
    } else {
      return addMonths(this.dateToday, 6);
    }
  }

  get returnDateDuring6MonthsStartRange() {
    if (this.person.departureDateDuring6MonthsDate
      && this.person.departureDateDuring6MonthsDate instanceof Date) {
      return addDays(this.person.departureDateDuring6MonthsDate, 31)
    } else {
      return this.dateToday;
    }
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

  setHasBeenReleasedFromArmedForces(event: boolean) {
    this.person.hasBeenReleasedFromArmedForces = event;
    if (this.person.hasBeenReleasedFromArmedForces === false){
      this.person.dischargeDate = null;
      this.person.nameOfInstitute = null;
    }
  }
}
