import { SupportDocuments } from '../../models/support-documents.enum';


export class IdRequirementContent {
  residency: string;

  documentContentList: {
    document: SupportDocuments;
    title: string;
    body: string;
    image: string;
  }[];
}
