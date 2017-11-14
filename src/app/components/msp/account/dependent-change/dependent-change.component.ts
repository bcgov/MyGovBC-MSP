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

    showError: boolean = false;
    showErrorAddress: boolean = true;

    /*   almost same as showError.But this is for warning message text and this will be start to false when user starts to input some values so that text will be hidden. Can be replaced with showError if the warning message need not to be hidden*/
    showMandatoryFieldsWarning: boolean = false;

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
        this.showMandatoryFieldsWarning = false;
        this.emitIsFormValid();

    }

    /**
     * If applicant address is invalid And user selects 'No' for Known mailing address question of Removed Spouse  ;show this warning
     * @returns {boolean}
     */
    get showAddressWarning(): boolean {

        if (this.addedSpouse || this.addedChildren.length > 0 || this.removedChildren.length > 0) {
            return false;
        }

        if (!this.person.residentialAddress.isValid && this.removedSpouse && this.removedSpouse.knownMailingAddress === false) {
            return true;
        }
        return false;
    }

    /*
    Except for Removal of Spouse ; All fields should be valid and Resident Address Should also be validated.
    Resident address validation is done manually since its not includes in the viewChildren
     */
    canAddOrRemoveDepdents(): boolean {
        let canAdd: boolean = this.isAllValid() && this.person.residentialAddress.isValid;
        this.showError = !canAdd;
        this.showErrorAddress = true;
        this.showMandatoryFieldsWarning = this.showError;
        //    this.cd.detectChanges();
        return canAdd;
    }

    //the buttons will be disabled till all the fields in the form is valid
    canRemoveSpouse(): boolean {
        let canAdd: boolean = this.isAllValid();
        this.showError = !canAdd;
        this.showMandatoryFieldsWarning = !canAdd;
        ;
        this.showErrorAddress = false;

        return canAdd;
    }

    canContinue(): boolean {
        //Address Warning implies Request is missing the Address..So dont proceed
        if (this.showAddressWarning) {
            return false;
        }
        if (this.dataService.getMspAccountApp().hasAnyVisitorInApplication()) {
            return false;
        }
        //enable the buttons only when atleast one Dependent is added/removed..This makes sure the request is meaningful
        let atleastOneDepedentAddedOrRemoved: boolean = !!this.removedSpouse || !!this.addedSpouse || this.addedChildren.length > 0 || this.removedChildren.length > 0;

        // Enable the button if the form is not filled in yet
        return !this.isAllValid() || atleastOneDepedentAddedOrRemoved;
    }

    isValidAddressScenarios(): boolean {
        if (this.addedSpouse || this.addedChildren.length > 0 || this.removedChildren.length > 0) {
            return this.person.residentialAddress.isValid;
        }

        if (this.removedSpouse) {
            return this.person.residentialAddress.isValid || this.removedSpouse.mailingAddress.isValid;
        }

        return this.person.residentialAddress.isValid;
    }

    continue(): void {
        if (!this.isAllValid() || !this.isValidAddressScenarios()) {
            console.log('Please fill in all required fields on the form.');
        } else {
            this._router.navigate([this._processService.getNextStep(this._processService.getStepNumber(ProcessUrls.ACCOUNT_DEPENDENTS_URL))]);
        }

    }

    /** Add a spouse to the account. */
    addSpouse() {

        if (this.canAddOrRemoveDepdents()) {
            const sp = new Person(Relationship.Spouse);
            // this.addedPersons.push(sp);
            this.addedSpouse = sp;

        }
        this.cd.detectChanges();
    }

    /** Add a child to the account */
    addChild(relationship: Relationship) {

        if (this.canAddOrRemoveDepdents()) {
            const child = new Person(relationship, OperationActionType.Add);
            this.addedChildren.push(child);

        }

        this.cd.detectChanges();
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

        if (this.canRemoveSpouse()) {
            const sp = new Person(Relationship.Spouse);
            //By default these are "British Columbia" and "Canada", but we don't want form fields pre-populated here as it isn't specified in the FDS.
            sp.residentialAddress.province = null;
            sp.residentialAddress.country = null;

            this.removedSpouse = sp;
        }
        this.cd.detectChanges();

    }

    /**
     * The account holder wishes to remove a child or dependent from their
     * account. For when a dependent already exists on the account. This is ***not
     * to be confused with deleting or cancelling adding a new dependent to the
     * account***,  for that look at methods starting with clear.
     */
    removeChild() {

        if (this.canAddOrRemoveDepdents()) {
            const child = new Person(Relationship.ChildUnder24, OperationActionType.Remove);
            //By default these are "British Columbia" and "Canada", but we don't want form fields pre-populated here as it isn't specified in the FDS.
            child.residentialAddress.province = null;
            child.residentialAddress.country = null;
            this.removedChildren.push(child);
        }
        this.cd.detectChanges();
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