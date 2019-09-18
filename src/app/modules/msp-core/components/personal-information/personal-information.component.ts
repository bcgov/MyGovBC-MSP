import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { Base, SimpleDate } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { MspPerson, Gender } from '../../../../components/msp/model/msp-person.model';

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
export class PersonalInformationComponent extends Base {

  @Input() disabled: boolean = false;

  // TODO: Change to PERSON when MspPerson is re-factored to extend Person in common lib
  @Input() person: MspPerson;
  @Output() personChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

  genderLabels = [
     {'label': 'Male', 'value': Gender.Male},
     {'label': 'Female', 'value': Gender.Female}
    ];

  constructor() {
    super();
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

  get dateOfBirth() {
    return this.person.dateOfBirth;
  }

  set dateOfBirth( dob: SimpleDate ) {
    console.log( 'dateOfBirth: ', dob );
    this.person.dateOfBirth = dob;
    this.personChange.emit(this.person);
  }

  get gender() {
    return this.person.gender;
  }

  set gender( val: Gender ) {
    console.log( 'set gender: ', val );
    this.person.gender = val;
    this.personChange.emit(this.person);
  }
}
