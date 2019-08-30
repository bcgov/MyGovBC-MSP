import {Component, Input, ViewChild, NgZone, Inject} from '@angular/core';
import * as moment from 'moment';
import {ModalDirective} from 'ngx-bootstrap';
import { environment } from '../../../../../environments/environment';
import { CommonImage, CommonImageError } from 'moh-common-lib';

@Component({
  selector: 'common-image-error-modal',
  templateUrl: './image-error-modal.component.html'
})
export class MspImageErrorModalComponent {
  lang = require('./i18n');

  @Input() imageWithError: CommonImage;
  @ViewChild('errorModal') public errorModal: ModalDirective;

  constructor(private zone: NgZone) {}

  /**
   * Returns an error message
   * @returns {string}
   */
  getErrorMessage(): string {
    let message: string = this.lang('./en/index.js').imageError[this.imageWithError.error];
    if (this.imageWithError.error === CommonImageError.TooSmall) {
      message = message.replace('{width}', environment.appConstants.images.minWidth.toString());
      message = message.replace('{height}', environment.appConstants.images.minHeight.toString());
    }
    return message;
  }

  /**
   * A special method to force the rendering of this component.  This is a workaround
   * because for some unknown reason, AngularJS2 change detector does not detect the
   * change of the imageWithError.
   */
  forceRender() {
    this.zone.run(() => {
      console.log('force render');
    });
  }

  showFullSizeView(){
    this.errorModal.config.backdrop = false;
    this.errorModal.show();
  }

  continue() {
    this.imageWithError = null;
    this.errorModal.hide();
  }

}
