import { EnrolmentMembership } from './enrolment-membership.enum';

/**
 * Storage definition
 */
export class AclDto {

  // Agreement to collection notice
  infoCollectionAgreement: boolean;

  accountHolderPhn: string;

  // store date in milliseconds since January 1, 1970, 00:00:00 UTC
  accountHolderDob: number;

  // Postal code for account holder
  postalCode: string;

  // Requesting letter for member - Enums are strings
  enrolmentMembership: EnrolmentMembership;

  // PHN for specific member that letter is being requested for
  specificMemberPhn: string;

}
