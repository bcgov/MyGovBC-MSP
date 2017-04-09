import  {
  Component, Input, Output, OnChanges, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit, OnInit, OnDestroy,
  state, trigger, style, ElementRef, QueryList, ViewChildren, ChangeDetectorRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Person } from '../../../model/person.model';
import { OutofBCRecord } from '../../../model/outof-bc-record.model';
import {
  StatusRules, ActivitiesRules, StatusInCanada, Activities,
  DocumentRules, Documents, Relationship
} from "../../../model/status-activities-documents";
import { MspImage } from '../../../model/msp-image';
import {Valid} from "../../../common/valid";
import * as _ from 'lodash';
import {MspIdReqModalComponent} from "../../../common/id-req-modal/id-req-modal.component";
import {MspImageErrorModalComponent} from "../../../common/image-error-modal/image-error-modal.component";
import {FileUploaderComponent} from "../../../common/file-uploader/file-uploader.component";
import {MspBirthDateComponent} from "../../../common/birthdate/birthdate.component";
import {MspNameComponent} from "../../../common/name/name.component";
import {MspGenderComponent} from "../../../common/gender/gender.component";
import {MspPhnComponent} from "../../../common/phn/phn.component";
import {HealthNumberComponent} from "../../../common/health-number/health-number.component";
import {MspDischargeDateComponent} from "../../../common/discharge-date/discharge-date.component";

import {MspArrivalDateComponent} from "../../../common/arrival-date/arrival-date.component";
import {MspOutofBCRecordComponent} from "../../../common/outof-bc/outof-bc.component";
import {MspProvinceComponent} from "../../../common/province/province.component";
import {ValidationStatus} from "../../../common/validation-status.interface";
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Component({
    selector: 'msp-personal-details',
    templateUrl: './personal-details.component.html',

    animations: [
      trigger('shrinkOut', [
        state('in', style({ display: 'none'})),
        state('out', style({ display: 'block'}))
        // transition('* => *', animate(500))
      ]),

      trigger('shrinkOutStatus', [
        state('in', style({ display: 'none' })),
        state('out', style({ display: 'block'}))
        // transition('* => *', animate(500))
      ]),

      trigger('genderListSignal', [
        state('in', style({ display: 'none' })),
        state('out', style({ display: 'block'}))
        // transition('* => *', animate(500))
      ]),
      
      trigger('institutionWorkSignal', [
        state('in', style({ display: 'none' })),
        state('out', style({ display: 'block'}))
        // transition('* => *', animate(500))
      ])
    ]
    
  }
)

