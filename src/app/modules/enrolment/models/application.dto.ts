import PersonDto from '../../../components/msp/model/person.dto';
import AddressDto from '../../../components/msp/model/address.dto';

export default class MspApplicationDto {
  infoCollectionAgreement: boolean;
  applicant: PersonDto = new PersonDto();
  mailingSameAsResidentialAddress: boolean;
  mailingAddress: AddressDto = new AddressDto();
  residentialAddress: AddressDto = new AddressDto();
  phoneNumber: string;
  outsideBCFor30Days: boolean;
  unUsualCircumstance: boolean;

  authorizedByApplicant: boolean;
  authorizedByApplicantDate: Date;
  authorizedBySpouse: boolean;

}
