import {MspImage} from '../../../models/msp-image';

/**
 * A persons ID documents
 */
class PersonDocuments {
  private _images: MspImage[];

  constructor(){

  }

  get images(): MspImage[]{
    if (!this._images){
      this._images = new Array<MspImage>();
    }
    return this._images;
  }

  set images(imgs: MspImage[]){
    this._images = imgs;
  }
}
export {PersonDocuments};
