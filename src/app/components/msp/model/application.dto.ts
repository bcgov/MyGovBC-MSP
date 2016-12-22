import PersonDto from './person.dto';
import AddressDto from './address.dto';

export default class MspApplicationDto {

  _applicant:PersonDto = new PersonDto();
  mailingAddress:AddressDto = new AddressDto();
  residentialAddress: AddressDto = new AddressDto();
  phoneNumber:string;

  get applicant():PersonDto{
    return this._applicant;
  }

  set applicant(applicant:PersonDto){
    this._applicant = applicant;
  }

}