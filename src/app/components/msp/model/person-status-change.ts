import { CommonImage } from 'moh-common-lib';
import { SupportDocuments } from '../../../modules/msp-core/models/support-documents.model';


export class PersonStatusChange {

    status: boolean;
    label: string;
    docType: number;
    image: CommonImage;
    documentType: SupportDocuments;

}
