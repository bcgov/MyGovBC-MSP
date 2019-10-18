import BaseApplicationDto, { BaseApplication } from '../../../models/base-application';
import EnrolleeDto, { Enrollee } from './enrollee';
import { Relationship } from '../../../models/relationship.enum';

export class EnrolApplication extends BaseApplication {

  applicant: Enrollee = new Enrollee( Relationship.Applicant );

  // Applicant may have spouse and/or children
  private _spouse: Enrollee;
  private _children: Array<Enrollee> = [];


  // Determine whether individual can apply for MSP
  liveInBC: boolean; // Currently live in BC
  plannedAbsence: boolean; // Planned absence from BC
  unUsualCircumstance: boolean;




  get spouse() {
    return this._spouse;
  }

  addSpouse() {
    if ( !this._spouse ) {
      this._spouse = new Enrollee( Relationship.Spouse );
    }
  }

  removeSpouse(): void {
    this._spouse = null;
  }

  addChild( relationship: Relationship ): Enrollee {

    const c = new Enrollee( relationship );
    if ( relationship === Relationship.Child19To24 ) {
      // child between 19-24 must be a full time student to qualify for enrollment
      c.fullTimeStudent = true;
    }

    if ( this._children.length < 30 ) {
      // Add child to front of array
      this._children.push( c );
    } else {
      console.log( 'No more than 30 children can be added to one application' );
    }
    return c;
  }

  removeChild( idx: number ): void {
    this._children.splice( idx, 1 );
  }
}

export default class EnrolApplicationDto extends BaseApplicationDto {

  applicant: EnrolleeDto;
  spouse: EnrolleeDto;
  children: EnrolleeDto[];

  // Determine whether individual can apply for MSP
  liveInBC: boolean; // Currently live in BC
  plannedAbsence: boolean; // Planned absence from BC
  unUsualCircumstance: boolean;
}
