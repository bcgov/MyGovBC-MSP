import { Router } from '@angular/router';
import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../msp-core/models/relationship.enum';
import { yesNoLabels } from '../../../msp-core/models/msp-constants';
import { nameChangeSupportDocuments } from '../../../msp-core/components/support-documents/support-documents.component';
import { AbstractForm } from 'moh-common-lib';
import { Subscription } from 'rxjs';

@Component({
  selector: 'msp-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.scss']
})
export class ChildInfoComponent extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

  statusLabel: string = 'Child\'s immigration status in Canada';
  childAgeCategory = [
    {'label': '0-18 years', 'value': Relationship.ChildUnder19},
    {'label': '19-24 years (must be a full-time student)', 'value': Relationship.Child19To24},
  ];

  yesNoRadioLabels = yesNoLabels;
  nameChangeDocList = nameChangeSupportDocuments();
  subscriptions: Subscription[];


  // tslint:disable-next-line: no-trailing-whitespace
  constructor (private dataService: MspDataService, 
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

  addChild(): void {
    this.dataService.mspApplication.addChild(Relationship.Unknown);
  }

  get children(): MspPerson[] {
    return this.dataService.mspApplication.children;
  }

  removeChild(idx: number): void {
    this.dataService.mspApplication.removeChild(idx);
  }

  displayStatusOpt(idx: number): boolean {
    return this.children[idx].relationship !== Relationship.Unknown;
  }

  statusDocUpdate($event, idx: number) {
    this.children[idx].documents = $event;

    if ( this.children[idx].documents.images.length === 0 ) {
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


  requestNameChangeInfo( idx: number ) {
    return this.hasStatus( idx ) &&
           this.children[idx].hasNameChange &&
           this.children[idx].documents.images.length;
  }

  continue(){
    this.pageStateService.setPageComplete(this.router.url, this.dataService.mspApplication.pageStatus);
    this.navigate(ROUTES_ENROL.CONTACT.fullpath);
  }

  canContinue(): boolean {
    return super.canContinue() &&
                this.children.map( x => x.documents.images.length === 0).filter(itm => itm === true).length === 0 &&
                this.children.map( x => {
                  if ( x.hasNameChange ) {
                    return x.nameChangeDocs.images.length === 0;
                  }
                }).filter(itm => itm === true).length === 0;

  }

  setRelationship( $event, idx: number ) {
    this.children[idx].relationship = Number($event);
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
