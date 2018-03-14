import {Component, Input, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {ModalDirective} from "ngx-bootstrap";
import {MspDataService} from "../../service/msp-data.service";


@Component({
  selector: 'msp-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss']
})
export class MspCancelComponent {
  lang = require('./i18n');

  @Input() btnBlock: boolean = false;
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  @Input() accountButton: boolean = false;

  constructor(private dataService: MspDataService) {
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
