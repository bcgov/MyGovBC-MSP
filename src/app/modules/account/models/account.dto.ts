import PersonDto from '../../../components/msp/model/msp-person.dto';
import AddressDto from '../../../components/msp/model/address.dto';
import {MspImage} from '../../../models/msp-image';
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
    immigrationStatusChange: boolean;
    dependentChange: boolean ;
    addressUpdate: boolean ;
    statusUpdate: boolean ;
    nameChangeDueToMarriage: boolean ;
    documents: MspImage[];

    hasSpouseAdded: boolean;
    hasSpouseUpdated: boolean;
    hasSpouseRemoved: boolean;
    hasChildAdded: boolean;
    hasChildRemoved: boolean;
    hasChildUpdated: boolean;

}
