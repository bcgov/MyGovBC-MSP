import { CommonImage } from "moh-common-lib";
import { PersonDocuments } from "./person-document.model";


export class PersonStatusChange {

    status: boolean;
    label: string;
    docType: number;
    image: CommonImage;
    documentType: PersonDocuments;

}
