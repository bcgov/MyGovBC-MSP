import { Component, OnInit, forwardRef, EventEmitter, Input, Output } from '@angular/core';
import { Base, PROVINCE_LIST, BRITISH_COLUMBIA, COUNTRY_LIST, ErrorMessage } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { StatusInCanada, CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';
import { environment } from '../../../../../environments/environment';
import { Relationship } from 'app/models/relationship.enum';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { formatDateField } from '../../helpers/date';

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
  }).filter( x => x );

  relationship: string = 'you';
  departureDateErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be before return date.'
  }
  returnDateErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be after departure date.'
  }
  departure12MonthsErrorMessage: ErrorMessage = {
    invalidRange: 'Date must be within the last 12 months.'
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
        return 'the child'
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

}
