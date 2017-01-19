import {UUID} from "angular2-uuid";
import {MspImage} from "./msp-image";

export interface ApplicationBase {
  readonly uuid: UUID;
  referenceNumber: string;
  getAllImages():MspImage[];
}