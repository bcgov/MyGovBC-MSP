import {ChangeDetectorRef, Component, Injectable ,ViewChild, ViewChildren ,QueryList } from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from '@angular/router';
import {BaseComponent} from "../../common/base.component";
import {ProcessService,ProcessUrls} from "../../service/process.service";
import {LocalStorageService} from 'angular-2-local-storage';
import {MspAccountApp, Person} from '../../model/account.model';
import {MspDataService} from '../../service/msp-data.service';
import {AccountPersonalDetailsComponent} from "./personal-details/personal-details.component";
import {
    StatusRules, ActivitiesRules, StatusInCanada, Activities,
    DocumentRules, Documents, Relationship
} from "../../model/status-activities-documents";

@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class AccountPersonalInfoComponent extends BaseComponent {

  static ProcessStepNum = 1;
  lang = require('./i18n');

    @ViewChild('formRef') form: NgForm;
    @ViewChildren(AccountPersonalDetailsComponent) personalDetailsComponent: QueryList<AccountPersonalDetailsComponent>;


  constructor(private dataService: MspDataService,
              private _router: Router,
              private _processService: ProcessService,
              private cd:ChangeDetectorRef, private localStorageService: LocalStorageService) {

    super(cd);
  }

    onChange(values:any){
        this.dataService.saveMspAccountApp();
    }

  ngOnInit(){
      this.initProcessMembers( this._processService.getStepNumber(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL), this._processService);
  }

    get applicant(): Person {
        return this.dataService.getMspAccountApp().applicant;
    }

    get spouse(): Person {
        return this.dataService.getMspAccountApp().updatedSpouse;
    }

    get children(): Person[] {
        return this.dataService.getMspAccountApp().updateChildren;

    }

    removeUpdateChild(event: Object, idx: number): void{
        // console.log('remove child ' + JSON.stringify(event));
        this.dataService.getMspAccountApp().removeUpdateChild(idx);
        this.dataService.saveMspAccountApp();

    }


    addUpdateSpouse = () =>{
        let sp:Person = new Person(Relationship.Spouse)
        this.dataService.getMspAccountApp().addUpdatedSpouse(sp);
    };

    addUpdateChild(): void {
        this.dataService.getMspAccountApp().addUpdateChild();
    }

    /*
    If the application contains any Visting status , application shouldnt be sumbitted
     */
    hasAnyInvalidStatus(): boolean {

        if (!this.dataService.getMspAccountApp().accountChangeOptions.statusUpdate) {
            return false;
        }
        var spouse = this.dataService.getMspAccountApp().updatedSpouse ;
        if (spouse &&  spouse.status == StatusInCanada.TemporaryResident && spouse.currentActivity === Activities.Visiting) {
            return true;
        }
        var children:Array<Person> = this.dataService.getMspAccountApp().updateChildren ;
        return ((children.findIndex( child => child.status == StatusInCanada.TemporaryResident && child.currentActivity === Activities.Visiting)) > 0 );


    }

    canContinue():boolean {
        return this.isAllValid();
    }

    removeSpouse = () =>{
        this.dataService.getMspAccountApp().removeUpdatedSpouse();
        this.dataService.saveMspAccountApp();
    }

    continue():void {

        // console.log('personal info form itself valid: %s', this.form.valid);
        console.log('combinedValidationState on personal info: %s', this.isAllValid());
        if(!this.isAllValid()){
            console.log('Please fill in all required fields on the form.');
        }else{
            console.log('redirecting to'+this._processService.getNextStep());
            this._router.navigate([this._processService.getNextStep()]);
        }
    }
}