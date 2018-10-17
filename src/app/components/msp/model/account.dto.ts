import PersonDto from './person.dto';
import AddressDto from './address.dto';
import {MspImage} from './msp-image';
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
    documents: MspImage[];

}
