import {UUID} from "angular2-uuid";
/**
 * Image as uploaded by user
 */
export class MspImage {
  readonly uuid = UUID.UUID();

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
}