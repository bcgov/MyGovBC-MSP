import {UUID} from "angular2-uuid";

export enum MspImageError {
  WrongType,
  TooSmall,
  TooBig,
  AlreadyExists,
  Unknown
}

/**
 * Image as uploaded by user
 */
export class MspImage {

  uuid:string;

  constructor(){
    this.uuid = UUID.UUID();
  }

  fileContent:string;
  contentType: string;
  //number of bytes.
  size: number;
  sizeUnit: string;
  sizeTxt:string;
  naturalHeight: number;
  naturalWidth: number;
  name:string;

  //file uniqness checksum
  id: string;

  error?: MspImageError;
}