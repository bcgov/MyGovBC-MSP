import PersonDto from './person.dto';
import AddressDto from './address.dto';

export default class MspApplicationDto {

  applicant:PersonDto = new PersonDto();
  mailingAddress:AddressDto = new AddressDto();
  residentialAddress: AddressDto = new AddressDto();
  phoneNumber:string;

}