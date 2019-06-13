import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AccordionComponent, ModalDirective } from 'ngx-bootstrap';
import { Documents } from '../../../../models/status-activities-documents';
import { IdRequirementContent } from './id-req-content.model.component';


@Component({
    selector: 'msp-id-req-modal',
    templateUrl: './id-req-modal.component.html',
    styleUrls: ['./id-req-modal.component.scss']
})

export class MspIdReqModalComponent implements OnInit {
    lang = require('./i18n');

    @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
    @ViewChild('accordian') public accordian: AccordionComponent;
    idRequirementContentList: IdRequirementContent[] = this.lang('./en/index.js').idRequirementContentList;
    idRequirementContentListAccountMaintanence: IdRequirementContent[] = this.lang('./en/index.js').idRequirementContentListAccountMaintanence;
    @ViewChild('modalBody') modalBodyRef: ElementRef;
    initialDocument: number;
    @Input() isForAccountChange: boolean = false;

    // constructor(private renderer:Renderer){
    // }

    ngOnInit() {
    }

    showFullSizeView(initialDocument: Documents) {
        if (this.isForAccountChange) {
            document.body.classList.add('IE11Scroll');
        }
        this.initialDocument = initialDocument;
        this.fullSizeViewModal.config.backdrop = true;
        this.fullSizeViewModal.show();
    }

    scrollToOpenPanel() {
        if (this.isForAccountChange) {
         this.modalBodyRef.nativeElement.querySelector('.panel.panel-open').scrollIntoView();
        }
    }
    hideFullSizeView() {
         this.fullSizeViewModal.hide();

    }

    hidePanel() {
        document.body.classList.remove('IE11Scroll');

    }
}
