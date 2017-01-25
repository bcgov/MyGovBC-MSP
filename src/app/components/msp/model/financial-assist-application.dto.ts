import AddressDto from './address.dto';
import PersonDto from './person.dto';
import {MspImage} from "./msp-image";

export default class FinancialAssistApplicationDto {
  infoCollectionAgreement: boolean;
  incomeLine236: number;
  ageOver65: boolean;
  hasSpouseOrCommonLaw:boolean;
  spouseAgeOver65:boolean;
  spouseIncomeLine236:number;
  childrenCount:number;
  claimedChildCareExpense_line214:number;
  reportedUCCBenefit_line117:number;
  selfDisabilityCredit:boolean;
  spouseEligibleForDisabilityCredit:boolean;
  spouseDSPAmount_line125:number;

  childWithDisabilityCount:number;
  phoneNumber:string;
  mailingAddress = new AddressDto();
  residentialAddress = new AddressDto();

  applicant:PersonDto = new PersonDto();
  spouse:PersonDto = new PersonDto();

  authorizedByApplicant:boolean;
  authorizedBySpouse:boolean;
  authorizedByAttorney:boolean;

  powerOfAttorneyDocs:MspImage[] = [];

  claimForDisabilityCredit:boolean;
  claimForNursingHomeExpense:boolean;
}