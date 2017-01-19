import {UUID} from "angular2-uuid";
import {MspImage} from "./msp-image";

export interface ApplicationBase {
  readonly uuid: string;
  referenceNumber: string;
  getAllImages():MspImage[];
}