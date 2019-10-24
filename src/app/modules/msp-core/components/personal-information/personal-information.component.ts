import { Component, forwardRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
  gender: Gender;
  relationship: Relationship;
  phn?: string;
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
export class PersonalInformationComponent<T extends IPersonalInformation> extends Base implements OnInit {

  @Input() disabled: boolean = false;

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

  constructor() {
    super();
  }

  ngOnInit() {
    const today = startOfToday();

    // Set up parmeters for dob ranges
    if ( this.person.relationship === Relationship.Applicant ) {
      this.dobErrorMsg = { invalidRange: 'An applicant must be 16 years or older.' };
      this.dobEndRange = subYears( today, 16 );
    } else if ( this.person.relationship === Relationship.Child19To24 ) {
      this.dobErrorMsg = { invalidRange: 'A post-secondary student must be between 19 and 24 years.' };
      this.dobStartRange = subYears( today, 24 );
      this.dobEndRange = subYears( today, 19 );
    } else if ( this.person.relationship === Relationship.ChildUnder19 ) {
      this.dobErrorMsg = { invalidRange: 'A post-secondary student must be between 19 and 24 years.' };
      this.dobEndRange = subYears( today, 19 );
    } else {
      this.dobEndRange = today;
    }
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

  get gender() {
    return this.person.gender;
  }

  set gender( val: Gender ) {
    this.person.gender = val;
    this.personChange.emit(this.person);
  }
}
