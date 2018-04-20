import {UUID} from "angular2-uuid";

// NOTE: If you change anything in this enum, check image-error-modal.component.html for tests and file-uploader.component.ts:
export enum MspImageError {
  WrongType,
  TooSmall,
  TooBig,
  AlreadyExists,
  Unknown,
  CannotOpen,
  PDFnotSupported,
  CannotOpenPDF,
}

export class MspImageProcessingError {
  mspImage?:MspImage;
  rawImageFile?: File;
  maxSizeAllowed?: number;
  // added errorDescription.PDF.JS gives proper error messages as invalid pdf structure or password protected pdf.Good for splunk tracking
  constructor(public errorCode:MspImageError,public errorDescription?:string){

  }
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

export interface MspImageScaleFactors {
  widthFactor:number;
  heightFactor:number;

  scaleDown(scale:number):MspImageScaleFactors;
}

export class MspImageScaleFactorsImpl implements  MspImageScaleFactors{
  widthFactor:number;
  heightFactor:number;
  
  constructor(wFactor:number, hFactor:number){
    this.widthFactor = wFactor;
    this.heightFactor = hFactor;
  }

  scaleDown(scale:number): MspImageScaleFactors{
    return new MspImageScaleFactorsImpl(
      this.widthFactor * scale, 
      this.heightFactor * scale);
  }
}