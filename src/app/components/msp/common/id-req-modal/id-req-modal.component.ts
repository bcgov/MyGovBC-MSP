import {Component, Input, ViewChild, ElementRef, OnInit, Renderer} from '@angular/core'
import moment = require("moment");
import {ModalDirective, AccordionComponent} from "ng2-bootstrap";
import {IdRequirementContent} from "./id-req-content.model.component";
import {Documents} from "../../model/status-activities-documents";

require('./id-req-modal.component.less');

@Component({
  selector: 'msp-id-req-modal',
  templateUrl: './id-req-modal.component.html'
})

export class MspIdReqModalComponent implements OnInit {
  lang = require('./i18n');

  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  @ViewChild('accordian') public accordian:AccordionComponent;
  // @ViewChild('modalBody') modalBodyRef: ElementRef;
  idRequirementContentList: IdRequirementContent[] = this.lang('./en/index.js').idRequirementContentList;
  initialDocument: number;

  // constructor(private renderer:Renderer){

  // }
  ngOnInit(){
  }
  showFullSizeView(document: Documents){
    console.log('show full size modal dialog for sample ids.');
    this.initialDocument = document;
    // console.log('native element modalBodyRef %o', this.modalBodyRef.nativeElement);
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.show();
    this.showBackdrop();
    // this.modalBodyRef.nativeElement.focus();
    
  }
  hideFullSizeView() {
    this.fullSizeViewModal.hide();
    this.hideBackdrop();
  }

  showBackdrop() {
      let el = document.createElement('div');
      el.className = 'modal-backdrop fade in';
      el.tabIndex = -1;
      document.body.appendChild(el);
  }
  hideBackdrop() {
      document.body.removeChild(document.querySelector('.modal-backdrop'));
  }  

}
