import PersonDto from './person.dto';
import AddressDto from './address.dto';

export default class AccountLetterDto {
  infoCollectionAgreement: boolean;
  postalCode: string;
  enrollmentMember: string;
  specificMember_phn: string;
  showSpecificMember: boolean;
  showCaptcha: boolean;

  applicant: PersonDto = new PersonDto();
  residentialAddress: AddressDto = new AddressDto();
  outsideBCFor30Days: boolean;
  unUsualCircumstance: boolean;
  authorizedByApplicant: boolean;
  authorizedByApplicantDate: Date;
  
}
