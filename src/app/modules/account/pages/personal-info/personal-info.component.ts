import { Component, Injectable , ViewChild, ViewChildren , QueryList, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountPersonalDetailsComponent } from '../../components/personal-details/personal-details.component';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../models/account.model';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractForm } from 'moh-common-lib';
import { PageStateService } from 'app/services/page-state.service';
import { StatusInCanada, CanadianStatusReason, CanadianStatusStrings } from '../../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../../models/relationship.enum';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';


@Component({
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
@Injectable()
export class AccountPersonalInfoComponent extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

  static ProcessStepNum = 1;
  lang = require('./i18n');
  docSelected: string ;
  //activitiesOpts: string[] = CanadianStatusReason;

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
  subscriptions: Subscription[];

  constructor(public dataService: MspAccountMaintenanceDataService,
                protected router: Router,  private pageStateService: PageStateService
            //private _processService: ProcessService,
            ) {
      super(router);
  }

  onChange($event){
      console.log($event);
      console.log(this.applicant);
      //this.dataService.saveMspAccountApp();
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

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }

  ngAfterViewInit() {
    if (this.form) {
      this.subscriptions = [
        this.form.valueChanges.pipe(
          debounceTime(100)
        ).subscribe(() => {
          this.dataService.saveMspAccountApp();
        })
        ];
      }
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

       // this.dataService.saveMspAccountApp();
    }

    immigrationStatusChange(event: boolean) {
        this.accountChangeOptions.immigrationStatusChange = event;
      //  this.dataService.saveMspAccountApp();
    }

    addUpdateSpouse = () => {
        const sp: MspPerson = new MspPerson(Relationship.Spouse);
        this.dataService.getMspAccountApp().addUpdatedSpouse(sp);
    }

    /*
    If the application contains any Visting status , application shouldnt be sumbitted
     */
    hasAnyInvalidStatus(): boolean {
        // console.log(this.dataService.getMspAccountApp().accountChangeOptions.statusUpdate);
        if (!this.dataService.getMspAccountApp().accountChangeOptions.statusUpdate) {
            return false;
        }
        return this.dataService.getMspAccountApp().hasAnyVisitorInApplication();
    }

    isPhnUniqueInPI() {
      return this.dataService.accountApp.isUniquePhnsInPI ;
    }

    isValid(): boolean {
      return this.dataService.accountApp.isUniquePhnsInPI ;
    }

    statusLabel(): string {
        return 'You Status in Canada';
    }

    setStatus(value: StatusInCanada, p: MspPerson) {
        if (typeof value === 'object') return;
        p.status = value;
        p.currentActivity = null;

        if (p.status !== StatusInCanada.CitizenAdult) {
            p.institutionWorkHistory = 'No';
        }
    }

    canContinue(): boolean {
      let valid = super.canContinue();

      if (this.applicant.hasNameChange) {
        valid = valid;
      }

      if (this.applicant.fullTimeStudent) {
        valid = valid && this.applicant.inBCafterStudies;
      }
      return valid;
    }

    continue(): void {
      if (!this.canContinue()) {
        console.log('Please fill in all required fields on the form.');
        this.markAllInputsTouched();
        return;
      }
      this.pageStateService.setPageComplete(this.router.url, this.dataService.accountApp.pageStatus);
      this.navigate('/deam/spouse-info');
    }
}
