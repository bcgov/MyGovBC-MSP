import { CommonAttachmentJson } from 'moh-common-lib';

export interface CommonImageJSON<T> extends CommonAttachmentJson<T> {
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
  error?: number;
}
