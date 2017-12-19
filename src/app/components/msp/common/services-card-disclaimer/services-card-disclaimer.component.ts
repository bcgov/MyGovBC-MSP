import { Component, AfterViewInit, OnChanges,  ViewChild, EventEmitter, Output, Input, SimpleChange } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { StatusInCanada } from "../../model/status-activities-documents";

/**
 * Modal responsible for showing a disclaimer to citizens and permanent
 * residents about required BC Services Card.
 *
 * @example
 * ```
 * <msp-services-card-disclaimer-modal [personStatus]="applicant.status">
 * </msp-services-card-disclaimer-modal>
 * ```
 */
@Component({
  selector: 'msp-services-card-disclaimer-modal',
  templateUrl: './services-card-disclaimer.component.html',
  styleUrls: ['./services-card-disclaimer.component.less']
})
export class ServicesCardDisclaimerModalComponent implements AfterViewInit, OnChanges  {
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  @Output() onClose = new EventEmitter<void>();

  /**
   * The `.status` field of a Person. Setting this value determines if it should
   * show the modal and is the default way to use this class. Can be set before
   * the modal is done initializing (e.g. during page load), or later (e.g. by
   * user action).
   */
  @Input() personStatus: StatusInCanada;
  lang = require('./i18n');
  /** Is the modal ready to be shown? */
  private initalized = false;

  ngAfterViewInit() {
    //Only display the modal once all the child views have initialized
    this.initalized = true;
    if (this.shouldShowModal(this.personStatus)) {
      this.showModal();
    }

  }

  ngOnChanges(change: {personStatus: SimpleChange}){
    if (this.initalized && this.shouldShowModal(this.personStatus)) {
      this.showModal();
    }
  }

  /** Can call this directly to bypass having to set `personStatus` */
  showModal() {
    if (!this.initalized){
      console.error("Unable to open modal before it is properly initialized.")
      return;
    }
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.show();
  }

  continue() {
    this.fullSizeViewModal.hide();
    this.onClose.emit();
    return false; //Stops event propagation which triggers form validation too early.
  }

  /**
   * Currently, we only want to show for Citizen Adults and Permanent Residents
   *
   * @param status The Applicant's `status` attribute.
   */
  private shouldShowModal(status: StatusInCanada) {
    const hasCorrectStatus = (status === StatusInCanada.CitizenAdult
      || status === StatusInCanada.PermanentResident);

    return ( hasCorrectStatus && !this.fullSizeViewModal.isShown);
  }

}
