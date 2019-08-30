import { CommonImage } from 'moh-common-lib';

export interface ApplicationBase {
  readonly uuid: string;
  referenceNumber: string;
  getAllImages(): CommonImage[];
  infoCollectionAgreement: boolean;
  authorizationToken: string;

  phnRequired: boolean;
}
