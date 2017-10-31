import { ChangeDetectorRef, Component, Injectable, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NgForm } from "@angular/forms";
import { MspDataService } from '../../service/msp-data.service';
import { Router } from '@angular/router';
import { BaseComponent } from "../../common/base.component";
import { ProcessService } from "../../service/process.service";
import { LocalStorageService } from 'angular-2-local-storage';
import { AccountPersonalDetailsComponent } from '../personal-info/personal-details/personal-details.component'
import { AddDependentComponent } from '../add-dependents/add-dependents.component';
import { RemoveDependentComponent } from '../remove-dependents/remove-dependents.component';
import { Person , } from '../../model/application.model';
import {OperationActionType} from "../../model/person.model";
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
  /** Due to a very strange bug, we need to break this out to a separate variable.  All it does is disable the button to add a new spouse. */
  public disableSpouseButton: boolean = false;


  @ViewChild('formRef') form: NgForm;
  @ViewChildren(AccountPersonalDetailsComponent) personalDetailsComponent: QueryList<AccountPersonalDetailsComponent>;
  @ViewChildren(AddDependentComponent) addDepsComponent: QueryList<AddDependentComponent>;
  @ViewChildren(RemoveDependentComponent) removeDepsComponent: QueryList<RemoveDependentComponent>;
  


  constructor(private dataService: MspDataService,
    private _router: Router,
    private _processService: ProcessService,
    private cd: ChangeDetectorRef, private localStorageService: LocalStorageService) {

    super(cd);
  }

  ngOnInit() { 
    // TODO TODO RE-ENABLE! DEV ONLY
    // this.initProcessMembers( this._processService.getStepNumber(ProcessUrls.ACCOUNT_DEPENDENTS_URL), this._processService);    
  }

  /** Only show personal info section if it the applicant has not selected the Personal Info Update option, because if so they've already filled out this section. */
  get showPersonalInfo(): boolean {
    return !(this.dataService.getMspAccountApp().accountChangeOptions.personInfoUpdate);
  }

  get person(): Person {
    return this.dataService.getMspAccountApp().applicant;
  }

  onChange() {
    this.dataService.saveMspAccountApp();
  }

  canContinue(): boolean {
    return this.isAllValid();
  }


  //TODO - Just has temp solution for now, need better approach for dynamic pages with processSteps.
  continue(): void {

    //Note - Maybe add new method to process service? `setStepForUrl(url, boolean)`
    this._processService.process.processSteps.forEach((val, i) => {
      if (val.route.indexOf("dependent-change") > -1) {
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
    this.addedPersons.push(sp);
    this.spouse = sp; 

    //Due to a strange bug we have to wrap this in a setTimeout. Otherwise, when we disable the button it breaks BaseComponent validation logic (specifically validationMap doesn't update).
    setTimeout(() => {
      this.disableSpouseButton = true;
      this.cd.detectChanges();
    }, 0)
  }
  
  /** Add a child to the account */
  addChild(relationship: Relationship){
    const child = new Person(relationship,OperationActionType.Add);
    this.addedPersons.push(child);
    this.children.push(child);
  }
  
  /** Clears (or deletes) a dependent that the user had added to the form, e.g. by mistake. Spouse or children. */
  clearDependent(dependent: Person){
    this.addedPersons = this.addedPersons
    .filter(x => x !== dependent);

    if (dependent.relationship === Relationship.Spouse){
      this.spouse = null;
      this.disableSpouseButton = false;
    }

    this.children = this.children
    .filter(x => x !== dependent);
  }

  clearDependentRemoval(dependent: Person){
    this.removedPersons = this.removedPersons
    .filter(x => x !== dependent);

    if (dependent.relationship === Relationship.Spouse){
      this.removedSpouse = null;
    }

    this.removedChildren = this.removedChildren
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
    //By default these are "British Columbia" and "Canada", but we don't want form fields pre-populated here as it isn't specified in the FDS.
    sp.residentialAddress.province = null;
    sp.residentialAddress.country = null;

    this.removedPersons.push(sp);
    this.removedSpouse = sp;
  }

  /**
   * The account holder wishes to remove a child or dependent from their
   * account. For when a dependent already exists on the account. This is ***not
   * to be confused with deleting or cancelling adding a new dependent to the
   * account***, for that look at `clearDependents()`.
   */
  removeChild(){
    const child = new Person(Relationship.ChildUnder24,OperationActionType.Remove);
    //By default these are "British Columbia" and "Canada", but we don't want form fields pre-populated here as it isn't specified in the FDS.
    child.residentialAddress.province = null;
    child.residentialAddress.country = null;

    this.removedPersons.push(child);
    this.removedChildren.push(child);
  }

  /** Spouse to be added to the account. */
  get spouse(): Person {
    return this.dataService.getMspAccountApp().addedSpouse;
  }

  set spouse(sp: Person) {
    this.dataService.getMspAccountApp().addedSpouse = sp;
  }

  get children(): Person[] {
    return this.dataService.getMspAccountApp().addedChildren;
  }

  set children(val: Person[]) {
    this.dataService.getMspAccountApp().addedChildren = val;
  }

  get removedChildren(): Person[] {
    return this.dataService.getMspAccountApp().removedChildren;
  }

  set removedChildren(val: Person[]) {
    this.dataService.getMspAccountApp().removedChildren = val;
  }

  /** Spouse to be removed from the account. */
  get removedSpouse(): Person {
    return this.dataService.getMspAccountApp().removedSpouse;
  }

  set removedSpouse(value: Person) {
    this.dataService.getMspAccountApp().removedSpouse = value;
  }

}