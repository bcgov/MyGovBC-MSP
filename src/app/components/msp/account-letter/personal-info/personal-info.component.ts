import {ChangeDetectorRef,OnChanges, EventEmitter, Output, Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef, Input} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Person} from '../../model/application.model';
import * as _ from 'lodash';
import { fromEvent} from 'rxjs/internal/observable/fromEvent';
import { merge} from 'rxjs/internal/observable/merge';
import { map} from 'rxjs/operators';
import {MspDataService} from '../../service/msp-data.service';
import {MspConsentModalComponent} from '../../common/consent-modal/consent-modal.component';
import {ProcessService} from '../../service/process.service';
import {BaseComponent} from '../../common/base.component';
import { AccountLetterApplication } from '../../model/account-letter-application.model';
import {MspPhnComponent} from '../../common/phn/phn.component';
import {MspBirthDateComponent} from '../../common/birthdate/birthdate.component';
import {MspAddressComponent} from "../../common/address/address.component";
import {Address} from "../../model/address.model";
import {
  StatusRules, ActivitiesRules, Activities, MSPEnrollementMember,
  DocumentRules, Documents, Relationship, EnrollmentStatusRules
} from '../../model/status-activities-documents';
import { environment } from '../../../../../environments/environment';

@Component({
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
@Injectable()
export class AccountLetterPersonalInfoComponent extends BaseComponent {
  static ProcessStepNum = 0;
  lang = require('./i18n');

  @ViewChild('formRef') form: NgForm;
  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;
  @ViewChild('phn') phn: MspPhnComponent;	
  @ViewChild('birthDate') birthdate: MspBirthDateComponent;	

  @Input() person: Person;
  @Input() requirePHN: boolean = true;

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  accountLetterApplication: AccountLetterApplication ;
  address: Address;
  captchaApiBaseUrl: string;
  previousPhn: string;

  // hide and show fields 
  showSpecificMember: boolean;
  showCaptcha: boolean;
  Address: typeof Address = Address;

  langStatus = require('../../common/enrollmentMember/i18n');


  constructor(private dataService: MspDataService,
    private _processService: ProcessService,
    private _router: Router,
    private cd: ChangeDetectorRef) {
    super(cd);
    this.accountLetterApplication = this.dataService.accountLetterApp ;
    this.person = this.dataService.accountLetterApp.applicant;
    console.log(this.accountLetterApplication);
  }

  ngOnInit(){
    this.initProcessMembers(AccountLetterPersonalInfoComponent.ProcessStepNum, this._processService);
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
    
  }

  saveApplication(values: any){
    console.log('--app on change working--');
    this.dataService.saveAccountLetterApplication();
  }

  ngAfterViewInit() {
    
    if (!this.accountLetterApplication.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
    }
  } 

  get MSPEnrollementMember(): MSPEnrollementMember[] {
    console.log('Enrollment status '+EnrollmentStatusRules.availableStatus());
    return EnrollmentStatusRules.availableStatus();
  }

  setStatus(value: string) {
    this.accountLetterApplication.enrollmentMember = value; 
    console.log(this.accountLetterApplication.enrollmentMember);
    this.accountLetterApplication.showSpecificMember = this.accountLetterApplication.enrollmentMember == '2' ? true: false;
    this.accountLetterApplication.showCaptcha = true;
    this.onChange.emit(value);
    this.dataService.saveAccountLetterApplication();
  }

  handleFormSubmission(evt: any){
    console.log('review form formRef.submitted %o', this.form.submitted);
    console.log('combinedValidationState on personal info: %s', this.isAllValid());
        
    if (this.accountLetterApplication.hasValidAuthToken && this.isAllValid()){
      this._router.navigate(['/msp/account-letter/sending']);
    }else{
      console.log('Auth token is not valid');
      console.log('Please fill in all required fields on the form.');
    }
    //this.dataService.saveAccountLetterApplication();
  }
 
}
