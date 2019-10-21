import { Person, SimpleDate } from 'moh-common-lib';
import { UUID } from 'angular2-uuid';
import { Gender } from './gender.enum';
import SupportDocumentsDto, { SupportDocuments } from '../modules/msp-core/models/support-documents.model';
import { IPersonalInformation } from '../modules/msp-core/components/personal-information/personal-information.component';

export class BasePerson extends Person implements IPersonalInformation{

  // Person has name, dob, and dob format

  readonly uuid = UUID.UUID();
  gender: Gender;
  documents: SupportDocuments = new SupportDocuments();

  constructor() {
    super();
    this.dobFormat = 'MMMM D, YYYY';
  }

  dateExists( dt: SimpleDate ): boolean {
    return Object.keys(dt).map( x => dt[x] === undefined || dt[x] === null )
            .filter( itm => itm === true )
            .length === 0;
  }
}

export default class BasePersonDto {

  // Names
  firstName: string;
  middleName: string;
  lastName: string;

  dateOfBirth: SimpleDate;

  gender: Gender;

  // SupportDocuments
  documents: SupportDocumentsDto;
}
