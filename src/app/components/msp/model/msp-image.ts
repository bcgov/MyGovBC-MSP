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
  readonly uuid = UUID.UUID();

  fileContent:string;
  contentType: string;
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