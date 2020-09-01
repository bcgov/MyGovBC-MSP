import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  forwardRef,
  SimpleChanges,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { Base, CommonImage, SampleImageInterface, CommonImageError } from 'moh-common-lib';
import {
  CanadianStatusReason,
  StatusInCanada,
} from '../../models/canadian-status.enum';
import {
  SupportDocumentList,
  SupportDocumentSamples,
  SupportDocumentTypes,
} from '../../models/support-documents.enum';
import { ControlContainer, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SupportDocuments } from '../../models/support-documents.model';
import { MspLogService } from '../../../../services/log.service';


export function suportDocumentRules(
  status: StatusInCanada,
  reason: CanadianStatusReason
): SupportDocumentTypes[] {
  switch (status) {
    case StatusInCanada.CitizenAdult:
      return [
        SupportDocumentTypes.CanadianBirthCertificate,
        SupportDocumentTypes.CanadianCitizenCard,
        SupportDocumentTypes.CanadianPassport,
      ];
    case StatusInCanada.PermanentResident:
      return [
        SupportDocumentTypes.PermanentResidentConfirmation,
        SupportDocumentTypes.RecordOfLanding,
        SupportDocumentTypes.PermanentResidentCard,
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
  return [];
}

// @TODO: If both of these are needed one should be renamed
export function nameChangeSupportDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.MarriageCertificate,
    SupportDocumentTypes.ChangeOfNameCertificate,
  ];
}

export function nameChangeSupportDocs(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.ChangeOfNameCertificate,
    SupportDocumentTypes.CanadianBirthCertificate,
    SupportDocumentTypes.CanadianCitizenCard,
    SupportDocumentTypes.CanadianPassport,
    SupportDocumentTypes.PermanentResidentCard,
    SupportDocumentTypes.PermanentResidentConfirmation,
    SupportDocumentTypes.RecordOfLanding,
    SupportDocumentTypes.StudyPermit,
    SupportDocumentTypes.WorkPermit,
    SupportDocumentTypes.VisitorVisa,
  ];
}

export function genderBirthDateChangeDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.DriversLicense,
    SupportDocumentTypes.CanadianBirthCertificate,
    SupportDocumentTypes.CanadianCitizenCard,
    SupportDocumentTypes.CanadianPassport,
    SupportDocumentTypes.PermanentResidentCard,
    SupportDocumentTypes.PermanentResidentConfirmation,
    SupportDocumentTypes.RecordOfLanding,
    SupportDocumentTypes.StudyPermit,
    SupportDocumentTypes.WorkPermit,
    SupportDocumentTypes.VisitorVisa,
  ];
}

export function nameChangeDueToErrorDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.CanadianBirthCertificate,
    SupportDocumentTypes.CanadianCitizenCard,
    SupportDocumentTypes.CanadianPassport,
    SupportDocumentTypes.PermanentResidentCard,
    SupportDocumentTypes.PermanentResidentConfirmation,
    SupportDocumentTypes.RecordOfLanding,
    SupportDocumentTypes.StudyPermit,
    SupportDocumentTypes.WorkPermit,
    SupportDocumentTypes.VisitorVisa,
  ];
}

export function spouseRemovedDueToDivorceDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.DivorceDecree,
    SupportDocumentTypes.SeparationAgreement,
    SupportDocumentTypes.NotarizedStatementOrAffidavit,
  ];
}

export function nameChangeDueToMarriageOrDivorceDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.MarriageCertificate,
    SupportDocumentTypes.ChangeOfNameCertificate,
    SupportDocumentTypes.DivorceDecree,
  ];
}

