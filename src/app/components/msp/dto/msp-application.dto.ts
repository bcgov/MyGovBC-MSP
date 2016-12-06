import PersonDto from './person.dto';

export default class MspApplicationDto {

  _applicant:PersonDto = new PersonDto();

  get applicant():PersonDto{
    return this._applicant;
  }

  set applicant(applicant:PersonDto){
    this._applicant = applicant;
  }
}