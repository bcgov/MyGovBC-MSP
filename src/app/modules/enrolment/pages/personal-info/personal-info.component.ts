import {Component, Injectable, ViewChildren, QueryList, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import { Router } from '@angular/router';
import {PersonalDetailsComponent} from '../../components/personal-details/personal-details.component';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { MspApplication } from '../../models/application.model';
import { MspPerson } from '../../../account/models/account.model';
import { StatusInCanada } from '../../../msp-core/models/canadian-status.enum';
import { PersonDocuments } from '../../../../components/msp/model/person-document.model';
import { yesNoLabels } from '../../../msp-core/models/msp-constants';
import { nameChangeSupportDocuments } from '../../../msp-core/components/support-documents/support-documents.component';
import { AbstractForm } from 'moh-common-lib';
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(PersonalDetailsComponent) personalDetailsComponent: QueryList<
    PersonalDetailsComponent
  >;

  yesNoRadioLabels = yesNoLabels;
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
        this.form.valueChanges.subscribe(() => { this.dataService.saveMspApplication(); })
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

    if ( document.images.length === 0 ) {
      // no status documents remove any name documents
      this.applicant.nameChangeDocs.documentType = null;
      this.applicant.nameChangeDocs.images = [];
    }

    this.applicant.documents = document;
  }

  get hasStatus() {
    // Has to have values
    return this.applicant.status !== undefined &&
           this.applicant.currentActivity !== undefined;
  }

  get requestNameChangeInfo() {
    return this.hasStatus && this.applicant.hasNameChange && this.statusDocuments.images.length;
  }


  canContinue(): boolean {
    let valid = super.canContinue() &&
                (this.statusDocuments.images && this.statusDocuments.images.length > 0);
    if ( this.applicant.hasNameChange ) {
      valid = valid &&
              (this.applicant.nameChangeDocs.images && this.applicant.nameChangeDocs.images.length > 0);
    }
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
    }else{
      this.pageStateService.setPageComplete(this.router.url, this.dataService.mspApplication.pageStatus);
      this.navigate(ROUTES_ENROL.SPOUSE_INFO.fullpath);
    }
  }








  documentsReady(): boolean {
    return this.dataService.mspApplication.documentsReady;
  }

  // fix for DEF-90
  isStayinginBCAfterstudies(): boolean {
    let stayingInBc = true;
    if (this.personalDetailsComponent) {
      // initial page load..empty object
      this.personalDetailsComponent.forEach(personalDetailsComponent => {
        if (personalDetailsComponent && personalDetailsComponent.person) {
          //dependent can be empty object..ignore them

          const currentApplicant: MspPerson = personalDetailsComponent.person;
          if (
            currentApplicant.status === StatusInCanada.CitizenAdult ||
            currentApplicant.status === StatusInCanada.PermanentResident
          ) {
            if (
              currentApplicant.fullTimeStudent &&
              currentApplicant.inBCafterStudies === false
            ) {
              stayingInBc = false;
            }
          }
        }
      });
    }

    return stayingInBc;
  }

  isValid(): boolean {
    return this.dataService.mspApplication.isUniquePhns;
  }

  checkAnyDependentsIneligible(): boolean {
    const target = [
      this.dataService.mspApplication.applicant,
      this.dataService.mspApplication.spouse,
      ...this.dataService.mspApplication.children
    ];
    return target.filter(x => x).filter(x => x.ineligibleForMSP).length >= 1;
  }
}
