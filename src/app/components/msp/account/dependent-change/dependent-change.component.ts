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
  Relationship: typeof Relationship = Relationship;

  /** A list of all dependents that the applicant wants to add, modify, remove, etc. Each one should correspond to an open section in the form visible to the user. */
  changedDependents: Person[] = [];


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

  /** Add a spouse to the account. */
  addSpouse() {
    const sp = new Person(Relationship.Spouse);
    this.spouse = sp;
    this.changedDependents.push(sp);
  }
  
  /** Add a child to the account */
  addChild(relationship: Relationship){
    const child = new Person(relationship);
    this.changedDependents.push(child);
  }
  
  /** Remove a dependent that the user had added to the form, e.g. by mistake. Spouse or children. */
  clearDependent(dependent){
    this.changedDependents = this.changedDependents
    .filter(x => x !== dependent);

    if (dependent.relationship === Relationship.Spouse){
      this.spouse = null;
    }
  }
  
  get spouse(): Person {
    return this.dataService.getMspAccountApp().addedSpouse;
  }

  set spouse(sp: Person) {
    this.dataService.getMspAccountApp().addedSpouse = sp;
  }

  get children(): Person[] {
    return this.dataService.getMspAccountApp().children;
  }


  // TODO!
  get spouseRemoval(): Person {
    return this.dataService.getMspAccountApp().removedSpouse;
  }


}