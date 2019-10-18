import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MspDataService } from '../../../../services/msp-data.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { PageStateService } from '../../../../services/page-state.service';
import { Relationship } from '../../../../models/relationship.enum';
import { SupportDocuments } from '../../../msp-core/models/support-documents.model';
import { nameChangeSupportDocuments } from '../../../msp-core/components/support-documents/support-documents.component';
import { EnrolForm } from '../../models/enrol-form';
import { StatusInCanada } from '../../../msp-core/models/canadian-status.enum';
import { EnrolDataService } from '../../services/enrol-data.service';

@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html'
})
export class SpouseInfoComponent extends EnrolForm {

  statusLabel: string = 'Spouse\'s immigration status in Canada';
  nameChangeDocList = nameChangeSupportDocuments();

  constructor( protected router: Router,
               protected dataService: MspDataService,
               protected enrolDataService: EnrolDataService,
               protected pageStateService: PageStateService ) {
    super( dataService, enrolDataService, pageStateService, router );
  }

  /**
   * Check if applicant has a spouse, used to enable/disable "add spouse" button
   */
  get hasSpouse(): boolean{
    return this.spouse ? true : false;
  }

  addSpouse() {
    const sp: MspPerson = new MspPerson(Relationship.Spouse);
    this.mspApplication.addSpouse(sp);
  }

  /**
   * Remove spouse
   */
  removeSpouse(): void{
    this.mspApplication.removeSpouse();
  }

  get spouse(): MspPerson {
    return this.mspApplication.spouse;
  }

  get statusDocuments(): SupportDocuments {
    return this.mspApplication.spouse.documents;
  }

  set statusDocuments( documents: SupportDocuments ) {

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
    return !!(this.hasStatus && this.hasStatusDocuments &&
             ( this.spouse.hasNameChange === false || // No name change
             ( this.spouse.hasNameChange && this.hasNameDocuments ))); // name change requires documentation
  }

  get isTemporaryResident() {
    return this.spouse.status === StatusInCanada.TemporaryResident;
  }

  continue() {
    this._nextUrl = ROUTES_ENROL.CHILD_INFO.fullpath;
    this._canContinue = this.canContinue();
    super.continue();
  }

  canContinue(): boolean {

    let valid = true;

    if ( this.hasSpouse ) {
      valid = super.canContinue() && this.hasStatusDocuments;

      // If not temporary resident needs to have moved permenently to BC
      if ( !this.isTemporaryResident ) {
        valid = valid && this.spouse.madePermanentMoveToBC;
      }

      if ( this.spouse.hasNameChange ) {
        valid = valid && this.hasNameDocuments;
      }
    }
    return valid;
  }
}
