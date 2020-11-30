import { SupportDocumentsDto } from 'app/modules/msp-core/models/support-documents.model';
import { BaseDto } from './base.dto';
import { Gender } from '../enums/gender.enum';
import { Relationship } from '../enums/relationship.enum';


/**
 * Storage definition
 */
export class BasePersonDto extends BaseDto {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: number;
  gender: Gender;
  relationship: Relationship;
  documents: SupportDocumentsDto;
}
