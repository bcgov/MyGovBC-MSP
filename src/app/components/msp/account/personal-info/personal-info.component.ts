import {ChangeDetectorRef, Component, Injectable , ViewChild, ViewChildren , QueryList } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../models/base.component';
import {ProcessService, ProcessUrls} from '../../service/process.service';
import {MspPerson} from '../../model/account.model';
import {MspDataService} from '../../../../services/msp-data.service';
import {AccountPersonalDetailsComponent} from './personal-details/personal-details.component';
import {
    Relationship
} from '../../model/status-activities-documents';

@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class AccountPersonalInfoComponent extends BaseComponent {

  static ProcessStepNum = 1;
  lang = require('./i18n');

    @ViewChild('formRef') form: NgForm;
    @ViewChildren(AccountPersonalDetailsComponent) personalDetailsComponent: QueryList<AccountPersonalDetailsComponent>;
    public buttonstyle: string = 'btn btn-default';

  constructor(private dataService: MspDataService,
              private _router: Router,
              private _processService: ProcessService,
              cd: ChangeDetectorRef) {

    super(cd);
  }

    onChange($event){
        this.dataService.saveMspAccountApp();
    }

  ngOnInit(){
      this.initProcessMembers( this._processService.getStepNumber(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL), this._processService);
  }

    get applicant(): MspPerson {
        return this.dataService.getMspAccountApp().applicant;
    }

    get spouse(): MspPerson {
        return this.dataService.getMspAccountApp().updatedSpouse;
    }

    get children(): MspPerson[] {
        return this.dataService.getMspAccountApp().updatedChildren;

    }

    removeUpdateChild(idx: number): void{
        // console.log('remove child ' + JSON.stringify(event));
        this.dataService.getMspAccountApp().removeUpdateChild(idx);
        this.dataService.saveMspAccountApp();

    }


    addUpdateSpouse = () => {
        const sp: MspPerson = new MspPerson(Relationship.Spouse);
        this.dataService.getMspAccountApp().addUpdatedSpouse(sp);
    }

    addUpdateChild(): void {
        this.dataService.getMspAccountApp().addUpdatedChild();
    }

    /*
    If the application contains any Visting status , application shouldnt be sumbitted
     */
    hasAnyInvalidStatus(): boolean {
        console.log(this.dataService.getMspAccountApp().accountChangeOptions.statusUpdate);
        if (!this.dataService.getMspAccountApp().accountChangeOptions.statusUpdate) {
            return false;
        }

       return this.dataService.getMspAccountApp().hasAnyVisitorInApplication();


    }

    canContinue(): boolean {
        return this.isAllValid();
    }

    removeSpouse = () => {
        this.dataService.getMspAccountApp().removeUpdatedSpouse();
        this.dataService.saveMspAccountApp();
    }

    isValid(): boolean {
      return this.dataService.getMspAccountApp().isUniquePhnsInPI ;

    }

    continue(): void {

        // console.log('personal info form itself valid: %s', this.form.valid);
        console.log('combinedValidationState on personal info: %s', this.isAllValid());
        if (!this.isAllValid()){
            console.log('Please fill in all required fields on the form.');
        }else{
            console.log('redirecting to' + this._processService.getNextStep( this._processService.getStepNumber(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL)));
            this._router.navigate([this._processService.getNextStep( this._processService.getStepNumber(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL))]);
        }
    }
}
