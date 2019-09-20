import {Component, Injectable, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import { Router } from '@angular/router';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { MspPerson } from '../../../account/models/account.model';
import { StatusInCanada } from '../../../msp-core/models/canadian-status.enum';
import { PersonDocuments } from '../../../../components/msp/model/person-document.model';
import { nameChangeSupportDocuments } from '../../../msp-core/components/support-documents/support-documents.component';
import { AbstractForm } from 'moh-common-lib';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {


  nameChangeDocList = nameChangeSupportDocuments();
  subscriptions: Subscription[];

  constructor( protected router: Router,
               private dataService: MspDataService,
               private pageStateService: PageStateService ) {
    super(router);
  }

  ngOnInit() {
    this.pageStateService.setPageIncomplete(this.router.url, this.dataService.mspApplication.pageStatus);
  }

  ngAfterViewInit() {
    if (this.form) {
      this.subscriptions = [
        this.form.valueChanges.pipe(
          debounceTime(100)
        ).subscribe(() => {
          this.dataService.saveMspApplication();
        })
        ];
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }

  get applicant(): MspPerson {
    return this.dataService.mspApplication.applicant;
  }

  set applicant( applicant: MspPerson ) {
    this.dataService.mspApplication.applicant = applicant;
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
    let valid = super.canContinue() &&
                this.applicant.madePermanentMoveToBC &&
                this.hasStatusDocuments;

    if ( this.applicant.hasNameChange ) {
      valid = valid && this.hasNameDocuments;
    }

    if ( this.applicant.fullTimeStudent ) {
      valid = valid && this.applicant.inBCafterStudies;
    }
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this.pageStateService.setPageComplete(this.router.url, this.dataService.mspApplication.pageStatus);
    this.navigate(ROUTES_ENROL.SPOUSE_INFO.fullpath);
  }
}
