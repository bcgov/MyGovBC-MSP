import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ViewChildren,
    ElementRef,
    ChangeDetectorRef,
    QueryList
} from '@angular/core';
import {MspPerson} from '../../../../components/msp/model/msp-person.model';
import {BaseComponent} from '../../../../models/base.component';
import {MspDataService} from '../../../../services/msp-data.service';
import {Router} from '@angular/router';
import {ProcessService} from '../../../../services/process.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {NgForm} from '@angular/forms';
import {MspToggleComponent} from '../../../../components/msp/common/toggle/toggle.component';
import {MspStatusInCanadaRadioComponent} from '../../../msp-core/components/status-in-canada-radio/status-in-canada-radio.component';
import {AddNewDependentBeneficiaryComponent} from '../add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component';
import { AccountPersonalDetailsComponent } from '../personal-info/personal-details/personal-details.component';
import { BRITISH_COLUMBIA, CANADA } from 'moh-common-lib';
import { StatusInCanada } from '../../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../../models/relationship.enum';

@Component({
    selector: 'msp-add-dependent',
    templateUrl: './add-dependents.component.html',
    styleUrls: ['./add-dependents.component.scss']
})
export class AddDependentComponent extends BaseComponent {

    // Constants for page - TODO: figure out which ones are common throughout application
    sectionTitle = [
        '', //0 indice is for the Applicant, but it doesn't make sense to have an applicant field here as it's about modifying dependents on on the plan.
        'Add Spouse',
        'Add Child (0-18)',
        'Add Child (19-24)'
      ];
      sectionBody = [
        '',
        'A spouse is a resident of B.C. who is married to or is living and cohabiting in a marriage-like relationship with the applicant.', '', ''
      ];
      clearButton = [
        '',
        'Clear Spouse',
        'Clear Child',
        'Clear Child'
      ];
      isExistingBeneficiaryQuestion = [
        '',
        'Is the spouse an existing MSP Beneficiary (has MSP coverage)?',
        'Is the child an existing MSP Beneficiary (has MSP coverage)?',
        'Is the child an existing MSP Beneficiary (has MSP coverage)?',
      ];

      //Spouse only? Maybe remove the array format?
      previousName = 'Spouse\'s Previous Last Name (if applicable)';
      previousNameErrorPattern = 'Must begin with a letter followed by a letters, hyphen, period, apostrophe, or blank character';
      marriageDate = 'Marriage Date (if applicable)';
      schoolAddressLabel = 'School Address';
      studiesBegin = 'Date studies will begin';
      studiesFinish = 'Date studies will finish';
      schoolOutsideBC = 'Is this school located outside of BC?';
      schoolName = 'School Name';
      departureDate = 'Departure Date';
      schoolNameRequired = 'School name is required';
      mustAnswerQuestion = 'Please answer this question.';
      dateStudiesStartBeforeEndError = 'Date studies finish cannot be before Date studies begin';

    Relationship: typeof Relationship = Relationship;
    StatusInCanada: typeof StatusInCanada = StatusInCanada;
    Person: typeof MspPerson = MspPerson;
    @Input() person: MspPerson;
    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
    /** The element we focus on when this component is inited, for a11y. */
    @ViewChild('firstFocus') firstFocus: ElementRef;

    @Input() showError: boolean;

    //@ViewChildren(MspDateComponent) dateComponents: QueryList<MspDateComponent>;



    @ViewChild('formRef') form: NgForm;
    @ViewChild('isExistingBeneficiary') toggleComp: MspToggleComponent;
    @ViewChildren(MspToggleComponent) toggleComponents: QueryList<MspToggleComponent>;
    @ViewChild(MspStatusInCanadaRadioComponent) statusRadioComponents: MspStatusInCanadaRadioComponent;
    @ViewChildren(AccountPersonalDetailsComponent) personalDetailsComponent: QueryList<AccountPersonalDetailsComponent>;
    @ViewChildren(AddNewDependentBeneficiaryComponent) newDependentBeneficiaryComponents: QueryList<AddNewDependentBeneficiaryComponent>;

    constructor(private dataService: MspDataService,
                private _router: Router,
                private _processService: ProcessService,
                private cd: ChangeDetectorRef, private localStorageService: LocalStorageService) {

        super(cd);
    }

    /*
    clear following items When the beneficiary is changed from new to existing

     */
    handleBeneficiaryChange(isExistingBeneficiary: boolean) {
        this.person.isExistingBeneficiary = isExistingBeneficiary;
        if (this.person.isExistingBeneficiary) {
            this.person.status = null;
            this.person.livedInBCSinceBirth = null;
            this.person.movedFromProvinceOrCountry = null;
            this.person.healthNumberFromOtherProvince = null;
            this.person.madePermanentMoveToBC = null;
            this.person.newlyAdopted = null ;
            this.person.adoptedDate = null;
            this.person.declarationForOutsideOver30Days = null ;
            this.person.outOfBCRecord = null ;
            this.person.plannedAbsence = null ;
            this.person.planOnBeingOutOfBCRecord = null ;
            this.person.hasBeenReleasedFromArmedForces = null ;
            this.person.planOnBeingOutOfBCRecord = null ;

            this.person.hasBeenReleasedFromArmedForces = null;
            this.person.dischargeDay = null;
            this.person.dischargeMonth = null;
            this.person.dischargeYear = null;
            this.person.nameOfInstitute = '';
        }
        this.onChange.emit();
        this.emitIsFormValid();
    }

    change($event) {
        this.onChange.emit();
        this.emitIsFormValid();
    }

    outsideBCchange($event) {
        if ($event) {
            this.person.schoolAddress.province = '';
            this.person.schoolAddress.country = '';

        } else {
             this.person.schoolAddress.province = BRITISH_COLUMBIA;
            this.person.schoolAddress.country = CANADA;

        }

        this.onChange.emit();
    }

    ngAfterViewInit() {
        this.firstFocus.nativeElement.focus();
    }

    cancelDependent() {
        this.onCancel.emit();
    }


    isValid(): boolean {
        if (!this.person.isExistingBeneficiary && this.person.status === StatusInCanada.CitizenAdult) {
            if (this.person.hasBeenReleasedFromArmedForces == null || this.person.hasBeenReleasedFromArmedForces === undefined) {
                return false;
            }
        }

        if (this.person.isArrivalToBcBeforeDob || this.person.isStudyDatesInValid) {
            return false;
        }
        return true;
    }



}
