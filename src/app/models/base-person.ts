import { Person, CommonImage } from 'moh-common-lib';
import { UUID } from 'angular2-uuid';
import { Gender } from './gender.enum';
import { SupportDocuments } from '../modules/msp-core/models/support-documents.model';

export class BasePerson extends Person {

  // Person has name, dob, and dob format

  readonly uuid = UUID.UUID();
  gender: Gender;
  documents: SupportDocuments = new SupportDocuments();

  constructor() {
    super();
    this.dobFormat = 'MMMM D, YYYY';
  }
}


export default class BasePersonDto {

  // Names
  firstName: string;
  middleName: string;
  lastName: string;

  dateOfBirth: Date;

  gender: Gender;

  // documents
  documents: SupportDocuments = new SupportDocuments();
}
