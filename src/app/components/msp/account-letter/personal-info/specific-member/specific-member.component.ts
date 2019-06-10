import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {EnrollmentStatusRules, MSPEnrollementMember} from '../../../model/status-activities-documents';
import {MspPerson} from '../../../model/msp-person.model';
import {Masking} from '../../../model/masking.model';
//import { PhnComponent } from 'moh-common-lib';

@Component({
    selector: 'msp-specific-member',
    templateUrl: './specific-member.component.html',
    styleUrls: ['./specific-member.component.scss']
})
export class SpecificMemberComponent extends Masking {

    @Input() person: MspPerson;
    @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() onStatusChange: EventEmitter<string> = new EventEmitter<string>();
   // @ViewChild('addtionalMemberphn') phn: PhnComponent;
    public checked: boolean = false;
    lang = require('./i18n');
    langStatus = require('../../../common/enrollmentMember/i18n');

    constructor(cd: ChangeDetectorRef) {
        super(cd);
    }

    get MSPEnrollementMember(): MSPEnrollementMember[] {
        return EnrollmentStatusRules.availableStatus();
    }


    setStatus(value: string) {
        console.log(value);
        /// Resetting the value of the specific phn textBox if the user selects Myself or All members
        if (value !== MSPEnrollementMember.SpecificMember.toString() && this.person.specificMember_phn !== undefined) {
            this.person.specificMember_phn = '';
        }
        this.person.enrollmentMember  = value;
        this.onStatusChange.emit(value);
        this.emitIsFormValid();

    }

    onPHNChange(){
        this.onChange.emit();
        this.emitIsFormValid();
    }

}
