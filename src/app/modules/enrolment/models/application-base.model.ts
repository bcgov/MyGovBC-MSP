import {UUID} from 'angular2-uuid';
import {MspImage} from '../../../models/msp-image';

export interface ApplicationBase {
  readonly uuid: string;
  referenceNumber: string;
  getAllImages(): MspImage[];
  infoCollectionAgreement: boolean;
  authorizationToken: string;

  phnRequired: boolean;
}
