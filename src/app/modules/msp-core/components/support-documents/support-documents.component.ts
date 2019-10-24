import { Component, OnInit, Output, EventEmitter, Input, forwardRef, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Base, CommonImage, SampleImageInterface } from 'moh-common-lib';
import { CanadianStatusReason, StatusInCanada } from '../../models/canadian-status.enum';
import { SupportDocumentList, SupportDocumentSamples, SupportDocumentTypes } from '../../models/support-documents.enum';
import { ControlContainer, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SupportDocuments } from '../../models/support-documents.model';

export function suportDocumentRules(status: StatusInCanada, reason: CanadianStatusReason): SupportDocumentTypes[] {
  switch (status) {
    case StatusInCanada.CitizenAdult:
      return [
        SupportDocumentTypes.CanadianBirthCertificate,
        SupportDocumentTypes.CanadianCitizenCard,
        SupportDocumentTypes.CanadianPassport
      ];
    case StatusInCanada.PermanentResident:
      return [
        SupportDocumentTypes.PermanentResidentConfirmation,
        SupportDocumentTypes.RecordOfLanding,
        SupportDocumentTypes.PermanentResidentCard
      ];
  }
  switch (reason) {
    case CanadianStatusReason.WorkingInBC:
      return [SupportDocumentTypes.WorkPermit];
    case CanadianStatusReason.StudyingInBC:
      return [SupportDocumentTypes.StudyPermit];
    case CanadianStatusReason.ReligiousWorker:
      return [SupportDocumentTypes.VisitorVisa];
    case CanadianStatusReason.Diplomat:
      return [SupportDocumentTypes.PassportWithDiplomaticFoil];
    case CanadianStatusReason.Visiting:
      return [SupportDocumentTypes.VisitorVisa];
  }
}

export function nameChangeSupportDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.MarriageCertificate,
    SupportDocumentTypes.ChangeOfNameCertificate
  ];
}

// Added by Abhi
export function genderBirthDateChangeDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.DriverLicense,
    SupportDocumentTypes.CanadianBirthCertificate,
    SupportDocumentTypes.CanadianPassport,
    SupportDocumentTypes.CanadianCitizenCard,
    SupportDocumentTypes.PermanentResidentCard,
    SupportDocumentTypes.PermanentResidentConfirmation,
    SupportDocumentTypes.RecordOfLanding,
    SupportDocumentTypes.StudyPermit,
    SupportDocumentTypes.WorkPermit,
    SupportDocumentTypes.VisitorVisa
  ];
}

export function nameChangeDueToErrorDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.CanadianBirthCertificate,
    SupportDocumentTypes.CanadianPassport,
    SupportDocumentTypes.CanadianCitizenCard,
    SupportDocumentTypes.PermanentResidentCard,
    SupportDocumentTypes.PermanentResidentConfirmation,
    SupportDocumentTypes.RecordOfLanding,
    SupportDocumentTypes.StudyPermit,
    SupportDocumentTypes.WorkPermit,
    SupportDocumentTypes.VisitorVisa
  ];
}

export function spouseRemovedDueToDivorceDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.DivorceDecree,
    SupportDocumentTypes.SeperationAgreement,
    SupportDocumentTypes.NotrizedStatementOrAffidavit,
    SupportDocumentTypes.Other
  ];
}

export function nameChangeDueToMarriageOrDivorceDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.MarriageCertificate,
    SupportDocumentTypes.ChangeOfNameCertificate,
    SupportDocumentTypes.DivorceDecree];
}

export function genderDesignationChangeDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.CanadianBirthCertificate ,
    SupportDocumentTypes.ChangeGenderAdultApplication,
    SupportDocumentTypes.ChangeGenderChildApplication ,
    SupportDocumentTypes.ChangeGenderPhyscianConfirmation ,
    SupportDocumentTypes.ParentalConsentWaiver
  ];
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
export class SupportDocumentsComponent extends Base implements OnInit, OnChanges, OnDestroy {

  // List of documents to be displayed, if not provided, the default uses suportDocumentRules().
  @Input() supportDocList: SupportDocumentTypes[];
  // Individual's status in Canadian
  @Input() canadianStatus: StatusInCanada;
  // Individual's reason for status in Canada
  @Input() statusReason: CanadianStatusReason;
  // Toggles display for the 'Add' button (true => button is displayed, false => no button displayed)
  @Input() displayButton: boolean = false;

  @Input() supportDoc: SupportDocuments;
  @Output() supportDocChange: EventEmitter<SupportDocuments> = new EventEmitter<SupportDocuments>();


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

    if (this.supportDoc.documentType && this.displayButton) {
      this.btnEnabled = false;
    }

    // Change document list if status or reason changes
    this.onChanges.subscribe((changes: SimpleChanges) => {

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
    if ( this.displayButton ) {
      this.btnEnabled = !this.supportDoc.documentType;
    }

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

      // Clear document uploaded if the doc type differs
      if ( !this.displayButton && this.supportDoc.documentType !== doc ) {
        this.supportDoc.images  = [];
        this.supportDocChange.emit(this.supportDoc);
      }
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

  get documents() {
    return this.supportDoc.images ? this.supportDoc.images : [];
  }

  set documents( images: CommonImage[] ) {
    this.supportDoc.images = images;
    this.supportDocChange.emit(this.supportDoc);
  }
}
