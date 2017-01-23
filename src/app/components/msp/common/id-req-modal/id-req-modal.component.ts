import {Component, Input, ViewChild} from '@angular/core'
import moment = require("moment");
import {ModalDirective, AccordionComponent} from "ng2-bootstrap";
import {IdRequirementContent} from "./id-req-content.model.component";
import {Documents} from "../../model/status-activities-documents";

require('./id-req-modal.component.less');

@Component({
  selector: 'msp-id-req-modal',
  templateUrl: './id-req-modal.component.html'
})

export class MspIdReqModalComponent {
  lang = require('./i18n');

  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  @ViewChild('accordian') public accordian:AccordionComponent;

  idRequirementContentList: IdRequirementContent[] = this.lang('./en/index.js').idRequirementContentList;
  initialDocument: number;

  getImageUrl(fileName:string):string {
    return require("file-loader?name=[name].[ext]&emitFile=true&publicPath=assets/images/!./images/" + fileName);
  }

  showFullSizeView(document: Documents){
    this.initialDocument = document;
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.show();
  }
  hideFullSizeView() {
    this.fullSizeViewModal.hide();
  }

}
