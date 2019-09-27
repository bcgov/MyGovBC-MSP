import { Component, OnInit, Output, EventEmitter, Input, forwardRef, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Base, CommonImage } from 'moh-common-lib';
import { PersonDocuments } from '../../../../components/msp/model/person-document.model';
import { CanadianStatusReason, StatusInCanada } from '../../models/canadian-status.enum';
import { SupportDocuments, SupportDocumentList } from '../../models/support-documents.enum';
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

  @Input() supportDocList: SupportDocuments[];
  @Input() canadianStatus: StatusInCanada;
  @Input() statusReason: CanadianStatusReason;
  @Input() displayButton: boolean = true;

  @Input() supportDoc: PersonDocuments;
  @Output() supportDocChange: EventEmitter<PersonDocuments> = new EventEmitter<PersonDocuments>();


  uploadInstructions = 'Click add, or drag and drop file into this box';

  btnEnabled: boolean  = true;
  availableSupportDocuments: string[] = [];
  private _documentOpts: string[] = Object.keys(SupportDocumentList).map( x => SupportDocumentList[x] );

  onChanges = new BehaviorSubject<SimpleChanges>( null );

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

      if ( changes.canadianStatus || changes.statusReason ) {
        const _list = this.documentList.map( itm => {
          return this._documentOpts[itm];
        });

        if ( _list && this.availableSupportDocuments ) {
          const diff = _list.filter( x => !this.availableSupportDocuments.includes(x) );
          if ( diff.length ) {
            this.availableSupportDocuments = _list;
            // Change in status or reason new documents required
            this.removeDocument();
          }
        } else {
          this.availableSupportDocuments = [];

          // Change in status or reason new documents required
          this.removeDocument();
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

  /*get availableSupportDocuments() {
    if (this.documentList) {
      return this.documentList.map( itm => {
        return this._documentOpts[itm];
      });
    }
  }*/

  get documentList() {
    console.log(this.statusReason);
    console.log(this.canadianStatus);
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

}
