import {
    ChangeDetectorRef,
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChildren,
    QueryList
} from '@angular/core';
import {BaseComponent} from '../../../../../models/base.component';
import { MspPerson } from '../../../models/account.model';
import { MspToggleComponent } from '../../../../../components/msp/common/toggle/toggle.component';
import { MspOutofBCRecordComponent } from '../../../../../components/msp/common/outof-bc/outof-bc.component';
import { MspDischargeDateComponent } from '../../../../../components/msp/common/discharge-date/discharge-date.component';
import { OutofBCRecord } from '../../../../../models/outof-bc-record.model';
import { ProvinceList } from 'moh-common-lib';
import { MspAddressConstants } from '../../../../../models/msp-address.constants';
import { StatusInCanada } from '../../../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../../msp-core/models/relationship.enum';


@Component({
    selector: 'msp-add-new-dependent-beneficiary',
    templateUrl: './add-new-dependent-beneficiary.component.html',
    styleUrls: ['./add-new-dependent-beneficiary.component.scss']
})
export class AddNewDependentBeneficiaryComponent extends BaseComponent implements OnInit {

    // Constants for page - TODO: figure out which ones are common throughout application
    livedInBCSinceBirth = [
        '',
        'Has spouse lived in B.C. since birth?',
        'Has child lived in B.C. since birth?',
        'Has child lived in B.C. since birth?',
      ];

      newlyAdopted = 'Is this child newly adopted?';

      hasBeenOutsideBC30InYear = 'Has this family member been outside of BC for more than a total of 30 days during the past 12 months?';
      willBeOutsideBC30InYear = 'Will this family member be outside of BC for more than a total of 30 days during the next 6 months?';
      releasedFromArmedForcesOrInstitution = 'Have they been released from the Canadian Armed Forces or an Institution?';
      instituteName = 'Name of Institute';
      instituteNameRequired = 'Name of Institute is required.';

      moveDateToBC = 'Most recent move date to B.C. 7637467364';
      adoptedDate = 'Adopted Date';
      movedFromProvinceOrCountry = 'From (province or country)';
      medicalPlanPreviousResidence = 'Medical plan in Previous place of Residence (optional)';
      permanentMove = 'Is this a permanent move?';


      moveDateBeforeBirthError = [
        'The applicant\'s most recent move to BC cannot be before the applicant\'s date of birth.',
        'The spouse\'s most recent move to BC cannot be before the spouse\'s date of birth.',
        'The child\'s most recent move to BC cannot be before the child\'s date of birth.',
        'The child\'s most recent move to BC cannot be before the child\'s date of birth.',
      ];

      notEligibleError = 'You have indicated that a recent move to B.C. is not permanent. As a result, the above is not eligible for enrolment with MSP. Please contact HIBC for further information.';

        maxMonthsSixMonths = 'The departure date cannot be greater than 6 months in future';
        minMonths = 'The return date should be with in past 12 months';



    Relationship: typeof Relationship = Relationship;
    StatusInCanada: typeof StatusInCanada = StatusInCanada;
    @Input() person: MspPerson;
    @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
    @Input() showError: boolean;

    @ViewChildren(MspToggleComponent) toggleComponents: QueryList<MspToggleComponent>;
    //@ViewChildren(MspProvinceComponent) provinceComponents: QueryList<MspProvinceComponent>;
    //@ViewChildren(DateComponent) dateComponents: QueryList<DateComponent>;
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

    handleDeleteOutofBCRecord(evt: OutofBCRecord){
        this.person.outOfBCRecord = null;
        this.onChange.emit();   //TODO need evt?
    }

    handleOutofBCRecordChange(evt: OutofBCRecord){
        this.onChange.emit(); //TODO need evt?
    }

    setLivedInBCSinceBirth(lived: boolean){
        this.person.livedInBCSinceBirth = lived;
        if (lived) {
            this.person.movedFromProvinceOrCountry = '';
            this.person.healthNumberFromOtherProvince = '';
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
        if (evt === false) {
            this.person.dischargeDay = null;
            this.person.dischargeMonth = null;
            this.person.dischargeYear = null;
            this.person.nameOfInstitute = '';
        }
      //  this.cd.detectChanges();
        this.onChange.emit();
        this.emitIsFormValid();
    }

    handleDeletePlanOnBeingOutOfBCRecord(evt: OutofBCRecord){
        this.person.planOnBeingOutOfBCRecord = null;
        this.onChange.emit();   //TODO need evt?
    }

    isValid(): boolean {

        if (!this.person.isExistingBeneficiary && this.person.status === StatusInCanada.CitizenAdult && this.person.hasBeenReleasedFromArmedForces ) {
            if (!this.person.nameOfInstitute || this.person.nameOfInstitute.length < 1 ) {
                return false;
            }
        }

        return this.checkEligibility();
    }

  // Province list
  provList( exceptBC: boolean = false ): ProvinceList[] {
    return MspAddressConstants.provList( exceptBC );
  }
}
