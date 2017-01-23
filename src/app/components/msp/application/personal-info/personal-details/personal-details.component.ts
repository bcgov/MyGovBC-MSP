import  {
  Component, Input, Output, OnChanges, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit, OnInit,
  state, trigger, style, ElementRef
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
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import {MspIdReqModalComponent} from "../../../common/id-req-modal/id-req-modal.component";


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

export class PersonalDetailsComponent implements AfterViewInit {
  lang = require('./i18n');
  langStatus = require('../../../common/status/i18n');
  langActivities = require('../../../common/activities/i18n');
  langDocuments = require('../../../common/documents/i18n');

  // Expose some types to template
  Activities: typeof Activities = Activities;
  Relationship: typeof Relationship = Relationship;
  StatusInCanada: typeof StatusInCanada = StatusInCanada;

  @ViewChild('formRef') form: NgForm;
  @ViewChild('idReqModal') idReqModal: MspIdReqModalComponent;

  @Input() viewOnly: boolean = false;
  @Input() person: Person;
  @Input() id: string;
  @Output() notifyChildRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() notifySpouseRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  shrinkOut: string;
  shrinkOutStatus: string;
  genderListSignal: string;
  institutionWorkSignal: string;

  constructor(){
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
    this.onChange.emit(value);
  }

  setActivity(value:Activities) {
    this.person.currentActivity = value;
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

  addDocument(evt:MspImage){
    console.log('image added: %s', evt);
    this.person.documents.images = [...this.person.documents.images, evt];
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

  personalInfoLabel(): string {
    switch (this.person.relationship) {
      case Relationship.Applicant:
        return this.lang('./en/index.js').applicantPersonalInfo;
      default:
        return '';
    }
  }

  ngAfterViewInit() {
    /**
     * Load an empty row to screen 
     */
    if(this.person.declarationForOutsideOver30Days && this.person.outOfBCRecords.length === 0){
      this.setBeenOutsideForOver30Days(true);      
    }
    if(this.form){
      this.form.valueChanges
      .subscribe(values => {
        this.onChange.emit(values);
      });
    }
  }

  get arrivalDateLabel():string {
    if (this.person.currentActivity == Activities.Returning) {
      return this.lang('./en/index.js').arrivalDateToBCLabelForReturning;
    }
    return this.lang('./en/index.js').arrivalDateToBCLabel;
  }

  provinceUpdate(evt:string){
    this.person.movedFromProvinceOrCountry = evt;
    this.onChange.emit(evt);
  }

  setFullTimeStudent(event: boolean) {
    this.person.fullTimeStudent = event;
    if (!this.person.fullTimeStudent) {
      this.person.inBCafterStudies = null;
    }
    this.onChange.emit(event);
  }

  schoolAddressUpdate(evt:any){
    this.onChange.emit(evt);
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

  addOutofBCRecord() {
    if(this.person.outOfBCRecords.length < 12){
      this.person.outOfBCRecords.push(new OutofBCRecord());
    }
  }

  handleHealthNumberChange(evt:string){
    this.person.healthNumberFromOtherProvince = evt;
    this.onChange.emit(evt);
    
    // console.log('health number changed: ' + evt);
  }

  setBeenOutsideForOver30Days(out:boolean){
    this.person.declarationForOutsideOver30Days = out;
    if(out){
      this.addOutofBCRecord();
    }else {
      this.person.outOfBCRecords = [];
    }
    this.onChange.emit(out);
  }

  handleDeleteOutofBCRecord(evt:OutofBCRecord){
    this.person.outOfBCRecords = this.person.outOfBCRecords.filter(
      rec => {
        return rec.id != evt.id;
      }
    );
    this.onChange.emit(evt);
  }

  handleOutofBCRecordChange(evt:OutofBCRecord){
    this.onChange.emit(evt);
  }

  get outofBCRecordsValid():boolean {
    let valid = true;
    this.person.outOfBCRecords.forEach( rec => {
      valid = valid && rec.isValid();
    });

    return valid;
  }

  viewIdReqModal(event:Documents) {
    this.idReqModal.showFullSizeView(event);
  }
}