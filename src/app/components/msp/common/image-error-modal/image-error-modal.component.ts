import {Component, Input, ViewChild, NgZone, Inject} from '@angular/core'
import moment = require("moment");
import {ModalDirective} from "ng2-bootstrap";
import {MspImage, MspImageError} from "../../model/msp-image";

@Component({
  selector: 'msp-image-error-modal',
  templateUrl: './image-error-modal.component.html'
})
export class MspImageErrorModalComponent {
  lang = require('./i18n');

  @Input() imageWithError: MspImage;
  @ViewChild('errorModal') public errorModal: ModalDirective;

  constructor(@Inject('appConstants') private appConstants: any, private zone:NgZone) {}

  /**
   * Returns an error message
   * @returns {string}
   */
  getErrorMessage(): string {
    let message:string = this.lang('./en/index.js').imageError[this.imageWithError.error];
    if (this.imageWithError.error === MspImageError.TooSmall) {
      message = message.replace("{width}", this.appConstants.images.minWidth);
      message = message.replace("{height}", this.appConstants.images.minHeight);
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
