import PersonDto from '../../../components/msp/model/msp-person.dto';
import AddressDto from '../../../components/msp/model/address.dto';
import { CommonImage } from 'moh-common-lib';

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

  pageStatus: any[] = []; // page status - complete/ incomplete

  // Documents
  applicantStatusDoc: CommonImage[] = [];
  applicantNameDoc: CommonImage[] = [];
  spouseStatusDoc: CommonImage[] = [];
  spouseNameDoc: CommonImage[] = [];
  childrenStatusDoc: Array<CommonImage[]> = [];
  childrenNameDoc: Array<CommonImage[]> = [];
}