export function genderDesignationChangeDocuments(): SupportDocumentTypes[] {
  return [
    SupportDocumentTypes.CanadianBirthCertificate,
    SupportDocumentTypes.ChangeGenderAdultApplication,
    SupportDocumentTypes.ChangeGenderMinorApplication,
    SupportDocumentTypes.ChangeGenderPhysicianConfirmation,
    SupportDocumentTypes.ParentalConsentWaiver,
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
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) },
  ],
})
export class SupportDocumentsComponent extends Base
  implements OnInit, OnChanges, OnDestroy {
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

  uploadInstructions = 'Click add, or drag and drop a file into this box';
  btnEnabled: boolean = true;
  availableSupportDocuments: string[] = [];
  onChanges = new BehaviorSubject<SimpleChanges>(null);
  docSampleImages: SampleImageInterface[] = [];

  // List of all supporting document types
  private _documentOpts: string[] = Object.keys(SupportDocumentList).map(
    x => SupportDocumentList[x]
  );

  constructor(private logService: MspLogService) {
    super();
  }

  _supportDocError: CommonImage = null;
  _supportDocErrorMsg: string = '';

  ngOnInit() {
    if (this.supportDoc.documentType && this.displayButton) {
      this.btnEnabled = false;
    }

    // Change document list if status or reason changes
    this.onChanges.subscribe((changes: SimpleChanges) => {
      if (
        changes && (
          changes.canadianStatus ||
          changes.statusReason ||
          changes.supportDocList
        )
      ) {
        const _list = this.documentList.map(itm => {
          return this._documentOpts[itm];
        });

        this.availableSupportDocuments = _list ? _list : [];

        // Check if document exists in the list
        if (this.hasDocumentType) {
          const docTypeExist = this.availableSupportDocuments.find(
            x => x === this.supportDoc.documentType
          );
          if (!docTypeExist) {
            // Change in status or reason new documents required
            this.removeDocument();
          }
        }
      }
    });
  }

  // Check the collective size, triggered whenever an image is added or removed
  handleImagesChange(imgs: Array<CommonImage>) {
    let sum = 0;

    this.documents.forEach((img) => { 
      if (typeof img.size === 'number') {
        sum += img.size;
      }
    });
    
    // Same limit as moh-common-lib
    if (sum > 1048576) {
      // Reset the attachments for this upload
      this.documents = [];
      this.supportDocErrorMsg = 'The addition of the previous document exceeded the maximum upload size of this supporting document section.';
    } else {
      this.supportDocErrorMsg = '';
    }
  }

  // Set the error obj and appropriate msg, triggered when component has an error
  handleSupportDocError(error: CommonImage) {
    if (error) {
      switch (error.error) {
        case CommonImageError.WrongType:
          this.supportDocError = error;
          this.supportDocErrorMsg = 'That is the wrong type of attachment to submit.';
          break;
        case CommonImageError.TooSmall:
          this.supportDocError = error;
          this.supportDocErrorMsg = 'That attachment is too small, please upload a larger attachment.';
          break;
        case CommonImageError.TooBig:
          this.supportDocError = error;
          this.supportDocErrorMsg = 'That attachment is too big, please upload a smaller attachment.';
          break;
        case CommonImageError.AlreadyExists:
          this.supportDocError = error;
          this.supportDocErrorMsg = 'That attachment has already been uploaded.';
          break;
        case CommonImageError.Unknown:
          this.supportDocError = error;
          this.supportDocErrorMsg = 'The upload failed, please try again. If the issue persists, please upload a different attachment.';
          break;
        case CommonImageError.CannotOpen:
          this.supportDocError = error;
          this.supportDocErrorMsg = 'That attachment cannot be opened, please upload a different attachment.';
          break;
        case CommonImageError.PDFnotSupported:
          this.supportDocError = error;
          this.supportDocErrorMsg = 'That PDF type is not supported, please upload a different attachment.';
          break;
        case CommonImageError.CannotOpenPDF:
          this.supportDocError = error;
          this.supportDocErrorMsg = 'That PDF cannot be opened, please upload a different attachment.';
          break;
        default:
          this.supportDocError = null;
          break;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onChanges.next(changes);
  }

  get supportDocError() {
    return this._supportDocError;
  }

  set supportDocError(error) {
    // If the error objects exists and it's enum is defined
    if (error && error.error !== undefined && error.error !== null) {
      this._supportDocError = error;
      // TODO: Confirm Splunk usage is ok for this, and how the log should be structured
      // this.logService.log({ date: new Date(), error}, 'Request method here');
    } else {
      // Remove both the error object and the current message, as there is no longer an error
      this._supportDocError = null;
      this._supportDocErrorMsg = '';
    }
  }

  get supportDocErrorMsg() {
    if (this._supportDocErrorMsg) {
      return this._supportDocErrorMsg;
    }
    return '';
  }

  set supportDocErrorMsg(msg) {
    // Just incase someone tries to set the msg to something that isn't a string
    if (typeof msg === 'string') {
      this._supportDocErrorMsg = msg;
    } else {
      this._supportDocErrorMsg = '';
    }
  }

  ngOnDestroy() {
    this.onChanges.unsubscribe();
  }

  get hasDocumentType() {
    return this.supportDoc && this.supportDoc.documentType ? true : false;
  }

  // When clicked button is disabled
  addDocument() {
    if (this.displayButton) {
      this.btnEnabled = !this.supportDoc.documentType;
    }

    // Check to verify images is not undefined
    if (!this.supportDoc.images) {
      this.supportDoc.images = [];
    }
    this.supportDocChange.emit(this.supportDoc);
  }

  removeDocument() {
    this.btnEnabled = true;
    this.supportDoc.images = [];
    this.supportDoc.documentType = null;
    this.supportDocChange.emit(this.supportDoc);
  }

  get documentList() {
    // Get the status reason list available for the selected status
    if (!this.supportDocList) {
      return suportDocumentRules(this.canadianStatus, this.statusReason);
    }
    return this.supportDocList;
  }

  get documentType() {
    return this.supportDoc.documentType || '';
  }

  set documentType(doc: string) {
    if (this.btnEnabled) {
      // Clear document uploaded if the doc type differs
      if (!this.displayButton && this.supportDoc.documentType !== doc) {
        this.supportDoc.images = [];
        this.supportDocChange.emit(this.supportDoc);
      }
      this.supportDoc.documentType = doc;
    }
  }

  get hasSampleDoc() {
    if (this.hasDocumentType) {
      const idx = this._documentOpts.findIndex(
        x => x === this.supportDoc.documentType
      );
      if (idx >= 0 && idx < SupportDocumentSamples.length) {
        if (SupportDocumentSamples[idx].path) {
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

  set documents(images: CommonImage[]) {
    // When a new doc is uploaded, remove the current error before checking again
    this.supportDocError = null;
    this.supportDoc.images = images;
    this.supportDocChange.emit(this.supportDoc);
  }
}
