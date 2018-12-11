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
import {Person} from '../../model/person.model';
import {Relationship, StatusInCanada} from '../../model/status-activities-documents';
import {BaseComponent} from '../../common/base.component';
import {MspDataService} from '../../service/msp-data.service';
import {Router} from '@angular/router';
import {ProcessService} from '../../service/process.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {NgForm} from '@angular/forms';
import {MspToggleComponent} from '../../common/toggle/toggle.component';
import {MspDateComponent} from '../../common/date/date.component';
import {MspStatusInCanadaRadioComponent} from '../../common/status-in-canada-radio/status-in-canada-radio.component';
import {AccountPersonalDetailsComponent} from '../personal-info/personal-details/personal-details.component';
import {AddNewDependentBeneficiaryComponent} from '../add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component';

@Component({
    selector: 'msp-add-dependent',
    templateUrl: './add-dependents.component.html',
    styleUrls: ['./add-dependents.component.scss']
})
export class AddDependentComponent extends BaseComponent {
    Relationship: typeof Relationship = Relationship;
    StatusInCanada: typeof StatusInCanada = StatusInCanada;
    Person: typeof Person = Person;
    @Input() person: Person;
    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
    /** The element we focus on when this component is inited, for a11y. */
    @ViewChild('firstFocus') firstFocus: ElementRef;
    lang = require('./i18n');
    @Input() showError: boolean;

    @ViewChildren(MspDateComponent) dateComponents: QueryList<MspDateComponent>;



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
             this.person.schoolAddress.province = 'British Columbia';
            this.person.schoolAddress.country = 'Canada';

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
            if (this.person.hasBeenReleasedFromArmedForces == null || this.person.hasBeenReleasedFromArmedForces == undefined) {
                return false;
            }
        }

        if (this.person.isArrivalToBcBeforeDob || this.person.isStudyDatesInValid) {
            return false;
        }
        return true;
    }



}
