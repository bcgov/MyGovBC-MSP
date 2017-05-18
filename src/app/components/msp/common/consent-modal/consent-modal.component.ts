import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core'
import moment = require("moment");
import {ModalDirective} from "ng2-bootstrap";
import {ApplicationBase} from "../../model/application-base.model";

@Component({
  selector: 'msp-consent-modal',
  templateUrl: './consent-modal.component.html'
})
export class MspConsentModalComponent {
  lang = require('./i18n');

  @Input() processName: string;
  @Input() application: ApplicationBase;
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  @Output() onClose = new EventEmitter<void>();

  agreeCheck: boolean = false;

  showFullSizeView(){
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.config.keyboard = false;
    this.fullSizeViewModal.show();
  }

  continue() {
    this.application.infoCollectionAgreement = true;
    this.fullSizeViewModal.hide();
    this.onClose.emit();
  }

}
