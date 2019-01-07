import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EnrollmentStatusRules, MSPEnrollementMember} from "../../../model/status-activities-documents";
import {Person} from "../../../model/person.model";
import {AccountLetterApplication} from "../../../model/account-letter-application.model";
import {BaseComponent} from "../../../common/base.component";

@Component({
    selector: 'msp-specific-member',
    templateUrl: './specific-member.component.html',
    styleUrls: ['./specific-member.component.scss']
})
export class SpecificMemberComponent extends BaseComponent {

    @Input() person: Person;
    @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() onStatusChange: EventEmitter<string> = new EventEmitter<string>();

    lang = require('./i18n');
    langStatus = require('../../../common/enrollmentMember/i18n');

    constructor(cd: ChangeDetectorRef) {
        super(cd);
    }

    get MSPEnrollementMember(): MSPEnrollementMember[] {
        return EnrollmentStatusRules.availableStatus();
    }

    setStatus(value: string) {
        this.onStatusChange.emit(value);
    }

}
