import { Person } from 'moh-common-lib';
import { UUID } from 'angular2-uuid';
import { Gender } from '../enums/gender.enum';
import { SupportDocuments } from '../modules/msp-core/models/support-documents.model';
import { IPersonalInformation } from '../modules/msp-core/components/personal-information/personal-information.component';
import { Relationship } from '../enums/relationship.enum';

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
