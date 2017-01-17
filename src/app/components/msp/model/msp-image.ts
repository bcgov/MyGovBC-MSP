import {UUID} from "angular2-uuid";
/**
 * Image as uploaded by user
 */
export class MspImage {
  readonly uuid = UUID.UUID();

  // The type should be string. Should change to string after file uploader stablizes
  fileContent:File;
  size: number;
  sizeUnit: string;
  sizeTxt:string;
  naturalHeight: number;
  naturalWidth: number;
  name:string;
  id: string;

  /**
   * Mostly for unit test purposes because of difficultly with File API
   * but could be used to override content type for conversion purposes, etc
   */
  private _contentType: string;
  get contentType(): string {
    if (this._contentType) return this._contentType;
    else return this.fileContent.type;
  }
  set contentType(value:string) {
    this._contentType = value;
  }

  private _blob: Blob;
  getFileAsBlob(): Blob {
    if (this.fileContent) {
      return this.fileContent;
    }
    else return this._blob;
  }
  setFileAsBlob(value:Blob) {
    this._blob = value;
  }
}