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

  // === DATE COMPARISON GETTERS ===
  get dob() {
    return this.person.dob;
  }

  get adoptedDate() {
    return this.person.adoptedDate;
  }

  get arrivalToBCDate() {
    return this.person.arrivalToBCDate;
  }

  get departureDateDuring12MonthsDate() {
    return this.person.departureDateDuring12MonthsDate;
  }

  get returnDateDuring12MonthsDate() {
    return this.person.returnDateDuring12MonthsDate;
  }

  get departureDateDuring6MonthsDate() {
    return this.person.departureDateDuring6MonthsDate;
  }

  get returnDateDuring6MonthsDate() {
    return this.person.returnDateDuring6MonthsDate;
  }

  get studiesDepartureDate() {
    return this.person.studiesDepartureDate;
  }

  get studiesBeginDate() {
    return this.person.studiesBeginDate;
  }

  get studiesFinishedDate() {
    return this.person.studiesFinishedDate;
  }

  get dischargeDate() {
    return this.person.dischargeDate;
  }

  // === DATE RANGE GETTERS ===
  get arrivalToBCStartRange() {
    return this.dob;
  }

  get arrivalToBCEndRange() {
    if (this.departureDateDuring12MonthsDate) {
      return isBefore(this.departureDateDuring12MonthsDate, this.arrivalToBCDate) ? this.departureDateDuring12MonthsDate : this.dateToday;
    }
    return this.dateToday;
  }

  get departureDateDuring12MonthsStartRange() {
    if (this.arrivalToBCDate && this.dob) {
      return isBefore(this.arrivalToBCDate, this.dob) ? this.dob : this.arrivalToBCDate;
    } else if (this.arrivalToBCDate) {
      return this.arrivalToBCDate;
    }
    return this.dob;
  }
   
  get departureDateDuring12MonthsEndRange() {
    return subDays(this.dateToday, 30);
  }
  
  get returnDateDuring12MonthsStartRange() {
    if (this.departureDateDuring12MonthsDate) {
      return isBefore(this.dateToday, this.returnDateDuring12MonthsDate) ? this.dateToday : addDays(this.departureDateDuring12MonthsDate, 30);
    }
    return this.dateToday;
  }
  
  get departureDateDuring6MonthsStartRange() {
    return this.dateToday;
  }

  get departureDateDuring6MonthsEndRange() {
    if (this.returnDateDuring6MonthsDate) {
      return isBefore(subDays(this.returnDateDuring6MonthsDate, 30), this.dateToday) ? this.dateToday : subDays(this.returnDateDuring6MonthsDate, 30);
    }
    return subDays(addMonths(this.dateToday, 6), 30);
  }

  get returnDateDuring6MonthsStartRange() {
    if (this.departureDateDuring6MonthsDate) {
      return isBefore(addDays(this.dateToday, 30), addDays(this.departureDateDuring6MonthsDate, 30)) ? addDays(this.dateToday, 30) : addDays(this.departureDateDuring6MonthsDate, 30);
    }
    return addDays(this.dateToday, 30);
  }

  get studiesDepartureDateStartRange() {
    if (this.arrivalToBCDate) {
      return this.arrivalToBCDate;
    }
    return this.dob;
  }

  get studiesDepartureDateEndRange() {
    if (this.studiesBeginDate) {
      return this.studiesBeginDate < subDays(this.dateToday, 1) ? this.studiesBeginDate : subDays(this.dateToday, 1);
    }
    return subDays(this.dateToday, 1);
  }

  get studiesBeginDateStartRange() {
    if (this.studiesDepartureDate && isBefore(this.dob, this.studiesDepartureDate)) {
      return this.studiesDepartureDate;
    } 
    return this.dob;
  }

  get studiesBeginDateEndRange() {
    return this.studiesFinishedDate ? this.studiesFinishedDate : null;
  }

  get studiesFinishedDateStartRange() {
    return this.studiesBeginDate > this.dateToday ? this.studiesBeginDate : this.dateToday;
  }

  get studiesFinishedDateEndRange() {
    return null;
  }

  get dischargeDateStartRange() {
    return this.dob;
  }
  
  get dischargeDateEndRange() {
    return null;
  }

  // === DATE ERROR GETTERS ===
  get adoptionDateErrorMessage(): ErrorMessage {
    if (this.adoptedDate > this.dateToday) {
      return { invalidRange: 'Date cannot be in the future.' }
    } else if (this.adoptedDate < this.dob) {
      return { invalidRange: 'Date must be after birthdate.' }
    } else {
      return { invalidRange: 'Invalid date range.' }
    }
  }

  get mostRecentMoveToBCErrorMessage() {
    // If the departure date is before the arrival
    if (this.departureDateDuring12MonthsDate < this.arrivalToBCDate) {
      return { invalidRange: 'Date must be before any date of departure from BC.' }
      // If the arrival is after today's date
    } else if (this.arrivalToBCDate > this.dateToday) {
      return { invalidRange: 'Date cannot be in the future.' }
      // If the arrival is before birthdate
    } else if (this.arrivalToBCDate < this.dob) {
      return { invalidRange: 'Date must be after birthdate.' }
      // Catch all
    } else {
      return { invalidRange: 'Invalid date range.' }
    }
  }

  get departureDate12MonthsErrorMessage(): ErrorMessage {
    // If the departure date is before the arrival
    if (this.departureDateDuring12MonthsDate < this.arrivalToBCDate) {
      return { invalidRange: 'Date must be after arrival in BC.' }
      // If the departure is after today's date
    } else if (this.departureDateDuring12MonthsDate > this.dateToday) {
      return { invalidRange: 'Date cannot be in the future.' }
      // If the arrival is before birthdate
    } else if (this.departureDateDuring12MonthsDate < this.dob) {
      return { invalidRange: 'Date must be after birthdate.' }
      // Catch all
    } else {
      return { invalidRange: 'Invalid date range.' }
    }
  }

  get returnDate12MonthsErrorMessage(): ErrorMessage {
    // If they return in the future
    if (isBefore(this.dateToday, this.returnDateDuring12MonthsDate)) {
      return { invalidRange: 'Date cannot be in the future.' }
      // If they return before they leave
    } else if (this.returnDateDuring12MonthsDate < addDays(this.departureDateDuring12MonthsDate, 30)) {
      return { invalidRange: 'Date must be more than 30 days after departure.' }
      // If they are returning before birthdate
    } else if (this.returnDateDuring12MonthsDate < this.dob) {
      return { invalidRange: 'Date must be after birthdate.' }
      // Catchall
    } else {
      return { invalidRange: 'Invalid date range.'}
    }
  }

  get departureDate6MonthsErrorMessage(): ErrorMessage  {
    // If the departure date is less than 30 days before the return date
    if (this.returnDateDuring6MonthsDate < addDays(this.departureDateDuring6MonthsDate, 30)) {
      return { invalidRange: 'Date must be more than 30 days before return date.' }
      // If the departure is after today's date
    } else if (this.departureDateDuring6MonthsDate < this.dateToday) {
      return { invalidRange: 'Date cannot be in the past.' }
      // If the departure is after six months from now
    } else if (isBefore(addMonths(this.dateToday, 6), this.departureDateDuring6MonthsDate)) {
      return { invalidRange: 'Date must be within the next six months.' }    
      // If they are departing before birthdate
    } else if (this.departureDateDuring6MonthsDate < this.dob) {
      return { invalidRange: 'Date must be after birthdate.' }
      // Catchall
    } else {
      return { invalidRange: 'Invalid date range.' }
    }
  }
  
  get returnDate6MonthsErrorMessage(): ErrorMessage {
    // If they return within 30 days of their arrival
    if (this.returnDateDuring6MonthsDate < addDays(this.departureDateDuring6MonthsDate, 30)) {
      return { invalidRange: 'Date must be more than 30 days after departure.' }
      // If they are returning in the past
    } else if (this.returnDateDuring6MonthsDate < this.dateToday) {
      return { invalidRange: 'Date cannot be in the past.' }
      // Catchall
    } else {
      return { invalidRange: 'Invalid date range.'}
    }
  }

  get studiesDepartureDateErrorMessage(): ErrorMessage {
    // If they leave to school before they arrived in BC
    if (this.studiesDepartureDate < this.arrivalToBCDate) {
      return { invalidRange: 'Date must be after arrival in BC.' }
      // If they leave to school in the future
    } else if (this.studiesDepartureDate > this.dateToday) {
      return { invalidRange: 'Date cannot be in the future.' }
      // If they leave to school before they were born
    } else if (this.studiesDepartureDate < this.dob) {
      return { invalidRange: 'Date must be after birthdate.' }
      // If studies begin before they depart
    } else if (this.studiesBeginDate < this.studiesDepartureDate) {
      return { invalidRange: 'Date must be prior to school beginning.' }
      // Catchall
    } else {
      return { invalidRange: 'Invalid date range.' }
    }
  }
  
  get studiesBeginDateErrorMessage(): ErrorMessage {
    // If studies begin before they depart
    if (this.studiesBeginDate < this.studiesDepartureDate) {
      return { invalidRange: 'Date must be after departure to school.' }
      // If studies begin after they finish
    } else if (this.studiesBeginDate > this.studiesFinishedDate) {
      return { invalidRange: 'Date must be prior to finish date.' }
      // If studies begin before birthdate
    } else if (this.studiesBeginDate < this.dob) {
      return { invalidRange: 'Date must be after birthdate.' }
      // Catchall
    } else {
      return { invalidRange: 'Invalid date range.' }
    }
  // invalidRange: 'Studies must begin after departure date, after birthdate, and before date of completion.'
  }

  get studiesFinishedDateErrorMessage(): ErrorMessage {
    // If the finish date is before the start date
    if (this.studiesFinishedDate < this.studiesBeginDate) {
      return { invalidRange: 'Date must be after date studies begin.' }
      // If the finish date is before today
    } else if (this.studiesFinishedDate < this.dateToday) {
      return { invalidRange: 'Date cannot be in the past.' }
      // If the arrival is before birthdate
    } else if (this.studiesFinishedDate < this.dob) {
      return { invalidRange: 'Date must be after birthdate.' }
      // Catchall
    } else {
      return { invalidRange: 'Invalid date range.' }
    }
  }

  get dischargeDateErrorMessage(): ErrorMessage {
    if (this.dischargeDate < this.dob) {
      return { invalidRange: 'Date must be after birthdate.' };
    } else {
      return { invalidRange: 'Invalid date range.' };
    }
  }
}
