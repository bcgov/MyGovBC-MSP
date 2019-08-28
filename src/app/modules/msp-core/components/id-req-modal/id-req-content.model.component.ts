import { Documents } from '../../models/msp-document.constants';

export class IdRequirementContent {
  residency: string;

  documentContentList: {
    document: Documents;
    title: string;
    body: string;
    image: string;
  }[];
}
