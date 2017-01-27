import {Component, Input, ViewChild} from '@angular/core';
import moment = require("moment");
import {ModalDirective} from "ng2-bootstrap";
import DataService from '../../service/msp-data.service';

@Component({
  selector: 'msp-cancel',
  templateUrl: './cancel.component.html'
})
export class MspCancelComponent {
  lang = require('./i18n');

  @Input() btnBlock: boolean = false;
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;

  constructor(private dataService: DataService) {
  }

  showFullSizeView(){
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.show();
  }

  noButtonClick() {
    this.fullSizeViewModal.hide();
  }

  yesButtonClick() {
    this.dataService.destroyAll();

    // navigate to CMS
    window.location.href = this.lang('./en/index.js').postCancelUrl;
  }
}
