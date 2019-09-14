import { CommonImage } from 'moh-common-lib';


/**
 * A persons ID documents
 */
export class PersonDocuments {

  documentType: string;
  private _images: CommonImage[];

  constructor() {}

  get images(): CommonImage[] {
    if (!this._images){
      this._images = new Array<CommonImage>();
    }
    return this._images;
  }

  set images(imgs: CommonImage[]) {
    this._images = imgs;
  }
}
