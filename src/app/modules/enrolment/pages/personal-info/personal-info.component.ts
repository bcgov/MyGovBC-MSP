import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { SupportDocuments } from '../../../msp-core/models/support-documents.model';
import { nameChangeSupportDocuments } from '../../../msp-core/components/support-documents/support-documents.component';
import { EnrolForm } from '../../models/enrol-form';
import { EnrolDataService } from '../../services/enrol-data.service';
import { Enrollee } from '../../models/enrollee';

@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent extends EnrolForm {

  nameChangeDocList = nameChangeSupportDocuments();

  constructor( protected router: Router,
               protected enrolDataService: EnrolDataService,
               protected pageStateService: PageStateService ) {
    super( enrolDataService, pageStateService, router );
  }

  get applicant(): Enrollee {
    return this.mspApplication.applicant;
  }

  set applicant( applicant: Enrollee ) {
    this.mspApplication.applicant = applicant;
  }

  get statusDocuments(): SupportDocuments {
    return this.applicant.documents;
  }

  set statusDocuments( document: SupportDocuments ) {
    console.log( 'statusDocuments: ', document );

    if ( document.images && document.images.length === 0 ) {
      // no status documents remove any name documents
      this.applicant.nameChangeDocs.documentType = null;
      this.applicant.nameChangeDocs.images = [];
    }

    this.applicant.documents = document;
    console.log( 'statusDocuments: ', document );
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

  get requestSchoolInfo() {
    if ( this.applicant.isCanadianResident && this.applicant.isLivingWithoutMSP) {
      return this.applicant.livedInBCSinceBirth !== undefined &&
             this.applicant.livedInBCSinceBirth !== null &&
             this.applicant.madePermanentMoveToBC;
    }
    return this.applicant.madePermanentMoveToBC || this.applicant.isTemporaryResident;
  }

  canContinue(): boolean {
    console.log( 'form: ', this.form );
    let valid = super.canContinue() && this.hasStatusDocuments;

    // If not temporary resident needs to have moved permenently to BC
    if ( !this.applicant.isTemporaryResident ) {
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
