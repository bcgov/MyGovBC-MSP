import {
    ChangeDetectorRef,
    EventEmitter,
    Output,
    Component,
    Inject,
    Injectable,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Input,
    OnInit
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {MspApplication, Person} from '../../model/application.model';
import * as _ from 'lodash';
import {MspDataService} from '../../service/msp-data.service';
import {MspConsentModalComponent} from '../../common/consent-modal/consent-modal.component';
import {ProcessService} from '../../service/process.service';
import {BaseComponent} from '../../common/base.component';
import {AccountLetterApplication} from '../../model/account-letter-application.model';
import {MspPhnComponent} from '../../common/phn/phn.component';
import {MspBirthDateComponent} from '../../common/birthdate/birthdate.component';
import {Address} from "../../model/address.model";
import {
    MSPEnrollementMember, DocumentRules, Documents, Relationship, EnrollmentStatusRules
} from '../../model/status-activities-documents';
import {environment} from '../../../../../environments/environment';
import {SpecificMemberComponent} from "./specific-member/specific-member.component";
import {LETTER, Masking, NUMBER, SPACE} from '../../model/masking.model';

@Component({
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss']
})

@Injectable()
export class AccountLetterPersonalInfoComponent extends Masking  implements OnInit {
    static ProcessStepNum = 0;
    lang = require('./i18n');

    @ViewChild('formRef') form: NgForm;
    @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;
    @ViewChild('phn') phn: MspPhnComponent;
    @ViewChild('addtionalMemberphn') addtionalMemberphn: MspPhnComponent;
    @ViewChild('birthDate') birthdate: MspBirthDateComponent;
    @ViewChild('specificMember') specificMember: SpecificMemberComponent;
    captchaApiBaseUrl: string;
    showError:boolean = false;
    Address: typeof Address = Address;
    public mask = [LETTER, NUMBER, LETTER, SPACE, NUMBER, LETTER, NUMBER];
    //public phnMask = [NUMBER, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER];
    public regex: RegExp = /^[A-Za-z][0-9][A-Za-z]\s?[0-9][A-Za-z][0-9]$/;

    langStatus = require('../../common/enrollmentMember/i18n');


    constructor(private dataService: MspDataService,
                private _processService: ProcessService,
                private _router: Router,
                private cd: ChangeDetectorRef) {
        super(cd);
        console.log(this.applicant);
       

    }

    ngOnInit() {
        this.initProcessMembers(AccountLetterPersonalInfoComponent.ProcessStepNum, this._processService);
        this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
        this.accountLetterApplication.authorizationToken = null;
       
    }

    saveApplication(values: any) {
        this.dataService.saveAccountLetterApplication();
    }

    get accountLetterApplication(): AccountLetterApplication {
        return this.dataService.accountLetterApp;
    }

    get applicant(): Person {
        return this.dataService.accountLetterApp.applicant;
    }

    ngAfterViewInit() {
        if (!this.accountLetterApplication.infoCollectionAgreement) {
            this.mspConsentModal.showFullSizeView();
        }
    }

    get MSPEnrollementMember(): MSPEnrollementMember[] {
        return EnrollmentStatusRules.availableStatus();
    }

    setStatus(value: string) {
        this.applicant.enrollmentMember = value;
        this.dataService.saveAccountLetterApplication();
    }


    canContinue(): boolean {
        return this.accountLetterApplication.hasValidAuthToken && this.isAllValid() ;
    }


    handleFormSubmission(evt: any) {

        if (this.canContinue()) {
            this._router.navigate(['/msp/account-letter/sending']);
        } else {

            console.log('Auth token is not valid');
            console.log('Please fill in all required fields on the form.');
        }
        //this.dataService.saveAccountLetterApplication();
    }
    isValid(): boolean {
       return this.applicant.enrollmentMember != undefined && this.accountLetterApplication.isUniquePhns;
    }

    
}
