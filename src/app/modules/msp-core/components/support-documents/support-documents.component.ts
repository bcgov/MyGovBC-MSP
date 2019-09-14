import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Base, CommonImage } from 'moh-common-lib';
import { PersonDocuments } from '../../../../components/msp/model/person-document.model';
import { CanadianStatusReason, StatusInCanada } from '../../models/canadian-status.enum';
import { statusReasonRules } from '../canadian-status/canadian-status.component';
import { SupportDocuments, SupportDocumentList } from '../../models/support-documents.enum';

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
  styleUrls: ['./support-documents.component.scss']
})
export class SupportDocumentsComponent extends Base {

  @Input() supportDocList: SupportDocuments[];
  @Input() canadianStatus: StatusInCanada;
  @Input() statusReason: CanadianStatusReason;

  @Input() supportDoc: PersonDocuments;
  @Output() supportDocChange: EventEmitter<PersonDocuments> = new EventEmitter<PersonDocuments>();


  hasDocumentType: boolean = false;
  uploadDocInstructions = 'Click add, or drag and drop file into this box';

  private _documentOpts: string[] = Object.keys(SupportDocumentList).map( x => SupportDocumentList[x] );

  constructor() {
    super();
  }

  // When clicked button is disabled
  addDocument() {
    this.hasDocumentType = this.supportDoc.documentType ? true : false;

    // Check to verify images is not undefined
    if ( !this.supportDoc.images ) {
      this.supportDoc.images = [];
    }
    this.supportDocChange.emit(this.supportDoc);
  }

  removeDocument() {
    this.supportDoc.images  = [];
    this.hasDocumentType = false;
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
}
