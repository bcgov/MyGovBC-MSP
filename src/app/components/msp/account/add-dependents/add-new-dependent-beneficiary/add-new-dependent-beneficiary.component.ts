import {
    ChangeDetectorRef,
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ViewChildren,
    QueryList
} from '@angular/core';
import {Person} from '../../../model/person.model';
import {Relationship, StatusInCanada} from '../../../model/status-activities-documents';
import {BaseComponent} from "../../../common/base.component";
import {MspToggleComponent} from '../../../common/toggle/toggle.component';
import {MspProvinceComponent} from '../../../common/province/province.component';
import {MspDateComponent} from '../../../common/date/date.component';
import {MspOutofBCRecordComponent} from '../../../common/outof-bc/outof-bc.component';
import {MspDischargeDateComponent} from '../../../common/discharge-date/discharge-date.component';
import { OutofBCRecord } from '../../../model/outof-bc-record.model';

@Component({
    selector: 'msp-add-new-dependent-beneficiary',
    templateUrl: './add-new-dependent-beneficiary.component.html',
    styleUrls: ['./add-new-dependent-beneficiary.component.less']
})
export class AddNewDependentBeneficiaryComponent extends BaseComponent implements OnInit {
    Relationship: typeof Relationship = Relationship;
    StatusInCanada: typeof StatusInCanada = StatusInCanada;
    @Input() person: Person;
    @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
    lang = require('./i18n');
    @Input() showError: boolean;

    @ViewChildren(MspToggleComponent) toggleComponents: QueryList<MspToggleComponent>;
    @ViewChildren(MspProvinceComponent) provinceComponents: QueryList<MspProvinceComponent>;
    @ViewChildren(MspDateComponent) dateComponents: QueryList<MspDateComponent>;
    @ViewChildren(MspOutofBCRecordComponent) outOfBCComponents: QueryList<MspOutofBCRecordComponent>;
    @ViewChildren(MspDischargeDateComponent) dischargeDateComponents: QueryList<MspDischargeDateComponent>;

    constructor(cd: ChangeDetectorRef) {
        super(cd);
    }

    ngOnInit() {
    }

    change($event) {
        this.onChange.emit($event);
        this.emitIsFormValid();
    }

    //If false, then we don't want users continuing to further application;
    checkEligibility(): boolean {
        return !this.person.ineligibleForMSP;
    }

    handleDeleteOutofBCRecord(evt:OutofBCRecord){
        this.person.outOfBCRecord = null;
        this.onChange.emit();   //TODO need evt?
    }

    handleOutofBCRecordChange(evt:OutofBCRecord){
        this.onChange.emit(); //TODO need evt?
    }

    setLivedInBCSinceBirth(lived:boolean){
        this.person.livedInBCSinceBirth = lived;
        if (lived) {
            this.person.movedFromProvinceOrCountry = "";
            this.person.healthNumberFromOtherProvince ="";
            this.person.arrivalToBCDay = null;
            this.person.arrivalToBCMonth = null;
            this.person.arrivalToBCYear = null;

            this.person.madePermanentMoveToBC = null;
        }

        this.onChange.emit();
        this.emitIsFormValid();
    }


    selectInstitution(evt: boolean) {
        this.person.hasBeenReleasedFromArmedForces = evt;
        if (evt == false) {
            this.person.dischargeDay = null;
            this.person.dischargeMonth = null;
            this.person.dischargeYear = null;
            this.person.nameOfInstitute = "";
        }
      //  this.cd.detectChanges();
        this.onChange.emit();
        this.emitIsFormValid();
    }

    handleDeletePlanOnBeingOutOfBCRecord(evt:OutofBCRecord){
        this.person.planOnBeingOutOfBCRecord = null;
        this.onChange.emit();   //TODO need evt?
    }

    isValid(): boolean {

        if (!this.person.isExistingBeneficiary && this.person.status == StatusInCanada.CitizenAdult && this.person.hasBeenReleasedFromArmedForces ) {
            if (!this.person.nameOfInstitute || this.person.nameOfInstitute.length <1 ) {
                return false;
            }
        }

        return this.checkEligibility();
    }

}
