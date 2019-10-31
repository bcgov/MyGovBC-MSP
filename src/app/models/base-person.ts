import { Person } from 'moh-common-lib';
import { UUID } from 'angular2-uuid';
import { Gender } from './gender.enum';
import { SupportDocumentsDto, SupportDocuments } from '../modules/msp-core/models/support-documents.model';
import { IPersonalInformation } from '../modules/msp-core/components/personal-information/personal-information.component';
import { Relationship } from './relationship.enum';

export class BasePerson extends Person implements IPersonalInformation {

  // Person has name, dob, and dob format

  readonly uuid = UUID.UUID();
  gender: Gender;
  relationship: Relationship;
  documents: SupportDocuments = new SupportDocuments();

  constructor( rel?: Relationship ) {
    super();
    this.dobFormat = 'MMMM d, yyyy';

    if ( rel !== null || rel !== undefined ) {
      this.relationship = rel;
    }
  }
}

/**
 * Storage definition
 */
export class BasePersonDto {

  // Names
  firstName: string;
  middleName: string;
  lastName: string;

  dateOfBirth: number;

  gender: Gender;
  relationship: Relationship;

  // SupportDocuments
  documents: SupportDocumentsDto;
}
