import { ChangeDetectorRef, Component, ViewChild, ViewChildren , QueryList, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseComponent } from '../../.././../../models/base.component';
import { AccountPersonalDetailsComponent } from '../../../components/personal-details/personal-details.component';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';
import { spouseRemovedDueToDivorceDocuments } from 'app/modules/msp-core/components/support-documents/support-documents.component';
import { CancellationReasons, CancellationReasonsStrings } from '../../../../../models/status-activities-documents';
import { MspPerson, OperationActionType } from '../../../../../components/msp/model/msp-person.model';
import { ErrorMessage } from 'moh-common-lib';
import { formatDateField } from '../../../../../modules/account/helpers/date';

@Component({
  selector: 'msp-remove-spouse',
  templateUrl: './remove-spouse.component.html',
  styleUrls: ['./remove-spouse.component.scss']
})

export class RemoveSpouseComponent extends BaseComponent {
  //static ProcessStepNum = 1;

  docSelected: string ;

  //langActivities = require('../../../../components/msp/common/activities/i18n');

  //langStatus = legalStatus;

  @ViewChild('formRef') form: NgForm;
  @ViewChildren(AccountPersonalDetailsComponent) personalDetailsComponent: QueryList<AccountPersonalDetailsComponent>;
  public buttonstyle: string = 'btn btn-default';
  accountApp: MspAccountApp;
  accountChangeOptions: AccountChangeOptions;
  accountHolderTitle: string = 'Account Holder Identification';
  accountHolderSubtitle: string = 'Please provide the Account Holder’s personal information for verification purposes.';
  @Input() spouse: MspPerson;
  updateList: UpdateList[];
  dateErrorMessage: ErrorMessage = {
    noFutureDatesAllowed: 'Date must be in the past.'
  };
  spouseRemoveDocs = spouseRemovedDueToDivorceDocuments();
  dateToday: Date = new Date();
  listofCancellationReasons = [
    {
      'label': 'Seperated/Divorced',
      'value': CancellationReasons.SeparatedDivorced
    },
    {
      'label': 'Remove from Account but still married/common-law',
      'value': CancellationReasons.RemoveFromAccountButStillMarriedOrCommomLaw
    },
    {
      'label': 'Deceased',
      'value': CancellationReasons.Deceased
    },
    {
      'label': 'Out of province/ Out of Country move',
      'value': CancellationReasons.OutOfProvinceOrCountry
    },
    {
      'label': 'Armed Forces',
      'value': CancellationReasons.ArmedForces
    },
    {
      'label': 'Incarcerated',
      'value': CancellationReasons.Incarcerated
    },
  ];

  constructor(public dataService: MspAccountMaintenanceDataService, cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit() {
    this.accountApp = this.dataService.accountApp;
    this.accountChangeOptions = this.dataService.accountApp.accountChangeOptions;
    this.spouse.operationActionType = OperationActionType.Remove;
  }

  onChange($event){
    //this.dataService.saveMspAccountApp();
  }

  setCancellationStatus(evt: any) {
    this.spouse.cancellationReason = evt;
    this.spouse.reasonForCancellation = CancellationReasonsStrings[evt];
    this.dataService.saveMspAccountApp();
  }

  handleAddressUpdate(evt: any){
    evt.addressLine1 = evt.street;
  }

  get phnList() {
    return [this.accountApp.applicant.previous_phn];
  }

  get checkCurrentMonthOfSeparation() {
    const currentDate = new Date();
    if (this.spouse.cancellationDate.getFullYear() < currentDate.getFullYear()){
      return true;
    }
    else if (this.spouse.cancellationDate.getFullYear() === currentDate.getFullYear()){
      return this.spouse.cancellationDate.getMonth() < currentDate.getMonth();
    }
    else {
      return false;
    }
  }

  get cancellationDateErrorMessage() {
    if (this.spouse.dateOfBirth) {
      return {
        invalidRange: `Date must be between ${formatDateField(this.spouse.dateOfBirth)} and ${formatDateField(this.dateToday)}.`
      }
    } else {
      return {
        invalidRange: `Date must be before ${formatDateField(this.dateToday)}.`
      }
    }
  }

  get cancellationReasons() {
    return this.listofCancellationReasons;
  }
}
