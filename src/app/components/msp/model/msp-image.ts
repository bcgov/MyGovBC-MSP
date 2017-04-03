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

  _uuid:string;

  constructor(){
    this._uuid = UUID.UUID();
    
  }

  get uuid():string {
    return this._uuid;
  }

  regenUUID() {
    this._uuid = UUID.UUID();
    console.log('regen uuid for image to: %s', this._uuid);
  }
  // setUUIDForImage(uid:string){
  //   this._uuid = uid;
  //   console.log('regen uuid for image to: %s', this._uuid);
  // }

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