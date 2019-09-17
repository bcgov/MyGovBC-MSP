import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MspDataService } from '../../../../services/msp-data.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { MspApplication } from '../../models/application.model';
import { PageStateService } from '../../../../services/page-state.service';
import { Relationship } from '../../../msp-core/models/relationship.enum';
import { PersonDocuments } from '../../../../components/msp/model/person-document.model';
import { yesNoLabels } from '../../../msp-core/models/msp-constants';
import { nameChangeSupportDocuments } from '../../../msp-core/components/support-documents/support-documents.component';
import { AbstractForm } from 'moh-common-lib';
import { Subscription } from 'rxjs';

@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html'
})
export class SpouseInfoComponent extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

  statusLabel: string = 'Spouse\'s immigration status in Canada';
  yesNoRadioLabels = yesNoLabels;
  nameChangeDocList = nameChangeSupportDocuments();
  subscriptions: Subscription[];


  constructor( private dataService: MspDataService,
               protected router: Router,
               private pageStateService: PageStateService) {
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

  /**
   * Check if applicant has a spouse, used to enable/disable "add spouse" button
   */
  get hasSpouse(): boolean{
    return this.spouse ? true : false;
  }

  addSpouse() {
    const sp: MspPerson = new MspPerson(Relationship.Spouse);
    this.dataService.mspApplication.addSpouse(sp);
  }

  /**
   * Remove spouse
   */
  removeSpouse(): void{
    this.dataService.mspApplication.removeSpouse();
  }

  get spouse(): MspPerson {
    return this.dataService.mspApplication.spouse;
  }

  get statusDocuments(): PersonDocuments {
    return this.dataService.mspApplication.spouse.documents;
  }

  set statusDocuments( documents: PersonDocuments ) {

    if ( document.images.length === 0 ) {
      // no status documents remove any name documents
      this.spouse.nameChangeDocs.documentType = null;
      this.spouse.nameChangeDocs.images = [];
    }

    this.spouse.documents = documents;
  }

  get hasStatusDocuments(): boolean {
    return this.statusDocuments.images && this.statusDocuments.images.length > 0;
  }

  get hasStatus() {
    // Has to have values
    return this.spouse.status !== undefined &&
           this.spouse.currentActivity !== undefined;
  }

  get requestNameChangeInfo() {
    return this.hasStatus && this.spouse.hasNameChange && this.hasStatusDocuments;
  }

  get hasNameDocuments(): boolean {
    return this.spouse.nameChangeDocs.images && this.spouse.nameChangeDocs.images.length > 0;
  }

  get requestPersonalInfo(): boolean {
    return this.hasStatus && this.hasStatusDocuments &&
           ( this.spouse.hasNameChange === false || // No name change
            ( this.spouse.hasNameChange && this.hasNameDocuments )); // name change requires documentation
  }


  continue() {
    this.navigate(ROUTES_ENROL.CHILD_INFO.fullpath);
  }

  canContinue(): boolean {
    let valid = true;

    if ( this.hasSpouse ) {
      valid = super.canContinue() && this.hasStatusDocuments;
      if ( this.spouse.hasNameChange ) {
        valid = valid && this.hasNameDocuments;
      }
    }
    return valid;
  }






  documentsReady(): boolean {
    return this.dataService.mspApplication.spouseDocumentsReady;
  }

  checkAnyDependentsIneligible(): boolean {
    const target = [this.dataService.mspApplication.applicant, this.dataService.mspApplication.spouse , ...this.dataService.mspApplication.children];
    return target.filter(x => x)
        .filter(x => x.ineligibleForMSP).length >= 1;
  }



}
