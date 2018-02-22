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
import * as _ from 'lodash';
import {MspIdReqModalComponent} from "../../../common/id-req-modal/id-req-modal.component";
import {MspImageErrorModalComponent} from "../../../common/image-error-modal/image-error-modal.component";
import {FileUploaderComponent} from "../../../common/file-uploader/file-uploader.component";
import {MspBirthDateComponent} from "../../../common/birthdate/birthdate.component";
import {MspNameComponent} from "../../../common/name/name.component";
import {MspGenderComponent} from "../../../common/gender/gender.component";
import {MspPhnComponent} from "../../../common/phn/phn.component";
import {MspSchoolDateComponent} from "../../../common/schoolDate/school-date.component";
import {HealthNumberComponent} from "../../../common/health-number/health-number.component";
import {MspDischargeDateComponent} from "../../../common/discharge-date/discharge-date.component";
import {MspAddressComponent} from "../../../common/address/address.component";
import {ServicesCardDisclaimerModalComponent} from "../../../common/services-card-disclaimer/services-card-disclaimer.component"

import {MspArrivalDateComponent} from "../../../common/arrival-date/arrival-date.component";
import {MspOutofBCRecordComponent} from "../../../common/outof-bc/outof-bc.component";
import {MspProvinceComponent} from "../../../common/province/province.component";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import {BaseComponent} from "../../../common/base.component";
import {MspCountryComponent} from "../../../common/country/country.component";
@Component({
    selector: 'msp-personal-details',
    templateUrl: './personal-details.component.html',
    styleUrls: ['./personal-details.component.less'],

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

export class PersonalDetailsComponent extends BaseComponent {
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
  @ViewChild('outOfBCRecord') outOfBCRecord: MspOutofBCRecordComponent;
  @ViewChild('gender') gender: MspGenderComponent;
  @ViewChild('birthDate') birthdate: MspBirthDateComponent;
  @ViewChild('name') name: MspNameComponent;
  @ViewChild('country') country: MspCountryComponent;
  @ViewChild('province') province: MspProvinceComponent;
  @ViewChild('arrivalDateBC') arrivalDateBC: MspArrivalDateComponent;
  @ViewChild('arrivalDateCanada') arrivalDateCanada: MspArrivalDateComponent;
  @ViewChild('healthNumber') healthNumber: HealthNumberComponent;
  @ViewChild('phn') phn: MspPhnComponent;
  @ViewChild('armedForcedQuestion') armedForcedQuestion: HTMLElement;
  @ViewChild('dischargeDate') dischargeDate: MspDischargeDateComponent;
  @ViewChild('schoolQuestion') schoolQuestion: HTMLElement;
  @ViewChild('inBCAfterStudiesQuestion') inBCAfterStudiesQuestion: HTMLElement;
  @ViewChild('schoolAddress') schoolAddress: MspAddressComponent;
  @ViewChild('schoolDate') schoolDate: MspSchoolDateComponent;
  @ViewChild('mspServicesCardModal') servicesCardDisclaimerModalComponent: ServicesCardDisclaimerModalComponent;

  @Input() person: Person;
  @Input() id: string;
  @Input() showError: boolean;
  @Output() notifyChildRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() notifySpouseRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  shrinkOut: string;
  shrinkOutStatus: string;
  genderListSignal: string;
  institutionWorkSignal: string;
  showServicesCardModal: boolean = false;

  constructor(private el:ElementRef,
    private cd: ChangeDetectorRef){
    super(cd);
  }

  statusLabel(): string {
    return this.lang('./en/index.js').statusLabel[this.person.relationship]
  }

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
    this.showServicesCardModal = true ;

    this.onChange.emit(value);
  }

  setActivity(value:Activities) {

      if (this.showServicesCardModal && this.person.bcServiceCardShowStatus && this.person.relationship != this.Relationship.ChildUnder19) {
          this.servicesCardDisclaimerModalComponent.showModal();
          this.showServicesCardModal = false;
      }

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
    console.info('$fileParent (1) addDocument', {images: this.person.documents.images, evt: evt})
    
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

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this.cd.detectChanges();
    /**
     * Load an empty row to screen 
     */
    if(this.person.relationship === Relationship.Spouse){
      window.scrollTo(0,this.el.nativeElement.offsetTop);
    }
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
    this.emitIsFormValid();
  }
  setStayInBCAfterStudy(event:boolean){
    this.person.inBCafterStudies = event; 
    this.onChange.emit(event)
    this.emitIsFormValid();
    this.emitIsFormValid();
  }

  schoolAddressUpdate(evt:any){
    this.onChange.emit(evt);
  }


  setHasPreviousPhn(value:boolean){
    this.person.hasPreviousBCPhn = value;
    this.onChange.emit(value);
    this.cd.detectChanges();
    this.emitIsFormValid();
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
    this.cd.detectChanges();
    this.onChange.emit(history);
    this.emitIsFormValid();
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
    this.cd.detectChanges();
    this.onChange.emit(out);
    this.emitIsFormValid();
  }

  handleDeleteOutofBCRecord(evt:OutofBCRecord){
    this.person.outOfBCRecord = null;
    this.onChange.emit(evt);
  }

  handleOutofBCRecordChange(evt:OutofBCRecord){
    this.onChange.emit(evt);
  }
    //If false, then we don't want users continuing to further application;
  checkEligibility(): boolean {
        return !this.person.ineligibleForMSP;
  }

  setMovedToBCPermanently(moved:boolean){
    this.person.madePermanentMoveToBC = moved;
    this.onChange.emit(moved);
    this.emitIsFormValid();
  }
  setLivedInBCSinceBirth(lived:boolean){
    this.person.livedInBCSinceBirth = lived;
    this.onChange.emit(lived);
    this.emitIsFormValid();
    this.cd.detectChanges();
  }

  viewIdReqModal(event:Documents) {
    this.idReqModal.showFullSizeView(event);
  }

  isValid(): boolean {
    // Some inputs can be determine via the form.isValid,
    // check these explicitly

    // Status
    if (this.person.currentActivity == null) {
      return false;
    }

    // moved to bc permanently
    if (this.person.madePermanentMoveToBC == null) {
      console.log("madePermanentMoveToBC invalid");
      return false;
    }

    // outside bc 30 days
    if (this.person.declarationForOutsideOver30Days == null) {
      console.log("declarationForOutsideOver30Days invalid");
      return false;
    }

    // previous PHN
    if (this.person.hasPreviousBCPhn == null) {
      console.log("hasPreviousBCPhn invalid");
      return false;
    }

    // armed forces
    if (this.armedForcedQuestion != null &&
      this.person.institutionWorkHistory == null) {
      console.log("institutionWorkHistory invalid");
      return false;
    }

    // school
    if (this.schoolQuestion != null &&
      this.person.fullTimeStudent == null) {
      console.log("schoolQuestion invalid");
      return false;
    }
    if (this.person.fullTimeStudent &&
      this.person.inBCafterStudies == null) {
      console.log("inBCafterStudies invalid");
      return false;
    }

    return true;
  }
}
