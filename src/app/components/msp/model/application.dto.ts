import PersonDto from './person.dto';
import AddressDto from './address.dto';

export default class MspApplicationDto {
  infoCollectionAgreement: boolean;
  applicant:PersonDto = new PersonDto();
  mailingAddress:AddressDto = new AddressDto();
  residentialAddress: AddressDto = new AddressDto();
  phoneNumber:string;
  outsideBCFor30Days: boolean;
  unUsualCircumstance:boolean;
}