export class PersonalDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  lang = require('./i18n');
  langStatus = require('../../../common/status/i18n');
  langActivities = require('../../../common/activities/i18n');
  langDocuments = require('../../../common/documents/i18n');

  // Expose some types to template
  Activities: typeof Activities = Activities;
  Relationship: typeof Relationship = Relationship;
  StatusInCanada: typeof StatusInCanada = StatusInCanada;

  @ViewChild('formRef') form: NgForm;
  @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  @ViewChild('idReqModal') idReqModal: MspIdReqModalComponent;
  @ViewChild('imageErrorModal') imageErrorModal: MspImageErrorModalComponent;

  private nameComponent: MspNameComponent;
  private birthDateComponent:MspBirthDateComponent;

  private genderComponent:MspGenderComponent;
  private provinceComponent:MspProvinceComponent;
  private outofBCComponent: MspOutofBCRecordComponent;
  private arrivalDateComponentList:MspArrivalDateComponent[] = [];
  private phnComponent:MspPhnComponent;
  private healthNumberComponent:HealthNumberComponent;
  private dischargeDateComponent:MspDischargeDateComponent;
  
  @Input() viewOnly: boolean = false;
  @Input() person: Person;
  @Input() id: string;
  @Input() showError: boolean;
  @Output() notifyChildRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() notifySpouseRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() isFormValid = new EventEmitter<boolean>();
  @Output() registerPersonalDetailsComponent = new EventEmitter<PersonalDetailsComponent>();
  @Output() unRegisterPersonalDetailsComponent = new EventEmitter<PersonalDetailsComponent>();
  shrinkOut: string;
  shrinkOutStatus: string;
  genderListSignal: string;
  institutionWorkSignal: string;

  // validitySubscription:Subscription;

  nameValidStatus:boolean = false;
  dobValidStatus:boolean = false;
  genderValidStatus:boolean = false;
  // provinceValidStatus:boolean = true;
  phnValidStatus:boolean = true;
  arrivalDatesValidStatus:boolean[] = [];
  dischargeDateValidStatus:boolean = true;

  //default to true because it is optional
  healthNumberValidStatus:boolean = true;
  
  outofBCFormValidStatus:boolean = true;

  subscriptions:Subscription[] = [];

  constructor(private el:ElementRef,
    private cd: ChangeDetectorRef){

  }

  statusLabel(): string {
    return this.lang('./en/index.js').statusLabel[this.person.relationship]
  }

  genders: string[] = ['Male', 'Female'];
  institutionList: string[] = ['Yes', 'No'];

  
  /**
   * Gets status available to the current person
   */
  get statusInCanada(): StatusInCanada[] {
    return StatusRules.availableStatus(this.person.relationship);
  }

  setStatus(value:StatusInCanada, p: Person) {
    p.status = value;
    p.currentActivity = null;

    if(p.status !== StatusInCanada.CitizenAdult){
      p.institutionWorkHistory = 'No';
    }
    this.onChange.emit(value);
  }

  setActivity(value:Activities) {
    this.person.currentActivity = value;
    this.person.movedFromProvinceOrCountry = '';
    this.onChange.emit(value);
  }

  /**
   * Gets the available activities given the known status
   */
  get activities(): Activities[] {
    return ActivitiesRules.availableActivities(this.person.relationship, this.person.status);
  }

  /**
   * Gets the available documents given the known status and activity
   */
  get documents(): Documents[] {
    return DocumentRules.availiableDocuments(this.person.status, this.person.currentActivity);
  }

  /**
   * Gets the available documents given the known status and activity
   */
  get nameChangeDocuments(): Documents[] {
    return DocumentRules.nameChangeDocument();
  }

  addDocument(evt:MspImage){
    // console.log('image added: %s', evt);
    this.person.documents.images = this.person.documents.images.concat(evt);
    this.fileUploader.forceRender();
    this.onChange.emit(evt);
  }

  deleteDocument(evt:MspImage){
    this.person.documents.images = this.person.documents.images.filter( 
      (mspImage:MspImage) => {
        return evt.uuid !== mspImage.uuid;
      }
    );
    this.onChange.emit(evt);
  }

  errorDocument(evt:MspImage) {
    this.imageErrorModal.imageWithError = evt;
    this.imageErrorModal.showFullSizeView();
    this.imageErrorModal.forceRender();
  }

  ngOnInit(){
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe(
      (values) => {
        this.onChange.emit(values);
      }
    );
    /**
     * Register this component with its parent.
     */
    this.registerPersonalDetailsComponent.emit(this);
    
    this.updateSubscription();
    this.emitFormValidationStatus();
    this.cd.detectChanges();
    /**
     * Load an empty row to screen 
     */
    if(this.person.relationship === Relationship.Spouse){
      window.scrollTo(0,this.el.nativeElement.offsetTop);
    }
  }

  updateSubscription(){
    this.unsubscribeAll();
    if(this.birthDateComponent){
      this.subscriptions.push(this.birthDateComponent.isFormValid
        .subscribe( (status:boolean) => {
          this.dobValidStatus = status;
          // console.log('dobValid status value: %s', this.dobValidStatus);
          this.emitFormValidationStatus();
        })
      );
    }

    if(this.nameComponent){
      this.subscriptions.push(this.nameComponent.isFormValid
        .subscribe(
          (status:boolean) => {
            this.nameValidStatus = status;
            this.emitFormValidationStatus();
          }
        )
      );
    }

    if(this.genderComponent){
      this.subscriptions.push(this.genderComponent.isFormValid
        .subscribe(
          (status:boolean) => {
            this.genderValidStatus = status;
            this.emitFormValidationStatus();
          }
        )
      );
    }

    if(this.provinceComponent){
      this.subscriptions.push(this.provinceComponent.isFormValid
        .subscribe(
          (status:boolean) => {
            console.log('province component validation status: %s', status);
            this.emitFormValidationStatus();
          }
        )
      );
    }

    if(this.phnComponent){
      this.subscriptions.push(this.phnComponent.isFormValid
        .subscribe(
          (status:boolean) => {
            this.phnValidStatus = status;
            this.emitFormValidationStatus();
          }
        )
      );
    }

    if(this.outofBCComponent){
      this.subscriptions.push(this.outofBCComponent.isFormValid
        .subscribe(
          (status:boolean) => {
            this.outofBCFormValidStatus = status;
            // console.log('outofBCFormValidStatus in personal details: %s', this.outofBCFormValidStatus);
            this.emitFormValidationStatus();
          }
        )
      );
    }
    
    if(this.healthNumberComponent){
      this.subscriptions.push(this.healthNumberComponent.isFormValid
        .subscribe(
          (status:boolean) => {
            this.healthNumberValidStatus = status;
            this.emitFormValidationStatus();
          }
        )
      );
    }

    if(this.dischargeDateComponent){
      this.dischargeDateComponent.isFormValid
        .subscribe(
          (status:boolean) => {
            this.dischargeDateValidStatus = status;
            this.emitFormValidationStatus();
          }
        );
    }

    let arrivalDateObvs:Observable<boolean>[] = this.arrivalDateComponentList.map( bcom => {
      return bcom.isFormValid;
    });

    arrivalDateObvs.forEach( (arrivalDateObs:Observable<boolean>, idx:number) => {
      this.subscriptions.push(arrivalDateObs.subscribe(
          (status:boolean) => {
            this.arrivalDatesValidStatus[idx] = status;
            this.emitFormValidationStatus();
          }
        )
      );
    });
  }

  emitFormValidationStatus() {
    let countryOrProvinceProvided = !!this.person.movedFromProvinceOrCountry
      && this.person.movedFromProvinceOrCountry.trim().length > 0;

      /**
       * Don't need to provide where from info on country or province for the following cases: 
       * Canadian citizen living in BC without MSP
       * Permanant resident living in BC without MSP
       */
    let countryOrProvinceRequired = 
      !((this.person.status === StatusInCanada.CitizenAdult || this.person.status === StatusInCanada.PermanentResident)
        && this.person.currentActivity === Activities.LivingInBCWithoutMSP);

    let cntyOrProvValid:boolean = true;
    if(countryOrProvinceRequired){
      cntyOrProvValid = countryOrProvinceProvided;
    }

    let totalFormStatus: boolean =
      this.dobValidStatus &&
      this.nameValidStatus &&
      this.genderValidStatus &&
      cntyOrProvValid &&
      this.outofBCFormValidStatus;

    let combinedArrivalDateValidStatus =
      this.arrivalDatesValidStatus.reduce(
        (acc: boolean, cur: boolean) => {
          return acc && cur;
        }, true
      );

      
    let movedToBC = _.isBoolean(this.person.madePermanentMoveToBC);
    let hasPrevPhnAnswer = _.isBoolean(this.person.hasPreviousBCPhn);
    let armedForceHistoryAnswer = this.person.institutionWorkHistory && (this.person.institutionWorkHistory.toLowerCase() === 'yes' ||
      this.person.institutionWorkHistory.toLowerCase() === 'no');

    let fullTimeStutAnswer = _.isBoolean(this.person.fullTimeStudent);
    let inBCAfterStudyAnswer = true;

    if(this.person.fullTimeStudent === true){
      inBCAfterStudyAnswer = _.isBoolean(this.person.inBCafterStudies);
    }

    totalFormStatus = totalFormStatus 
      && combinedArrivalDateValidStatus 
      && movedToBC 
      && hasPrevPhnAnswer
      && this.phnValidStatus
      && armedForceHistoryAnswer
      && this.dischargeDateValidStatus
      && fullTimeStutAnswer
      && inBCAfterStudyAnswer
      && this.healthNumberValidStatus;
    
    // console.log('personal details totalFormStatus: %s', totalFormStatus);
    // this.isFormValid.emit(totalFormStatus);
    return totalFormStatus;
  }

  ngOnDestroy(){
    this.unsubscribeAll();
    this.unRegisterPersonalDetailsComponent.emit(this);
  }
  
  unsubscribeAll(){
    this.subscriptions.forEach(
      (sub:Subscription) => {
        sub.unsubscribe();
      }
    )
  }

  onRegisterOutOfBCComponent(comp:MspOutofBCRecordComponent){
    this.outofBCComponent = comp;
    this.updateSubscription();
  }

  onUnregisterOutOfBCComponent(comp:MspOutofBCRecordComponent){
    this.outofBCComponent = null;
    this.updateSubscription();
  }

  onRegisterBirthDateComponent(comp:MspBirthDateComponent){
    this.birthDateComponent = comp;
    this.updateSubscription();
  }
  onRegisterArrivalDateComponent(comp:MspArrivalDateComponent){
    this.arrivalDateComponentList.push(comp);
    this.updateSubscription();
  }

  onRegisterMspNameComponent(comp:MspNameComponent){
    this.nameComponent = comp;
    this.updateSubscription();
  }

  onRegisterGenderComponent(comp:MspGenderComponent){
    this.genderComponent = comp;
    this.updateSubscription();
  }

  onRegisterMspProvinceComponent(comp:MspProvinceComponent){
    this.provinceComponent = comp;
    this.updateSubscription();
  }  
  onUnregisterMspProvinceComponent(){
    this.provinceComponent = null;
    // this.updateSubscription();
  }  

  onRegisterHealthNumberComponent(comp:HealthNumberComponent){
    this.healthNumberComponent = comp;
    this.updateSubscription();
  }

  onUnregisterHealthNumberComponent(){
    this.healthNumberComponent = null;
  }

  onRegisterPhnComponent(comp:MspPhnComponent){
    this.phnComponent = comp;
    this.updateSubscription();
  }

  onUnregisterPhnComponent(){
    this.phnComponent = null;
  }

  onRegisterDischargeDate(c:MspDischargeDateComponent){
    this.dischargeDateComponent = c;
    this.updateSubscription();
  }

  onUnRegisterDischargeDate(){
    this.dischargeDateComponent = null;
  }

  get arrivalDateLabel():string {
    if (this.person.currentActivity == Activities.LivingInBCWithoutMSP) {
      return this.lang('./en/index.js').arrivalDateToBCLabelForReturning;
    }
    return this.lang('./en/index.js').arrivalDateToBCLabel;
  }

  provinceUpdate(evt:string){
    this.person.movedFromProvinceOrCountry = evt;
    this.onChange.emit(evt);
  }

  get schoolInBC():boolean {
    return this.person.schoolAddress
      && this.person.schoolAddress.province 
      && this.person.schoolAddress.province.toLowerCase() === 'british columbia';
  }
  setFullTimeStudent(event: boolean) {
    this.person.fullTimeStudent = event;
    if (!this.person.fullTimeStudent) {
      this.person.inBCafterStudies = null;
    }
    this.onChange.emit(event);
    this.emitFormValidationStatus();
  }
  setStayInBCAfterStudy(event:boolean){
    this.person.inBCafterStudies = event; 
    this.emitFormValidationStatus();
    this.onChange.emit(event)    
  }

  schoolAddressUpdate(evt:any){
    this.onChange.emit(evt);
  }


  setHasPreviousPhn(value:boolean){
    this.person.hasPreviousBCPhn = value;
    this.emitFormValidationStatus();
    this.onChange.emit(value);    
    this.cd.detectChanges();
  }
  updateSchoolExpectedCompletionDate(evt:any){
    // console.log('school expected completion date updated: %o', evt);
    this.person.studiesFinishedDay = evt.day;
    this.person.studiesFinishedMonth = evt.month;
    this.person.studiesFinishedYear = evt.year;
    this.onChange.emit(evt);
  }

  updateSchoolDepartureDate(evt:any){
    // console.log('school departure date updated: %o', evt);
    this.person.studiesDepartureDay = evt.day;
    this.person.studiesDepartureMonth = evt.month;
    this.person.studiesDepartureYear = evt.year;
    this.onChange.emit(evt);
  }  

  removeChild(): void {
    this.notifyChildRemoval.emit(this.person);
    // this.notifyChildRemoval.next(id);
  }

  removeSpouse(): void {
    this.notifySpouseRemoval.emit(this.person);
  }

  get institutionWorkHistory(): string {
    return this.person.institutionWorkHistory;
  }

  selectInstitution(history: string) {
    this.person.institutionWorkHistory = history;
    if (history == 'No') {
      this.person.dischargeDay = null;
      this.person.dischargeMonth = null;
      this.person.dischargeYear = null;
    }
    this.emitFormValidationStatus();
    this.onChange.emit(history);
  }

  toggleInstituationList() {
    this.institutionWorkSignal === 'out' ? this.institutionWorkSignal = 'in' : this.institutionWorkSignal = 'out';    
  }

  get hasValidCurrentActivity(): boolean{
    let v = _.isNumber(this.person.currentActivity);
    return v;
  }

  get isInstitutionListShown() {
    return this.institutionWorkSignal === 'out';
  }

  handleHealthNumberChange(evt:string){
    this.person.healthNumberFromOtherProvince = evt;
    this.onChange.emit(evt);
    
  }

  setBeenOutsideForOver30Days(out:boolean){
    this.person.declarationForOutsideOver30Days = out;
    if(out){
      this.person.outOfBCRecord = new OutofBCRecord();
    }else {
      this.person.outOfBCRecord = null;
    }
    
    this.onChange.emit(out);
  }

  handleDeleteOutofBCRecord(evt:OutofBCRecord){
    this.person.outOfBCRecord = null;
    this.onChange.emit(evt);
  }

  handleOutofBCRecordChange(evt:OutofBCRecord){
    this.onChange.emit(evt);
  }

  get outofBCRecordsValid():boolean {
    let valid = true;
    this.person.outOfBCRecord.isValid();

    return valid;
  }

  setMovedToBCPermanently(moved:boolean){
    this.person.madePermanentMoveToBC = moved;
    this.onChange.emit(moved);
  }
  setLivedInBCSinceBirth(lived:boolean){
    this.person.livedInBCSinceBirth = lived;
    this.onChange.emit(lived);
  }

  viewIdReqModal(event:Documents) {
    this.idReqModal.showFullSizeView(event);
  }
}
