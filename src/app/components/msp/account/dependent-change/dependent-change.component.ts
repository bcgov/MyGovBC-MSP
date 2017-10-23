import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { MspDataService } from '../../service/msp-data.service';
import { Router } from '@angular/router';
import { BaseComponent } from "../../common/base.component";
import { ProcessService } from "../../service/process.service";
import { LocalStorageService } from 'angular-2-local-storage';

import { Person } from '../../model/application.model';
import { Relationship } from '../../model/status-activities-documents';
import { ProcessUrls } from '../../service/process.service'

@Component({
  templateUrl: './dependent-change.component.html',
  styleUrls: ['./dependent-change.component.scss']
})
@Injectable()
export class AccountDependentChangeComponent extends BaseComponent {

  static ProcessStepNum = 1;
  lang = require('./i18n');
  Relationship: typeof Relationship = Relationship;

  /** A list of all spouses or dependents that the applicant wants to add. Each should correspond to an open section in the form visible to the user. */
  addedPersons: Person[] = [];
  /** List of all spouses or dependents that applicant wants to remove. Each corresponds to an open section of the form visible to the user.  */
  removedPersons: Person[] = [];
  


  constructor(private dataService: MspDataService,
    private _router: Router,
    private _processService: ProcessService,
    private cd: ChangeDetectorRef, private localStorageService: LocalStorageService) {

    super(cd);
  }

  ngOnInit() {
    this.initProcessMembers( this._processService.getStepNumber(ProcessUrls.ACCOUNT_DEPENDENTS_URL), this._processService);
  }

  get person(): Person {
    return this.dataService.getMspAccountApp().applicant;
  }

  onChange() {
    /**
     * NOT WORKING! THIS IS NOT SAVING `addedSpouse`
     * I believe the MspAccountDto doesn't handle the `addedSpouse` field,
     * but does for updatedSpouse.  Discuss with Saravan. TODO.
     */
    this.dataService.saveMspAccountApp();
  }

  //TODO
  canContinue(): boolean {
    return true;
  }

  //TODO
  hasAnyInvalidStatus(): boolean {
    return false;
  }

  //TODO!
  continue(): void {

    //DEV TODO - Just temporarily set this step as completed
    //Note - Maybe add new method to process service? `setStepForUrl(url, boolean)`
    this._processService.process.processSteps.forEach((val, i) => {
      if (val.route.indexOf("dependent-change") > -1){
        this._processService.setStep(i, true);
      } 
    })


    if (!this.isAllValid()) {
      console.log('Please fill in all required fields on the form.');
    } else {
      console.log('redirecting to' + this._processService.getNextStep());
      this._router.navigate([this._processService.getNextStep()]);
    }
  }

  /** Add a spouse to the account. */
  addSpouse() {
    const sp = new Person(Relationship.Spouse);
    this.spouse = sp;
    this.addedPersons.push(sp);
  }
  
  /** Add a child to the account */
  addChild(relationship: Relationship){
    const child = new Person(relationship);
    this.addedPersons.push(child);
    this.children.push(child);
  }
  
  /** Clears (or deletes) a dependent that the user had added to the form, e.g. by mistake. Spouse or children. */
  clearDependent(dependent){
    this.addedPersons = this.addedPersons
    .filter(x => x !== dependent);

    if (dependent.relationship === Relationship.Spouse){
      //ARC TODO - Need to verify if this is ADDED spouse or REMOVED spouse? (use id)
      this.spouse = null;
    }

    this.children = this.children
    .filter(x => x !== dependent);
  }


  /**
   * The account holder wishes to remove a spouse from their account.  For when
   * a spouse already exists on the account and the accout holder is changing
   * that. This is ***not to be confused with deleting or cancelling adding a
   * new spouse*** to the account, for that look at `clearDependents()`.
   */
  removeSpouse(){
    const sp = new Person(Relationship.Spouse);
    this.removedPersons.push(sp);
    this.removedSpouse = sp;
    console.log('removeSpouse done');
  }

  /**
   * The account holder wishes to remove a child or dependent from their
   * account. For when a dependent already exists on the account. This is ***not
   * to be confused with deleting or cancelling adding a new dependent to the
   * account***, for that look at `clearDependents()`.
   */
  removeChild(){
    console.log('removeChild todo. What relationship?');

  }

  /** Spouse to be added to the account. */
  get spouse(): Person {
    return this.dataService.getMspAccountApp().addedSpouse;
  }

  set spouse(sp: Person) {
    this.dataService.getMspAccountApp().addedSpouse = sp;
  }

  get children(): Person[] {
    return this.dataService.getMspAccountApp().children;
  }

  set children(val: Person[]) {
    this.dataService.getMspAccountApp().children = val;
  }



  /** Spouse to be removed from the account. */
  get removedSpouse(): Person {
    return this.dataService.getMspAccountApp().removedSpouse;
  }

  set removedSpouse(value: Person) {
    this.dataService.getMspAccountApp().removedSpouse = value;
  }

}