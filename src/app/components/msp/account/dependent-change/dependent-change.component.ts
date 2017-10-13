import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { MspDataService } from '../../service/msp-data.service';
import { Router } from '@angular/router';
import { BaseComponent } from "../../common/base.component";
import { ProcessService } from "../../service/process.service";
import { LocalStorageService } from 'angular-2-local-storage';

import { Person } from '../../model/application.model';
import { Relationship } from '../../model/status-activities-documents';

@Component({
  templateUrl: './dependent-change.component.html',
  styleUrls: ['./dependent-change.component.scss']
})
@Injectable()
export class AccountDependentChangeComponent extends BaseComponent {

  static ProcessStepNum = 1;
  lang = require('./i18n');


  constructor(private dataService: MspDataService,
    private _router: Router,
    private _processService: ProcessService,
    private cd: ChangeDetectorRef, private localStorageService: LocalStorageService) {

    super(cd);
  }

  ngOnInit() {
    // this.initProcessMembers(AccountDependentChangeComponent.ProcessStepNum, this._processService);
  }

  get person(): Person {
    return this.dataService.getMspAccountApp().applicant;
  }

  onChange() {
    console.log('dependent-change onChange, saving account');
    /**
     * NOT WORKING! THIS IS NOT SAVING `addedSpouse`
     * I believe the MspAccountDto doesn't handle the `addedSpouse` field,
     * but does for updatedSpouse.  Discuss with Saravan. TODO.
     */
    this.dataService.saveMspAccountApp();
  }

  canContinue(): boolean {
    return true;
  }

  addSpouse() {
    this.dataService.getMspAccountApp().addedSpouse =  new Person(Relationship.Spouse);
  }
  clearSpouse(){
    this.dataService.getMspAccountApp().addedSpouse = null;
  }
  
  get spouse(): Person {
    return this.dataService.getMspAccountApp().addedSpouse;
  }



  get spouseRemoval(): Person {
    return this.dataService.getMspAccountApp().removedSpouse;
  }
  get children(): Person[] {
    return this.dataService.getMspAccountApp().children;
  }


}