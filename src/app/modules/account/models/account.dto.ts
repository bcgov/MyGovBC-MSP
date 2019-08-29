import PersonDto from '../../../components/msp/model/msp-person.dto';
import AddressDto from '../../../components/msp/model/address.dto';
import { CommonImage } from 'moh-common-lib';

export default class MspAccountDto {
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
    dependentChange: boolean ;
    addressUpdate: boolean ;
    statusUpdate: boolean ;
    nameChangeDueToMarriage: boolean ;
    documents: CommonImage[];

}
