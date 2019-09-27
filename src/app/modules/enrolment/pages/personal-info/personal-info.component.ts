import { Component, Injectable, ViewChild } from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import { Router } from '@angular/router';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { MspPerson } from '../../../account/models/account.model';
import { StatusInCanada } from '../../../msp-core/models/canadian-status.enum';
import { PersonDocuments } from '../../../../components/msp/model/person-document.model';
import { nameChangeSupportDocuments } from '../../../msp-core/components/support-documents/support-documents.component';
import { EnrolForm } from '../../models/enrol-form';
import { SampleModalComponent } from 'moh-common-lib';


@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent extends EnrolForm {

  nameChangeDocList = nameChangeSupportDocuments();

  @ViewChild('sampleDocs') sampleDocs: SampleModalComponent;

  constructor( protected router: Router,
               protected dataService: MspDataService,
               protected pageStateService: PageStateService ) {
    super( dataService, pageStateService, router );
  }

  get applicant(): MspPerson {
    return this.mspApplication.applicant;
  }

  set applicant( applicant: MspPerson ) {
    this.mspApplication.applicant = applicant;
  }

  get statusDocuments(): PersonDocuments {
    return this.applicant.documents;
  }

  set statusDocuments( document: PersonDocuments ) {

    if ( document.images && document.images.length === 0 ) {
      // no status documents remove any name documents
      this.applicant.nameChangeDocs.documentType = null;
      this.applicant.nameChangeDocs.images = [];
    }

    this.applicant.documents = document;
  }

  get hasStatusDocuments(): boolean {
    return this.statusDocuments.images && this.statusDocuments.images.length > 0;
  }

  get hasStatus() {
    // Has to have values
    return this.applicant.status !== undefined &&
           this.applicant.currentActivity !== undefined;
  }

  get requestNameChangeInfo() {
    return this.hasStatus && this.applicant.hasNameChange && this.hasStatusDocuments;
  }

  get hasNameDocuments(): boolean {
    return this.applicant.nameChangeDocs.images && this.applicant.nameChangeDocs.images.length > 0;
  }

  get requestPersonalInfo(): boolean {
    return this.hasStatus && this.hasStatusDocuments &&
           ( this.applicant.hasNameChange === false || // No name change
            ( this.applicant.hasNameChange && this.hasNameDocuments )); // name change requires documentation
  }

  get isTemporaryResident() {
    return this.applicant.status === StatusInCanada.TemporaryResident;
  }

  canContinue(): boolean {
    let valid = super.canContinue() && this.hasStatusDocuments;

    // If not temporary resident needs to have moved permenently to BC
    if ( !this.isTemporaryResident ) {
      valid = valid && this.applicant.madePermanentMoveToBC;
    }

    if ( this.applicant.hasNameChange ) {
      valid = valid && this.hasNameDocuments;
    }

    if ( this.applicant.fullTimeStudent ) {
      valid = valid && this.applicant.inBCafterStudies;
    }
    return valid;
  }

  continue(): void {
    this._nextUrl = ROUTES_ENROL.SPOUSE_INFO.fullpath;
    this._canContinue = this.canContinue();
    super.continue();
  }
}
