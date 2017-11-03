import {ChangeDetectorRef, Component, Injectable, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MspDataService} from '../../service/msp-data.service';
import {Router} from '@angular/router';
import {BaseComponent} from "../../common/base.component";
import {ProcessService} from "../../service/process.service";
import {LocalStorageService} from 'angular-2-local-storage';
import {AccountPersonalDetailsComponent} from '../personal-info/personal-details/personal-details.component'
import {AddDependentComponent} from '../add-dependents/add-dependents.component';
import {RemoveDependentComponent} from '../remove-dependents/remove-dependents.component';
import {Person,} from '../../model/application.model';
import {OperationActionType} from "../../model/person.model";
import {Relationship} from '../../model/status-activities-documents';
import {ProcessUrls} from '../../service/process.service'

@Component({
    templateUrl: './dependent-change.component.html',
    styleUrls: ['./dependent-change.component.scss']
})
@Injectable()
export class AccountDependentChangeComponent extends BaseComponent {

    static ProcessStepNum = 1;
    lang = require('./i18n');
    Relationship: typeof Relationship = Relationship;

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
        this.initProcessMembers(this._processService.getStepNumber(ProcessUrls.ACCOUNT_DEPENDENTS_URL), this._processService);
    }

    /** Only show personal info section if it the applicant has not selected the Personal Info Update option, because if so they've already filled out this section.statusUpdate also brings this session */
    get showPersonalInfo(): boolean {
        return !(this.dataService.getMspAccountApp().accountChangeOptions.personInfoUpdate || this.dataService.getMspAccountApp().accountChangeOptions.statusUpdate);
    }

    get person(): Person {
        return this.dataService.getMspAccountApp().applicant;
    }

    onChange() {
        this.dataService.saveMspAccountApp();
    }

    //the buttons will be disabled till all the fields in the form is valid
    canAddOrRemoveDepdents(): boolean {
        return !this.isAllValid();
    }

    canContinue(): boolean {

        if (this.dataService.getMspAccountApp().hasAnyVisitorInApplication()) {
            return false;
        }
        //enable the buttons only when atleast one Dependent is added/removed..This makes sure the request is meaningful
        let atleastOneDepedentAddedOrRemoved: boolean = !!this.removedSpouse || !!this.addedSpouse || this.addedChildren.length > 0 || this.removedChildren.length > 0;

        // Enable the button if the form is not filled in yet
        return !this.isAllValid() || atleastOneDepedentAddedOrRemoved;
    }


    continue(): void {
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
        // this.addedPersons.push(sp);
        this.addedSpouse = sp;
        this.cd.detectChanges();
    }

    /** Add a child to the account */
    addChild(relationship: Relationship) {
        const child = new Person(relationship, OperationActionType.Add);
        this.addedChildren.push(child);
    }


    clearAddedSpouse() {
        this.addedSpouse = null;
        this.dataService.saveMspAccountApp();
    }

    clearRemovedSpouse() {
        this.removedSpouse = null;
        this.dataService.saveMspAccountApp();
    }


    clearRemovedChild(dependent: Person) {

        this.removedChildren = this.removedChildren
            .filter(x => x !== dependent);
    }

    clearAddedChild(dependent: Person) {

        this.addedChildren = this.addedChildren
            .filter(x => x !== dependent);
    }


    /**
     * The account holder wishes to remove a spouse from their account.  For when
     * a spouse already exists on the account and the accout holder is changing
     * that. This is ***not to be confused with deleting or cancelling adding a
     * new spouse*** to the account, for that look at methods starting with clear.
     */
    removeSpouse() {
        const sp = new Person(Relationship.Spouse);
        //By default these are "British Columbia" and "Canada", but we don't want form fields pre-populated here as it isn't specified in the FDS.
        sp.residentialAddress.province = null;
        sp.residentialAddress.country = null;

        this.removedSpouse = sp;
    }

    /**
     * The account holder wishes to remove a child or dependent from their
     * account. For when a dependent already exists on the account. This is ***not
     * to be confused with deleting or cancelling adding a new dependent to the
     * account***,  for that look at methods starting with clear.
     */
    removeChild() {
        const child = new Person(Relationship.ChildUnder24, OperationActionType.Remove);
        //By default these are "British Columbia" and "Canada", but we don't want form fields pre-populated here as it isn't specified in the FDS.
        child.residentialAddress.province = null;
        child.residentialAddress.country = null;
        this.removedChildren.push(child);
    }

    get addedSpouse(): Person {
        return this.dataService.getMspAccountApp().addedSpouse;
    }

    set addedSpouse(sp: Person) {
        this.dataService.getMspAccountApp().addedSpouse = sp;
    }

    get removedSpouse(): Person {
        return this.dataService.getMspAccountApp().removedSpouse;
    }

    set removedSpouse(sp: Person) {
        this.dataService.getMspAccountApp().removedSpouse = sp;
    }


    get addedChildren(): Person[] {
        return this.dataService.getMspAccountApp().addedChildren;
    }

    set addedChildren(val: Person[]) {
        this.dataService.getMspAccountApp().addedChildren = val;
    }

    get removedChildren(): Person[] {
        return this.dataService.getMspAccountApp().removedChildren;
    }

    set removedChildren(val: Person[]) {
        this.dataService.getMspAccountApp().removedChildren = val;
    }


}