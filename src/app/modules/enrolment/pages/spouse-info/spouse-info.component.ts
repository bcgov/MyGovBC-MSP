import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ProcessService} from '../../../../services/process.service';
import {BaseComponent} from '../../../../models/base.component';
import { Router } from '@angular/router';
import {MspApplication, MspPerson} from '../../models/application.model';
import { MspDataService } from '../../../../services/msp-data.service';
import {Relationship} from '../../../msp-core/models/status-activities-documents';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';

@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html',
  styleUrls: ['./spouse-info.component.scss']
})
export class SpouseInfoComponent extends BaseComponent implements OnInit {
  static ProcessStepNum = 2;
  lang = require('./i18n');
  Relationship: typeof Relationship = Relationship;
  public buttonClass: string = 'btn btn-primary';


  constructor(private dataService: MspDataService, private _router: Router, private _processService: ProcessService, private cd: ChangeDetectorRef) {
      super(cd);
  }

  ngOnInit() {
    this.initProcessMembers(SpouseInfoComponent.ProcessStepNum, this._processService);
  }

  nextStep(){
    this._processService.setStep(2, true);
    this._router.navigate([ROUTES_ENROL.CHILD_INFO.fullpath]);

  }

  addSpouse = () => {
    const sp: MspPerson = new MspPerson(Relationship.Spouse);
    this.dataService.mspApplication.addSpouse(sp);
  }

  removeSpouse(event: Object): void{
    // console.log('remove spouse ' + JSON.stringify(event));
    this.dataService.mspApplication.removeSpouse();
    this.dataService.saveMspApplication();
  }

  get application(): MspApplication {
    return this.dataService.mspApplication;
  }
  get applicant(): MspPerson {
    return this.dataService.mspApplication.applicant;
  }

  get spouse(): MspPerson {
    return this.dataService.mspApplication.spouse;
  }

  onChange(values: any){
    this.dataService.saveMspApplication();
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
