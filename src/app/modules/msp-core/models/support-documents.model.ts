import { CommonImage } from 'moh-common-lib';
import { CommonImageDto } from '../../../models/common-image.dto';
/**
 * Class used to store documents name changes, residency status, etc
 */
export class SupportDocuments {

  documentType: string;
  private _images: CommonImage[];

  constructor() {}

  get images(): CommonImage[] {
    if (!this._images) {
      this._images = new Array<CommonImage>();
    }
    return this._images;
  }

  set images(imgs: CommonImage[]) {
    this._images = imgs;
  }
}

/**
 * Storage definition
 */
export class SupportDocumentsDto {
  documentType: string;
  images: CommonImageDto[];
}
