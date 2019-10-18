import { ICanadianStatus } from '../../msp-core/components/canadian-status/canadian-status.component';
import BasePersonDto, { BasePerson } from '../../../models/base-person';
import { StatusInCanada, CanadianStatusReason } from '../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../models/relationship.enum';
import { Address } from 'moh-common-lib';
import { SupportDocuments } from '../../msp-core/models/support-documents.model';

export class Enrollee extends BasePerson implements ICanadianStatus {

  // Canadian status component
  status: StatusInCanada;
  currentActivity: CanadianStatusReason;
  relationship: Relationship;
  //clearData?: (x: any) => {};

  nameChangeDocs: SupportDocuments = new SupportDocuments();

  // School information for full-time students
  fullTimeStudent: boolean = false;
  inBCafterStudies: boolean;

   // For children 19-24, we need the school name and address
  schoolName: string;
  schoolAddress: Address = new Address();
  schoolCompletionDt: Date;

  // If school out BC, require departure date
  departureDtForSchool: Date;


  constructor( rel: Relationship = null ) {
    super();
    if ( rel ) {
      this.relationship = rel;
    }
  }
}

export default class EnrolleeDto extends BasePersonDto {

  status: StatusInCanada;
  currentActivity: CanadianStatusReason;
  relationship: Relationship;
}
