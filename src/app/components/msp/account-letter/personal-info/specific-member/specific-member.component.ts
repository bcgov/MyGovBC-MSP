import {ChangeDetectorRef, ElementRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EnrollmentStatusRules, MSPEnrollementMember} from "../../../model/status-activities-documents";
import {Person} from "../../../model/person.model";
import {AccountLetterApplication} from "../../../model/account-letter-application.model";
import {BaseComponent} from "../../../common/base.component";
import {MspPhnComponent} from "../../../common/phn/phn.component";
import {Masking, NUMBER, SPACE} from '../../../model/masking.model';

@Component({
    selector: 'msp-specific-member',
    templateUrl: './specific-member.component.html',
    styleUrls: ['./specific-member.component.scss']
})
export class SpecificMemberComponent extends Masking {

    @Input() person: Person;
    @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() onStatusChange: EventEmitter<string> = new EventEmitter<string>();
    @ViewChild('addtionalMemberphn') phn: MspPhnComponent;
    @ViewChild('phnFocus') phnFocus : ElementRef;
    @Input() isACL: boolean = false;

   // public mask;
    //public phnMask = [NUMBER, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER];
    
   
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
        console.log(this.person.specificMember_phn);

        // Showing specific member Phn when the user selects that option  
        if(value != MSPEnrollementMember.SpecificMember.toString() && this.person.specificMember_phn != undefined) {
            this.person.specificMember_phn = '';
        }
        this.onStatusChange.emit(value);
        this.emitIsFormValid();
    }

    onPHNChange(){
        this.onChange.emit();
        this.emitIsFormValid();
    }
    
}
