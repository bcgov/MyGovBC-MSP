import { BaseDto } from './base.dto';

export class BaseApplicationDto extends BaseDto {
  // Flag to indicate whether individual has read the collection agreement
  infoCollectionAgreement: boolean;

  // Authorization
  authorizedByApplicant: boolean;
  authorizedBySpouse: boolean;
  authorizedByApplicantDate: number;
}
