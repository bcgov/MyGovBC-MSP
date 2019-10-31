import { AddressDto } from '../../../models/address.dto';
import { PersonDto } from '../../../components/msp/model/msp-person.dto';
import { AssistanceYear } from './assistance-year.model';
import { CommonImage } from 'moh-common-lib';

export class FinancialAssistApplicationDto {
  infoCollectionAgreement: boolean;
  incomeLine236: number;
  ageOver65: boolean;
  hasSpouseOrCommonLaw: boolean;
  spouseAgeOver65: boolean;
  spouseIncomeLine236: number;
  childrenCount: number;
  claimedChildCareExpense_line214: number;
  reportedUCCBenefit_line117: number;
  selfDisabilityCredit: boolean;
  spouseEligibleForDisabilityCredit: boolean;
  spouseDSPAmount_line125: number;

  childWithDisabilityCount: number;
  phoneNumber: string;
  mailingAddress = new AddressDto();
  residentialAddress = new AddressDto();

  applicant: PersonDto = new PersonDto();
  spouse: PersonDto = new PersonDto();

  authorizedByApplicant: boolean;
  authorizedBySpouse: boolean;
  authorizedByAttorney: boolean;

  powerOfAttorneyDocs: CommonImage[] = [];
  attendantCareExpenseReceipts: CommonImage[] = [];

  applicantClaimForAttendantCareExpense: boolean = false;
  spouseClaimForAttendantCareExpense: boolean = false;
  childClaimForAttendantCareExpense: boolean = false;
  childClaimForAttendantCareExpenseCount: number = 1;

  attendantCareExpense: number;

  assistYears: AssistanceYear[] = [];
  assistYeaDocs: CommonImage[] = [];

  pageStatus: any[] = []; // page status - complete/ incomplete
}
