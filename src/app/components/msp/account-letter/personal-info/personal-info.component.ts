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

  //MSPEnrollementMember: typeof MSPEnrollementMember = MSPEnrollementMember;

  langStatus = require('../../common/enrollmentMember/i18n');
  langActivities = require('../../common/activities/i18n');

  Activities: typeof Activities = Activities;

  constructor(private dataService: MspDataService,
    private _processService: ProcessService,
    private _router: Router,
    private cd: ChangeDetectorRef) {
    super(cd);
    //this.accountLetterApplication = this.dataService.getaccountLetterApplication();
    this.accountLetterApplication = this.dataService.accountLetterApp ;
    this.person = this.dataService.accountLetterApp.applicant;
    console.log(this.person);
    this.address = this.dataService.accountLetterApp.applicant.residentialAddress ;
  }

  ngOnInit(){
    this.initProcessMembers(AccountLetterPersonalInfoComponent.ProcessStepNum, this._processService);
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
    //this.setHasPreviousPhn(true);
  }

  saveApplication(values: any){
    console.log('--app on change working--');
    this.dataService.saveAccountLetterApplication();
  }

  ngAfterViewInit() {

    console.log(this.accountLetterApplication.infoCollectionAgreement);

    if (!this.accountLetterApplication.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
    }

  } 

  get MSPEnrollementMember(): MSPEnrollementMember[] {
    return EnrollmentStatusRules.availableStatus();
  }

  setStatus(value: string) {
    this.person.enrollmentStatus = value;
    console.log(this.person.enrollmentStatus);
    this.person.showSpecificMember = this.person.enrollmentStatus == '2' ? true: false;
    this.person.showCaptcha = true;
    this.onChange.emit(value);
  }

  handleFormSubmission(evt: any){
    console.log('review form submitted, %o', evt);
    this.dataService.saveAccountLetterApplication();
    if (this.accountLetterApplication.hasValidAuthToken){
      this._router.navigate(['/msp/account-letter/sending']);
    }else{
      console.log('Auth token is not valid');
    }
  }
 
}
