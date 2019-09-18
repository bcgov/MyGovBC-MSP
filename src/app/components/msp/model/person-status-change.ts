import { MspImage } from "../../../models/msp-image";
import {Relationship, StatusInCanada, Activities, Documents} from '../../../models/status-activities-documents';


export class PersonStatusChange {

    status: boolean;
    label: string;
    docType: number;
    image: MspImage;
    documentType: Documents;

}
