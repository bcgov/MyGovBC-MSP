import {Component, Input, ViewChild} from '@angular/core'
import moment = require("moment");
import {ModalDirective} from "ng2-bootstrap";
import {ApplicationBase} from "../../model/application-base.model";

@Component({
  selector: 'msp-consent-modal',
  templateUrl: './consent-modal.component.html'
})
export class MspConsentModalComponent {
  lang = require('./i18n');

  @Input() application: ApplicationBase;
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  agreeCheck: boolean = false;

  showFullSizeView(){
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.show();
  }

  continue() {
    this.application.infoCollectionAgreement = true;
    this.fullSizeViewModal.hide();
  }

}
