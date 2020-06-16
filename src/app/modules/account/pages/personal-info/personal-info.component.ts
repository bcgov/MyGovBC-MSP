import { Component, Injectable , ViewChild, ViewChildren , QueryList, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountPersonalDetailsComponent } from '../../components/personal-details/personal-details.component';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../models/account.model';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractForm, ContainerService, PageStateService } from 'moh-common-lib';
import { StatusInCanada, CanadianStatusReason, CanadianStatusStrings } from '../../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../../models/relationship.enum';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { BaseForm } from '../../models/base-form';

@Component({
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})

@Injectable()
export class AccountPersonalInfoComponent extends BaseForm implements OnInit, AfterViewInit, OnDestroy {
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
              protected router: Router,
              protected pageStateService: PageStateService,
              protected containerService: ContainerService,
              // private _processService: ProcessService,
              ) {
    super(router, containerService, pageStateService);
  }

  onChange($event) {
    //this.dataService.saveMspAccountApp();
  }

  ngOnInit() {
    this.accountApp = this.dataService.accountApp;
    this.accountChangeOptions = this.dataService.accountApp.accountChangeOptions;
    this.person = this.dataService.accountApp.applicant;
    // this.initProcessMembers( this._processService.getStepNumber(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL), this._processService);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(itm => itm.unsubscribe());
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
    // this.isPICheckedByUser = true;
    this.accountChangeOptions.personInfoUpdate = event;
    if (event) {
      this.accountHolderTitle = 'Update Account Holder\'s Information';
      this.accountHolderSubtitle = 'Please provide new information if you are requesting an update or correction to the ' +
        'Account Holder’s name (including a name change as a result of marriage, separation or divorce), birthdate or gender.';
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

  hasAnyUpdateSelected(): boolean {
    if (this.person.updatingPersonalInfo === true){
      return (this.person.updateStatusInCanada === true ||
        this.person.updateNameDueToMarriage === true ||
        this.person.updateNameDueToNameChange === true ||
        this.person.updateGender === true ||
        this.person.updateNameDueToError === true ||
        this.person.updateBirthdate === true ||
        this.person.updateGenderDesignation === true);
    } else {
      return true;
    }
  }

  checkDocuments() {
    let valid = true;
    if (this.person.updateStatusInCanada === true && this.person.updateStatusInCanadaDocType.images) {
      valid = valid && this.person.updateStatusInCanadaDocType.images.length > 0;
    }
    if (this.person.updateNameDueToMarriage === true && this.person.updateNameDueToMarriageDocType.images) {
      valid = valid && this.person.updateNameDueToMarriageDocType.images.length > 0;
    }
    if (this.person.updateNameDueToNameChange === true && this.person.updateNameDueToNameChangeDocType.images) {
      valid = valid && this.person.updateNameDueToNameChangeDocType.images.length > 0;
    }
    if (this.person.updateGender === true && this.person.updateGenderDocType.images && this.person.updateGenderDocType2.images) {
      valid = valid && this.person.updateGenderDocType.images.length > 0 && this.person.updateGenderDocType2.images.length > 0;
      if (this.person.updateGenderAdditionalDocs === true && this.person.updateGenderDocType3.images) {
        valid = valid && this.person.updateGenderDocType3.images.length > 0;
      }
    }
    if (this.person.updateNameDueToError === true && this.person.updateNameDueToErrorDocType.images) {
      valid = valid && this.person.updateNameDueToErrorDocType.images.length > 0;
    }
    if (this.person.updateBirthdate === true && this.person.updateBirthdateDocType.images) {
      valid = valid && this.person.updateBirthdateDocType.images.length > 0;
    }
    if (this.person.updateGenderDesignation === true && this.person.updateGenderDesignationDocType.images) {
      valid = valid && this.person.updateGenderDesignationDocType.images.length > 0;
    }
    return valid;
  }

  canContinue(): boolean {
    const valid = super.canContinue()
                  && this.person.updatingPersonalInfo !== undefined
                  && this.hasAnyUpdateSelected()
                  && this.checkDocuments();
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this.navigate('/deam/spouse-info');
  }
}
