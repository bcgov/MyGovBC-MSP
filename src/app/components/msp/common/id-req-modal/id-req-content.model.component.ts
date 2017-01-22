import {Documents} from "../../model/status-activities-documents";
export class IdRequirementContent {
  residency: string;

  documentContentList: {
    document: Documents;
    title: string;
    body: string;
    image: string;
  }[];
}