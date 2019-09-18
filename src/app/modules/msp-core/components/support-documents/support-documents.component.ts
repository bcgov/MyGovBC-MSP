import { Component, OnInit, Output, EventEmitter, Input, forwardRef } from '@angular/core';
import { Base, CommonImage } from 'moh-common-lib';
import { PersonDocuments } from '../../../../components/msp/model/person-document.model';
import { CanadianStatusReason, StatusInCanada } from '../../models/canadian-status.enum';
import { statusReasonRules } from '../canadian-status/canadian-status.component';
import { SupportDocuments, SupportDocumentList } from '../../models/support-documents.enum';
import { ControlContainer, NgForm } from '@angular/forms';

export function suportDocumentRules(status: StatusInCanada, reason: CanadianStatusReason): SupportDocuments[] {
  switch (status) {
    case StatusInCanada.CitizenAdult:
      return [SupportDocuments.CanadianBirthCertificate, SupportDocuments.CanadianCitizenCard, SupportDocuments.CanadianPassport];
    case StatusInCanada.PermanentResident:
      return [SupportDocuments.RecordOfLanding, SupportDocuments.PermanentResidentCard];
  }
  switch (reason) {
    case CanadianStatusReason.WorkingInBC:
      return [SupportDocuments.WorkPermit];
    case CanadianStatusReason.StudyingInBC:
      return [SupportDocuments.StudyPermit];
    case CanadianStatusReason.ReligiousWorker:
      return [SupportDocuments.VisitorVisa];
    case CanadianStatusReason.Diplomat:
      return [SupportDocuments.PassportWithDiplomaticFoil];
    case CanadianStatusReason.Visiting:
      return [SupportDocuments.VisitorVisa];
  }
}

export function nameChangeSupportDocuments(): SupportDocuments[] {
  return [SupportDocuments.MarriageCertificate, SupportDocuments.ChangeOfNameCertificate];
}


@Component({
  selector: 'msp-support-documents',
  templateUrl: './support-documents.component.html',
  styleUrls: ['./support-documents.component.scss'],
  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})
export class SupportDocumentsComponent extends Base implements OnInit {

  @Input() supportDocList: SupportDocuments[];
  @Input() canadianStatus: StatusInCanada;
  @Input() statusReason: CanadianStatusReason;

  @Input() supportDoc: PersonDocuments;
  @Output() supportDocChange: EventEmitter<PersonDocuments> = new EventEmitter<PersonDocuments>();


  uploadInstructions = 'Click add, or drag and drop file into this box';

  btnEnabled: boolean  = true;
  private _documentOpts: string[] = Object.keys(SupportDocumentList).map( x => SupportDocumentList[x] );

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.supportDoc.documentType) {
      this.btnEnabled = false;
    }
  }

  get hasDocumentType() {
    return this.supportDoc.documentType ? true : false;
  }

  // When clicked button is disabled
  addDocument() {
    this.btnEnabled = !this.supportDoc.documentType;

    // Check to verify images is not undefined
    if ( !this.supportDoc.images ) {
      this.supportDoc.images = [];
    }
    this.supportDocChange.emit(this.supportDoc);
  }

  removeDocument() {
    this.btnEnabled = true;

    this.supportDoc.images  = [];
    this.supportDoc.documentType = null;
    this.supportDocChange.emit(this.supportDoc);
  }

  documentChange(images: CommonImage[]) {
    this.supportDoc.images = images;
    this.supportDocChange.emit(this.supportDoc);
  }

  get availableSupportDocuments() {
    return this.documentList.map( itm => {
      return this._documentOpts[itm];
    });
  }

  get documentList() {
    // Get the status reason list available for the selected status
    if ( !this.supportDocList ) {
      return suportDocumentRules( this.canadianStatus, this.statusReason );
    }
    return this.supportDocList;
  }

  get documentType() {
    return this.supportDoc.documentType;
  }

  set documentType( doc: string ){
    if ( this.btnEnabled ) {
      this.supportDoc.documentType = doc;
    }
  }

}
