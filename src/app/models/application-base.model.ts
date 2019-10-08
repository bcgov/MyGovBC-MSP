import { CommonImage } from 'moh-common-lib';

/**
 * Base information that all MSP applications have
 *
 * TODO: Determine whether is this required
 */
export interface ApplicationBase {

  // ID for the applications
  readonly uuid: string;

  // TODO: Determine whether this should be stored - reference number returned by call to back-end
  referenceNumber: string;

  // TODO: Determine whether this should be here or in specific applications
  getAllImages(): CommonImage[];

  // Flag to indicate whether individual has read the collection agreement
  infoCollectionAgreement: boolean;

  // Token for all calls to backend
  authorizationToken: string;

  // TODO: Determine if this field is required
  // phnRequired: boolean;
}
