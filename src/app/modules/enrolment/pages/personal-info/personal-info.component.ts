import { Component, Injectable, ViewChild } from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import { Router } from '@angular/router';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { StatusInCanada, CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';
import { SupportDocuments } from '../../../msp-core/models/support-documents.model';
import { nameChangeSupportDocuments } from '../../../msp-core/components/support-documents/support-documents.component';
import { EnrolForm } from '../../models/enrol-form';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';

@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent extends EnrolForm {

  nameChangeDocList = nameChangeSupportDocuments();

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

  get statusDocuments(): SupportDocuments {
    return this.applicant.documents;
  }

  set statusDocuments( document: SupportDocuments ) {

    if ( document.images && document.images.length === 0 ) {
      // no status documents remove any name documents
      this.applicant.nameChangeDocs.documentType = null;
      this.applicant.nameChangeDocs.images = [];
    }

    this.applicant.documents = document;
  }

  get hasStatusDocuments(): boolean {
    return this.statusDocuments.images !== undefined && this.statusDocuments.images.length > 0;
  }

  get hasStatus(): boolean  {
    // Has to have values
    return this.applicant.status !== undefined &&
           this.applicant.currentActivity !== undefined;
  }

  get requestNameChangeInfo(): boolean  {
    return this.hasStatus && this.applicant.hasNameChange && this.hasStatusDocuments;
  }

  get hasNameDocuments(): boolean {
    return this.applicant.nameChangeDocs.images && this.applicant.nameChangeDocs.images.length > 0;
  }

  get requestPersonalInfo(): boolean {
    return !!(this.hasStatus && this.hasStatusDocuments &&
             ( this.applicant.hasNameChange === false || // No name change
             ( this.applicant.hasNameChange && this.hasNameDocuments ))); // name change requires documentation
  }

  get isTemporaryResident(): boolean  {
    return this.applicant.status === StatusInCanada.TemporaryResident;
  }

  get requestSchoolInfo() {
    if ( this.applicant.status === StatusInCanada.CitizenAdult &&
         this.applicant.currentActivity === CanadianStatusReason.LivingInBCWithoutMSP) {
      return this.applicant.livedInBCSinceBirth !== undefined &&
             this.applicant.livedInBCSinceBirth !== null &&
             this.applicant.madePermanentMoveToBC;
    }
    return this.applicant.madePermanentMoveToBC || this.isTemporaryResident;
  }

  canContinue(): boolean {
    console.log( 'form: ', this.form );
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
