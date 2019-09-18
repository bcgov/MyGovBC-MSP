import { CommonImage } from "moh-common-lib";
import {Relationship, StatusInCanada, Activities, Documents} from '../../../models/status-activities-documents';


export class PersonStatusChange {

    status: boolean;
    label: string;
    docType: number;
    image: CommonImage;
    documentType: Documents;

}
