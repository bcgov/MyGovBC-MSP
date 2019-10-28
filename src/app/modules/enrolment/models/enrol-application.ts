import { BaseApplicationDto, BaseApplication } from '../../../models/base-application';
import { EnrolleeDto, Enrollee } from './enrollee';
import { Relationship } from '../../../models/relationship.enum';
import { CommonImage, Address } from 'moh-common-lib';
import { AddressDto } from '../../../models/address.dto';
import { UUID } from 'angular2-uuid';

export class EnrolApplication extends BaseApplication {

  applicant: Enrollee = new Enrollee( Relationship.Applicant );

  // Applicant may have spouse and/or children
  spouse: Enrollee;
  children: Enrollee[] = [];

  // Determine whether individual can apply for MSP
  liveInBC: boolean; // Currently live in BC
  plannedAbsence: boolean; // Planned absence from BC
  unUsualCircumstance: boolean;

  // Contact information
  residentialAddress: Address = new Address();
  mailingSameAsResidentialAddress: boolean = true;
  mailingAddress: Address = new Address();
  phoneNumber: string;

  constructor() {
    super();
  }

  hasSpouse() {
    return this.spouse ? true : false;
  }

  addSpouse() {
    if ( !this.spouse ) {
      this.spouse = new Enrollee( Relationship.Spouse );
    }
  }

  removeSpouse(): void {
    this.spouse = null;
  }

  addChild( relationship: Relationship ): Enrollee {

    const c = new Enrollee( relationship );
    if ( relationship === Relationship.Child19To24 ) {
      // child between 19-24 must be a full time student to qualify for enrollment
      c.fullTimeStudent = true;
    }

    if ( this.children.length < 30 ) {
      // Add child to front of array
      this.children.push( c );
    } else {
      console.log( 'No more than 30 children can be added to one application' );
    }
    return c;
  }

  removeChild( idx: number ): void {
    this.children.splice( idx, 1 );
  }

  // Specific logic to enrolment application
  getAllImages(): CommonImage[] {

    let allImages = [...this.applicant.documents.images];

    if ( this.applicant.hasNameChange ) {
      allImages = allImages.concat([...this.applicant.nameChangeDocs.images]);
    }

    if (this.spouse) {
      allImages = allImages.concat([...this.spouse.documents.images]);

      if ( this.spouse.hasNameChange ) {
        allImages = allImages.concat([...this.spouse.nameChangeDocs.images]);
      }
    }
    for (const child of this.children) {
      allImages = allImages.concat([...child.documents.images]);
      if ( child.hasNameChange ) {
        allImages = allImages.concat([...child.nameChangeDocs.images]);
      }
    }

    return allImages;
  }

  // method specific to application - overrride base application regenUUID funcation
  regenUUID() {
    super.regenUUID();

    /**
     * Each image will have a uuid that starts with application uuid
     * followed by [index]-of-[total]
     */
    const all = this.getAllImages();

    all.forEach( image => {
      image.uuid = UUID.UUID();
    });
  }
}
/**
 * Storage definition
 */
export class EnrolApplicationDto extends BaseApplicationDto {

  applicant: EnrolleeDto;
  spouse: EnrolleeDto;
  children: EnrolleeDto[] = [];

  // Determine whether individual can apply for MSP
  liveInBC: boolean; // Currently live in BC
  plannedAbsence: boolean; // Planned absence from BC
  unUsualCircumstance: boolean;

  // Contact information
  residentialAddress: AddressDto;
  mailingSameAsResidentialAddress: boolean;
  mailingAddress: AddressDto;
  phoneNumber: string;
}
