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
  static ProcessStepNum = 3;
  Relationship: typeof Relationship = Relationship;
  public buttonClass: string = 'btn btn-default';

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

  addChild(relationship: Relationship): void {
    this.dataService.mspApplication.addChild(relationship);
  }

  get children(): MspPerson[] {
    console.log(this.dataService.mspApplication.children);
    return this.dataService.mspApplication.children;
  }

  removeChild(idx: number): void{
    // console.log('remove child ' + JSON.stringify(event));
    this.dataService.mspApplication.removeChild(idx);
    this.dataService.saveMspApplication();

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
