import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';
import { nameChangeSupportDocuments } from '../../../msp-core/components/support-documents/support-documents.component';
import { StatusInCanada } from '../../../msp-core/models/canadian-status.enum';
import { EnrolForm } from '../../models/enrol-form';

@Component({
  selector: 'msp-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.scss']
})
export class ChildInfoComponent extends EnrolForm {

  statusLabel: string = 'Child\'s immigration status in Canada';
  childAgeCategory = [
    {label: '0-18 years', value: Relationship.ChildUnder19},
    {label: '19-24 years (must be a full-time student)', value: Relationship.Child19To24},
  ];

  nameChangeDocList = nameChangeSupportDocuments();

  constructor( protected dataService: MspDataService,
               protected pageStateService: PageStateService,
               protected router: Router ) {
    super( dataService, pageStateService, router );
  }

  addChild(): void {
    this.mspApplication.addChild(Relationship.Unknown);
  }

  get children(): MspPerson[] {
    return this.mspApplication.children;
  }

  removeChild(idx: number): void {
    this.mspApplication.removeChild(idx);
  }

  displayStatusOpt(idx: number): boolean {
    return this.children[idx].relationship !== Relationship.Unknown;
  }

  statusDocUpdate($event, idx: number) {
    this.children[idx].documents = $event;

    if ( this.children[idx].documents && this.children[idx].documents.images.length === 0 ) {
      // no status documents remove any name documents
      this.children[idx].nameChangeDocs.documentType = null;
      this.children[idx].nameChangeDocs.images = [];
    }
  }

  hasStatus( idx: number ) {
    // Has to have values
    return this.children[idx].status !== undefined &&
           this.children[idx].currentActivity !== undefined;
  }

  hasStatusDocuments( idx: number ): boolean {
    return this.children[idx].documents.images && this.children[idx].documents.images.length > 0;
  }


  requestNameChangeInfo( idx: number ) {
    return this.hasStatus( idx ) &&
           this.children[idx].hasNameChange &&
           this.hasStatusDocuments( idx );
  }

  isOveragedChild(idx: number ) {
    return this.children[idx].relationship === Relationship.Child19To24;
  }

  continue() {
    this._nextUrl = ROUTES_ENROL.CONTACT.fullpath;
    this._canContinue = this.canContinue();
    super.continue();
  }

  canContinue(): boolean {
    let valid = true;
    if ( this.children.length > 0 ) {
      valid = super.canContinue() &&
                this.children.map( x => {
                  let childValid = x.madePermanentMoveToBC &&
                                   (x.documents.images && x.documents.images.length > 0);
                  if (x.hasNameChange){
                    childValid = childValid &&
                                 x.nameChangeDocs.images &&
                                 x.nameChangeDocs.images.length > 0;
                  }

                  if ( x.relationship === Relationship.Child19To24 ) {
                    childValid = childValid && x.inBCafterStudies;
                  }
                  return valid;
                }).filter(itm => itm === true).length === this.children.length;

    }
    return valid;
  }

  setRelationship( $event, idx: number ) {
    this.children[idx].relationship = Number($event);
  }

  hasNameDocuments( idx: number ): boolean {
    return this.children[idx].nameChangeDocs.images && this.children[idx].nameChangeDocs.images.length > 0;
  }

  requestPersonalInfo( idx: number ): boolean {
    return this.hasStatus( idx ) && this.hasStatusDocuments( idx ) &&
           ( this.children[idx].hasNameChange === false || // No name change
            ( this.children[idx].hasNameChange && this.hasNameDocuments( idx ) )); // name change requires documentation
  }

  isTemporaryResident(idx: number) {
    return this.children[idx].status === StatusInCanada.TemporaryResident;
  }






  checkAnyDependentsIneligible(): boolean {
    const target = [...this.dataService.mspApplication.children];
    return target.filter(x => x)
        .filter(x => x.ineligibleForMSP).length >= 1;
  }

  documentsReady(): boolean {
    return this.dataService.mspApplication.childDocumentsReady;
  }

}
