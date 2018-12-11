import {
    Component, AfterViewInit, OnChanges, ViewChild, EventEmitter, Output, Input, SimpleChange,
    ChangeDetectorRef, ElementRef
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { StatusInCanada } from '../../model/status-activities-documents';

/**
 * Modal responsible for showing a disclaimer to citizens and permanent
 * residents about required BC Services Card.
 * The showing and hiding of the modal should be done by the including code.the modal wont show up on inlcuding.The method showModal() has to be invoked
 * There is no unified behavior on when to show the modal or nor.In enrolment applicaiton , it is being shown when activities are selected.In account change , when status is selected, the modal is shown.
 *
 * @example
 * ```
 * <msp-services-card-disclaimer-modal >
 * </msp-services-card-disclaimer-modal>
 * ```
 */
@ Component({
  selector: 'msp-services-card-disclaimer-modal',
  templateUrl: './services-card-disclaimer.component.html',
  styleUrls: ['./services-card-disclaimer.component.scss']
})
export class ServicesCardDisclaimerModalComponent  {
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  @Output() onClose = new EventEmitter<void>();


  lang = require('./i18n');


  /** Can call this directly to bypass having to set `personStatus` */
  showModal() {

    this.fullSizeViewModal.config.backdrop = false;
      if (!this.fullSizeViewModal.isShown) {
          this.fullSizeViewModal.show();
      }
  }

  continue() {
    this.fullSizeViewModal.hide();
    this.onClose.emit();
    return false; //Stops event propagation which triggers form validation too early.
  }



}
