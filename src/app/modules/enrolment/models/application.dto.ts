import PersonDto from '../../../components/msp/model/msp-person.dto';
import AddressDto from '../../../components/msp/model/address.dto';
import { CommonImage } from 'moh-common-lib';
import { PersonDocuments } from '../../../components/msp/model/person-document.model';

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
  applicantStatusDoc: PersonDocuments = new PersonDocuments();
  applicantNameDoc: PersonDocuments = new PersonDocuments();
  spouseStatusDoc: PersonDocuments = new PersonDocuments();
  spouseNameDoc: PersonDocuments = new PersonDocuments();
  childrenStatusDoc: Array<PersonDocuments> = [];
  childrenNameDoc: Array<PersonDocuments> = [];
}
