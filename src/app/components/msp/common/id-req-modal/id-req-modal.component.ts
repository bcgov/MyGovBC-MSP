import {Component, Input, ViewChild, ElementRef, OnInit, Renderer} from '@angular/core'
import * as moment from 'moment';
import {ModalDirective, AccordionComponent} from "ngx-bootstrap";
import {IdRequirementContent} from "./id-req-content.model.component";
import {Documents} from "../../model/status-activities-documents";


@Component({
  selector: 'msp-id-req-modal',
  templateUrl: './id-req-modal.component.html',
  styleUrls: ['./id-req-modal.component.less']
})

export class MspIdReqModalComponent implements OnInit {
  lang = require('./i18n');

  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  @ViewChild('accordian') public accordian:AccordionComponent;
  idRequirementContentList: IdRequirementContent[] = this.lang('./en/index.js').idRequirementContentList;
  initialDocument: number;

  // constructor(private renderer:Renderer){
  // }

  ngOnInit(){
  }
  showFullSizeView(document: Documents){
    this.initialDocument = document;
    this.fullSizeViewModal.config.backdrop = true;
    this.fullSizeViewModal.show();
  }
  hideFullSizeView() {
    this.fullSizeViewModal.hide();
  }
}
