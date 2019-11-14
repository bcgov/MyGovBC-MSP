import { Component, forwardRef, Input, Output, EventEmitter, OnInit, DoCheck } from '@angular/core';
import { Base, ErrorMessage } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { Gender } from '../../../../models/gender.enum';
import { Relationship } from '../../../../models/relationship.enum';
import { subYears, startOfToday } from 'date-fns';

export interface IPersonalInformation {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  relationship: Relationship;

  // Read only values (properties) must be set if you want the field to display with no values.
  readonly genderRequired?: boolean;
  gender?: Gender;
  readonly phnRequired?: boolean;
  phn?: string;
  readonly sinRequired?: boolean;
  sin?: string;
}

@Component({
  selector: 'msp-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],

  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})
export class PersonalInformationComponent<T extends IPersonalInformation> extends Base
  implements OnInit , DoCheck {

  @Input() disabled: boolean = false;

  // Duplicate checking
  @Input() phnList: string[] = [];
  @Input() sinList: string[] = [];

  @Input() person: T;
  @Output() personChange: EventEmitter<T> = new EventEmitter<T>();

  dobError: boolean = false;

  genderLabels = [
     {'label': 'Male', 'value': Gender.Male},
     {'label': 'Female', 'value': Gender.Female}
    ];

  dobErrorMsg: ErrorMessage = null;
  dobStartRange: Date = null;
  dobEndRange: Date = null;

  sinErrorMsg: ErrorMessage = {
    duplicate: 'This Social Insurance Number (SIN) was already used for another family member. Please provide the SIN that is listed on the family member\'s SIN card/letter.'
  };

  phnErrorMsg: ErrorMessage = {
    duplicate: 'This Personal Health Number (PHN) was already used for another family member. Please provide the PHN that is listed on the family member\'s PHN card/letter.'
  };

  private _today = startOfToday();

  constructor() {
    super();
  }

  ngOnInit() {
    this._setErrorData();
  }

  // This sets error data upon changing person properities - ngOnChanges will not detect changed items
  // within an object (ie. nested)
  ngDoCheck() {
    this._setErrorData();
  }

  get firstName() {
    return this.person.firstName;
  }

  set firstName( name: string ) {
    this.person.firstName = name;
    this.personChange.emit(this.person);
  }

  get middleName() {
    return this.person.middleName;
  }

  set middleName( name: string ) {
    this.person.middleName = name;
    this.personChange.emit(this.person);
  }

  get lastName() {
    return this.person.lastName;
  }

  set lastName( name: string ) {
    this.person.lastName = name;
    this.personChange.emit(this.person);
  }

  get requiresPhn() {
    return this.person.phnRequired;
  }

  get phn() {
    return this.person.phn;
  }

  set phn(phn: string) {
    this.person.phn = phn;
    this.personChange.emit(this.person);
  }

  get dateOfBirth() {
    return this.person.dateOfBirth;
  }

  set dateOfBirth( dob: Date ) {
    this.person.dateOfBirth = dob;
    this.personChange.emit(this.person);
  }

  get requiresGender() {
    return this.person.genderRequired;
  }

  get gender() {
    return this.person.gender;
  }

  set gender( val: Gender ) {
    this.person.gender = val;
    this.personChange.emit(this.person);
  }

  get requiresSin() {
    return this.person.sinRequired;
  }
  get sin() {
    return this.person.sin;
  }

  set sin( val: string ) {
    this.person.sin = val;
    this.personChange.emit(this.person);
  }

  private _setErrorData() {

    // Set up parmeters for dob ranges
    if ( this.person.relationship === Relationship.Applicant ) {
      this.dobErrorMsg = { invalidRange: 'An applicant must be 16 years or older.' };
      this.dobEndRange = subYears( this._today, 16 );
    } else if ( this.person.relationship === Relationship.Child19To24 ) {
      this.dobErrorMsg = { invalidRange: 'A post-secondary student must be between 19 and 24 years.' };
      this.dobStartRange = subYears( this._today, 24 );
      this.dobEndRange = subYears( this._today, 19 );
    } else if ( this.person.relationship === Relationship.ChildUnder19 ) {
      this.dobErrorMsg = { invalidRange: 'A child must be less than 19 years old.' };
      this.dobStartRange = subYears( this._today, 19 );
    } else {
      this.dobEndRange = this._today;
    }
  }
}
