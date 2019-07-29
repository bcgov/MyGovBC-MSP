import AddressDto from '../../../components/msp/model/address.dto';
import PersonDto from '../../../components/msp/model/msp-person.dto';
import {MspImage} from '../../../models/msp-image';

import {AssistanceYear} from '../../assistance/models/assistance-year.model';
import { ISpaEnvResponse } from '../../../components/msp/model/spa-env-response.interface';

export default class BenefitApplicationDto {

  infoCollectionAgreement: boolean;
  isEligible: boolean;
  incomeLine236: number;
  ageOver65: boolean;
  hasSpouseOrCommonLaw: boolean;
  haveChildrens: boolean;
  spouseAgeOver65: boolean;
  spouseIncomeLine236: number;
  childrenCount: number;
  claimedChildCareExpense_line214: number;
  reportedUCCBenefit_line117: number;
  selfDisabilityCredit: boolean;
  spouseEligibleForDisabilityCredit: boolean;
  hasRegisteredDisabilityPlan: boolean;
  hasClaimedAttendantCareExpenses: boolean;
  spouseDSPAmount_line125: number;
  applicantEligibleForDisabilityCredit: boolean;
  childClaimForDisabilityCredit: boolean;
  taxYear: number;
  childWithDisabilityCount: number;
  phoneNumber: string;
  mailingAddress = new AddressDto();
  residentialAddress = new AddressDto();
  spaEnvRes: ISpaEnvResponse;

  applicant: PersonDto = new PersonDto();
  spouse: PersonDto = new PersonDto();

  // TODO - Verify this has been implemented correctly across models, e.g. what
  // about BenefitApplication (non-dto)
  hasSpouse: boolean;

  authorizedByApplicant: boolean;
  authorizedBySpouse: boolean;
  authorizedByAttorney: boolean;

  powerOfAttorneyDocs: MspImage[] = [];
  attendantCareExpenseReceipts: MspImage[] = [];

  applicantClaimForAttendantCareExpense: boolean = false;
  spouseClaimForAttendantCareExpense: boolean = false;
  childClaimForAttendantCareExpense: boolean = false;
  childClaimForAttendantCareExpenseCount: number = 1;

  attendantCareExpense: number;

  assistYears: AssistanceYear[] = [];
  assistYearDocs: MspImage[] = [];

 // cutOfdate fields
 cutoffYear: number;
 isCutoffDate: boolean;


}
