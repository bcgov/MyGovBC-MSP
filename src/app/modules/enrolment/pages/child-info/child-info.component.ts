import { Router } from '@angular/router';
import {Component, ChangeDetectorRef, OnInit} from '@angular/core';

// import {MspDataService} from '../../service/msp-data.service';
import { MspDataService } from '../../../../services/msp-data.service';
import {BaseComponent} from '../../../../models/base.component';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../msp-core/models/relationship.enum';

@Component({
  selector: 'msp-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.scss']
})
export class ChildInfoComponent extends BaseComponent implements OnInit {

  statusLabel: string = 'Child\'s immigration status in Canada';
  childAgeCategory = [
    {'label': '0-18 years', 'value': Relationship.ChildUnder19},
    {'label': '19-24 years (must be a full-time student)', 'value': Relationship.Child19To24},
  ];


  // tslint:disable-next-line: no-trailing-whitespace
  constructor (private dataService: MspDataService, 
               private _router: Router,
               private pageStateService: PageStateService,
               cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit() {
    this.pageStateService.setPageIncomplete(this._router.url, this.dataService.mspApplication.pageStatus);
  }

  nextStep(){
    this.pageStateService.setPageComplete(this._router.url, this.dataService.mspApplication.pageStatus);
    this._router.navigate([ROUTES_ENROL.CONTACT.fullpath]);

  }

  addChild(): void {
    // Default to child under 19 years (constructor for MspPerson requires relationship)
    this.dataService.mspApplication.addChild(Relationship.Unknown);
  }

  get children(): MspPerson[] {
    return this.dataService.mspApplication.children;
  }

  removeChild(idx: number): void {
    this.dataService.mspApplication.removeChild(idx);
    this.dataService.saveMspApplication();

  }

  onChange() {
    this.dataService.saveMspApplication();
  }

  onRelationshipUpdate($event, idx: number) {
    this.children[idx].relationship = $event;
    this.dataService.saveMspApplication();
  }

  displayStatusOpt(idx: number): boolean {
    return this.children[idx].relationship !== Relationship.Unknown;
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
