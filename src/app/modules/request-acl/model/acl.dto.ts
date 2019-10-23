import { EnrolmentMembership } from './enrolment-membership.enum';

/**
 * Storage definition
 */
export class AclDto {

  // Agreement to collection notice
  infoCollectionAgreement: boolean;

  accountHolderPhn: string;
  accountHolderDob: Date;

  // Postal code for account holder
  postalCode: string;

  // Requesting letter for member
  enrolmentMembership: EnrolmentMembership;

  // PHN for specific member that letter is being requested for
  specificMemberPhn: string;

}
