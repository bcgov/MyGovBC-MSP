import { PersonDto } from '../../../components/msp/model/msp-person.dto';
import { AddressDto } from '../../../dtos/address.dto';
import { CommonImage } from 'moh-common-lib';
import { BaseDto } from 'app/dtos/base.dto';

export class MspAccountDto extends BaseDto {
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

  // Account Change options chosen by the user
  personInfoUpdate: boolean ;
  immigrationStatusChange: boolean;
  dependentChange: boolean ;
  addressUpdate: boolean ;
  statusUpdate: boolean ;
  nameChangeDueToMarriage: boolean ;
  documents: CommonImage[] = [];

  hasSpouseAdded: boolean;
  hasSpouseUpdated: boolean;
  hasSpouseRemoved: boolean;
  hasChildAdded: boolean;
  hasChildRemoved: boolean;
  hasChildUpdated: boolean;
}
