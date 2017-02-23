import {Component, Input, ViewChild, HostListener} from '@angular/core'
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

  // @HostListener('document:keydown', ['$event']) 
  // keyboardInput(event: KeyboardEvent) {
  //   console.log('keydown event', event);
  //   if(event.key === 'Escape'){
  //     console.log('escape key detected, prevent user from escaping it.');
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }
  // }
  
  agreeCheck: boolean = false;

  showFullSizeView(){
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.config.keyboard = false;
    this.fullSizeViewModal.show();
  }

  continue() {
    this.application.infoCollectionAgreement = true;
    this.fullSizeViewModal.hide();
  }

}
