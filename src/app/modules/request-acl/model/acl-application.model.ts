import { BaseApplication } from '../../../models/base-application';
import { EnrolmentMembership } from './enrolment-membership.enum';
import { SimpleDate } from 'moh-common-lib';


export class AclApplication  extends BaseApplication {

  // Agreement to collection notice
  infoCollectionAgreement: boolean;

  accountHolderPhn: string;
  accountHolderDob: SimpleDate;

  // Postal code for account holder
  postalCode: string;

  // Requesting letter for member
  enrolmentMembership: EnrolmentMembership;

  // PHN for specific member that letter is being requested for
  specificMemberPhn: string;
}
