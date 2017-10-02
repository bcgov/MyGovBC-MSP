import {Component, EventEmitter, Input, Output, ViewChild, Inject} from '@angular/core'
import * as moment from 'moment';
import {ModalDirective} from "ngx-bootstrap";
import {ApplicationBase} from "../../model/application-base.model";
// jam - trying to inject appConstants
// import appConstants from '../../../../services/appConstants';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'msp-consent-modal',
  templateUrl: './consent-modal.component.html',
  // providers: [{provide: 'appConstants', useValue: appConstants}]
})
export class MspConsentModalComponent {
  lang = require('./i18n');

  @Input() processName: string;
  @Input() application: ApplicationBase;
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  @Output() onClose = new EventEmitter<void>();

  public appConstants;

  constructor() {
    this.appConstants = environment.appConstants
  }

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
