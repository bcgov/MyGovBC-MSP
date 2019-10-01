import { Component, OnInit, Output, EventEmitter, Input, forwardRef, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Base, CommonImage, SampleImageInterface } from 'moh-common-lib';
import { PersonDocuments } from '../../../../components/msp/model/person-document.model';
import { CanadianStatusReason, StatusInCanada } from '../../models/canadian-status.enum';
import { SupportDocuments, SupportDocumentList, SupportDocumentSamples } from '../../models/support-documents.enum';
import { ControlContainer, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

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

// Added by Abhi
export function genderBirthDateChangeDocuments(): SupportDocuments[] {
  return [SupportDocuments.DriverLicense, SupportDocuments.CanadianBirthCertificate,
      SupportDocuments.CanadianPassport,  SupportDocuments.CanadianCitizenCard,
      SupportDocuments.PermanentResidentCard, SupportDocuments.PermanentResidentConfirmation,
      SupportDocuments.RecordOfLanding, SupportDocuments.StudyPermit,
      SupportDocuments.WorkPermit, SupportDocuments.VisitorVisa];
}

export function nameChangeDueToErrorDocuments(): SupportDocuments[] {
  return [SupportDocuments.CanadianBirthCertificate,
      SupportDocuments.CanadianPassport,  SupportDocuments.CanadianCitizenCard, SupportDocuments.PermanentResidentCard,
      SupportDocuments.PermanentResidentConfirmation, SupportDocuments.RecordOfLanding,
      SupportDocuments.StudyPermit, SupportDocuments.WorkPermit,
      SupportDocuments.VisitorVisa];
}

export function spouseRemovedDueToDivorceDocuments(): SupportDocuments[] {
  return [SupportDocuments.DivorceDecree,
          SupportDocuments.SeperationAgreement,
          SupportDocuments.NotrizedStatementOrAffidavit,
          SupportDocuments.Other];
}

export function nameChangeDueToMarriageOrDivorceDocuments(): SupportDocuments[] {
  return [SupportDocuments.MarriageCertificate, SupportDocuments.ChangeOfNameCertificate, SupportDocuments.DivorceDecree];
}

export function genderDesignationChangeDocuments(): SupportDocuments[] {
  return [SupportDocuments.CanadianBirthCertificate , SupportDocuments.ChangeGenderAdultApplication,
        SupportDocuments.ChangeGenderChildApplication , SupportDocuments.ChangeGenderPhyscianConfirmation ,
        SupportDocuments.ParentalConsentWaiver ];
}

/*
export function nameChangeSupportDocuments(): SupportDocuments[] {
  return [SupportDocuments.MarriageCertificate, SupportDocuments.ChangeOfNameCertificate];
}*/


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
export class SupportDocumentsComponent extends Base implements OnInit, OnChanges, OnDestroy {

  // List of documents to be displayed, if not provided, the default uses suportDocumentRules().
  @Input() supportDocList: SupportDocuments[];
  // Individual's status in Canadian
  @Input() canadianStatus: StatusInCanada;
  // Individual's reason for status in Canada
  @Input() statusReason: CanadianStatusReason;
  // Toggles display for the 'Add' button (true => button is displayed, false => no button displayed)
  @Input() displayButton: boolean = true;

  @Input() supportDoc: PersonDocuments;
  @Output() supportDocChange: EventEmitter<PersonDocuments> = new EventEmitter<PersonDocuments>();


  uploadInstructions = 'Click add, or drag and drop file into this box';

  btnEnabled: boolean  = true;
  availableSupportDocuments: string[] = [];

  onChanges = new BehaviorSubject<SimpleChanges>( null );

  docSampleImages: SampleImageInterface[] = [];

  // List of all supporting document types
  private _documentOpts: string[] = Object.keys(SupportDocumentList).map( x => SupportDocumentList[x] );

  constructor() {
    super();
  }

  ngOnInit() {

    console.log(this.supportDoc);
    if (this.supportDoc.documentType) {
      this.btnEnabled = false;
    }

    // Change document list if status or reason changes
    this.onChanges.subscribe((changes: SimpleChanges) => {
      console.log( 'on changes: ', changes );

      if ( changes.canadianStatus || changes.statusReason || changes.supportDocList ) {

        const _list = this.documentList.map( itm => {
          return this._documentOpts[itm];
        });

        this.availableSupportDocuments = _list ? _list : [];

        // Check if document exists in the list
        if ( this.hasDocumentType ) {
          const docTypeExist = this.availableSupportDocuments.find(
            x => x === this.supportDoc.documentType
            );
          if ( !docTypeExist ) {
            // Change in status or reason new documents required
            this.removeDocument();
          }
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onChanges.next(changes);
  }

  ngOnDestroy() {
    this.onChanges.unsubscribe();
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

  set documentType( doc: string ) {
    if ( this.btnEnabled ) {
      this.supportDoc.documentType = doc;
    }
  }

  get hasSampleDoc() {

    if ( this.hasDocumentType ) {
      const idx = this._documentOpts.findIndex( x => x === this.supportDoc.documentType );

      if ( idx >= 0 && idx < SupportDocumentSamples.length ) {
        if ( SupportDocumentSamples[idx].path ) {
          this.docSampleImages = [SupportDocumentSamples[idx]];
          return true;
        }
      }
      this.docSampleImages = [];
    }
    return false;
  }
}
