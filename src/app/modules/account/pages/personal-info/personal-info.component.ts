import {ChangeDetectorRef, Component, Injectable , ViewChild, ViewChildren , QueryList } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../models/base.component';
import {ProcessUrls} from '../../../../services/process.service';
import {AccountPersonalDetailsComponent} from './personal-details/personal-details.component';
import { MspPerson } from '../../models/account.model';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../models/account.model';
import { StatusInCanada, CanadianStatusReason, CanadianStatusStrings, CanadianStatusRules } from '../../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../../models/relationship.enum';
import { getStatusReasonStrings } from '../../../msp-core/components/canadian-status/canadian-status.component';
// import { Canadian }


@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class AccountPersonalInfoComponent extends BaseComponent {

  static ProcessStepNum = 1;
  lang = require('./i18n');
  docSelected: string ;
  activitiesOpts: string[] = getStatusReasonStrings();

    langStatus = CanadianStatusStrings;

    Activities: typeof CanadianStatusReason = CanadianStatusReason;
    @ViewChild('formRef') form: NgForm;
    @ViewChildren(AccountPersonalDetailsComponent) personalDetailsComponent: QueryList<AccountPersonalDetailsComponent>;
    public buttonstyle: string = 'btn btn-default';
    accountApp: MspAccountApp;
    accountChangeOptions: AccountChangeOptions;
    accountHolderTitle: string = 'Account Holder Identification';
    accountHolderSubtitle: string = 'Please provide the Account Holder’s personal information for verification purposes.';
    person: MspPerson;
    updateList: UpdateList[];


    constructor(public dataService: MspAccountMaintenanceDataService,
              private _router: Router,
              //private _processService: ProcessService,
              cd: ChangeDetectorRef) {

     super(cd);
    }

    onChange($event){
        console.log($event);
        console.log(this.applicant);
        this.dataService.saveMspAccountApp();
    }

    ngOnInit(){
      this.accountApp = this.dataService.accountApp;
      this.accountChangeOptions = this.dataService.accountApp.accountChangeOptions;
      this.person = this.dataService.accountApp.applicant;
      console.log(this.person);
      console.log(this.accountApp);
      console.log(this.accountChangeOptions);
     // this.initProcessMembers( this._processService.getStepNumber(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL), this._processService);
  }

    get applicant(): MspPerson {
        return this.dataService.accountApp.applicant;
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

    personInfoUpdateOnChange(event: boolean) {

        console.log(event);

       // this.isPICheckedByUser = true;
        this.accountChangeOptions.personInfoUpdate = event;
        if (event) {
            this.accountHolderTitle = 'Update Account Holder\'s Information';
            this.accountHolderSubtitle = 'Please provide new information if you are requesting an update or correction to the Account Holder’s name (including a name change as a result of marriage, separation or divorce), birthdate or gender.';
        } else {
            this.accountHolderTitle = 'Account Holder Identification';
            this.accountHolderSubtitle = 'Please provide the Account Holder’s personal information for verification purposes.';

        }

        this.dataService.saveMspAccountApp();
    }

    immigrationStatusChange(event: boolean) {
        this.accountChangeOptions.immigrationStatusChange = event;
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

    statusLabel(): string {
        return 'You Status in Canada';
    }

    get activities(): CanadianStatusReason[] {
        console.log( this.person.relationship);
        console.log( this.person.status);
        // todo review correctness, had to modify after merge.
        return CanadianStatusRules.statusesForRelationship(
            this.person.relationship,
            this.person.status
        );
    }

    get items()   {
        return[
        'Canadian birth certificate',
        'Canadian citizenship card or certificate',
        'Canadian Passport'
    ]; }

    get canadaStatus()   {
        return[
        'Canadian Citizen',
        'Permanent Resident',
        'Temporary Permit Holder or Diplomat'];
    }

    get residentStatus() {
        return[
            {
                'label': 'Canadian Citizen',
                'value': StatusInCanada.CitizenAdult
              },

              {
                'label': 'Permanent Resident',
                'value': StatusInCanada.PermanentResident
              },
              {
                'label': 'Temporary Permit Holder or Diplomat',
                'value': StatusInCanada.TemporaryResident
              }
    ]; }

    get accountUpdateList(): UpdateList[] {

        return [{
            'label': 'Update status in Canada',
            'value': this.person.updateStatusInCanada
          },
          {
            'label': 'Update name - due to marriage or other',
            'value': this.person.updateNameDueToMarriage
          },
          {
            'label': 'Correct name - due to error',
            'value': this.person.updateNameDueToError
          },
          {
            'label': 'Correct birthdate',
            'value': this.person.updateBirthdate
          },
          {
            'label': 'Correct gender',
            'value': this.person.updateGender
          },
          {
            'label': 'Change gender designation',
            'value': this.person.updateGenderDesignation
          }

        ];

    }


    get activitiesTable() {
      if (this.activities) {
        return this.activities.map(itm => {
          return {
            label: this.activitiesOpts[itm],
            value: itm
          };
        });
      }
    }

    setStatus(value: StatusInCanada, p: MspPerson) {
        if (typeof value === 'object') return;
        p.status = value;
        p.currentActivity = null;

        if (p.status !== StatusInCanada.CitizenAdult) {
            p.institutionWorkHistory = 'No';
        }
      //this.showServicesCardModal = true;

      //this.onChange.emit(value);
    }

    continue(): void {

        // console.log('personal info form itself valid: %s', this.form.valid);
        console.log('combinedValidationState on personal info: %s', this.isAllValid());
        if (!this.isAllValid()){
            console.log('Please fill in all required fields on the form.');
        }else{
           // console.log('redirecting to' + this._processService.getNextStep( this._processService.getStepNumber(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL)));
           // this._router.navigate([this._processService.getNextStep( this._processService.getStepNumber(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL))]);

           this._router.navigate([ProcessUrls.ACCOUNT_PERSONAL_INFO_URL]);
        }
    }
}
