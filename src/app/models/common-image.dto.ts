import { CommonImageJSON } from './common-image-json.interface';

// moh-common-lib class, refer to moh-common-styles for additional documentation
export class CommonImageDto<T = any> {
  uuid: string;
  fileContent: string;
  documentType: T;
  contentType: string;
  size: number;
  sizeUnit: string;
  sizeTxt: string;
  naturalHeight: number;
  naturalWidth: number;
  name: string;
  id: string;
  error?: number; // Formerly an enum, stored as a number
  attachmentOrder: number;

  toJSON(): CommonImageJSON<T> {
    return {
      attachmentUuid: this.uuid,
      attachmentDocumentType: this.documentType,
      uuid: this.uuid,
      fileContent: this.fileContent,
      documentType: this.documentType,
      contentType: this.contentType,
      size: this.size,
      sizeUnit: this.sizeUnit,
      sizeTxt: this.sizeTxt,
      naturalHeight: this.naturalHeight,
      naturalWidth: this.naturalWidth,
      name: this.name,
      id: this.id,
      error: this.error,
      attachmentOrder: this.attachmentOrder
    };
  }
}
