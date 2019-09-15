import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {BaseComponent} from '../../../../models/base.component';
import { Router } from '@angular/router';
import { MspDataService } from '../../../../services/msp-data.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { MspApplication } from '../../models/application.model';
import { PageStateService } from '../../../../services/page-state.service';
import { Relationship } from '../../../msp-core/models/relationship.enum';
import { PersonDocuments } from '../../../../components/msp/model/person-document.model';
import { yesNoLabels } from '../../../msp-core/models/msp-constants';

@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html',
  styleUrls: ['./spouse-info.component.scss']
})
export class SpouseInfoComponent extends BaseComponent implements OnInit {

  statusLabel: string = 'Spouse\'s immigration status in Canada';
  hasNameChange: boolean = undefined;
  yesNoRadioLabels = yesNoLabels;


  constructor( private dataService: MspDataService,
               private _router: Router,
               private pageStateService: PageStateService,
               private cd: ChangeDetectorRef) {
      super(cd);
  }

  ngOnInit() {
    this.pageStateService.setPageIncomplete(this._router.url, this.dataService.mspApplication.pageStatus);
  }

  /**
   * Check if applicant has a spouse, used to enable/disable "add spouse" button
   */
  get hasSpouse(): boolean{
    return this.spouse ? true : false;
  }

  nextStep() {

    this._router.navigate([ROUTES_ENROL.CHILD_INFO.fullpath]);
  }

  addSpouse() {
    const sp: MspPerson = new MspPerson(Relationship.Spouse);
    this.dataService.mspApplication.addSpouse(sp);
    this.dataService.saveMspApplication();
  }

  /**
   * Remove spouse
   */
  removeSpouse(): void{
    this.dataService.mspApplication.removeSpouse();
    this.dataService.saveMspApplication();
  }

  get application(): MspApplication {
    return this.dataService.mspApplication;
  }

  get spouse(): MspPerson {
    return this.dataService.mspApplication.spouse;
  }

  onChange(values: any) {
    this.dataService.saveMspApplication();
  }

  get statusDocuments(): PersonDocuments {
    return this.dataService.mspApplication.spouse.documents;
  }

  set statusDocuments( documents: PersonDocuments ) {
    this.dataService.mspApplication.spouse.documents = documents;
  }

  statusDocUpdate($event) {
    this.statusDocuments = $event;
    this.dataService.saveMspApplication();
  }

  get hasStatus() {
    return this.spouse.status !== undefined && this.spouse.currentActivity;
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
