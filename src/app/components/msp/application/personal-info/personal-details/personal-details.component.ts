import  {
  Component, Input, Output, OnChanges, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit, OnInit,
  state, trigger, style, ElementRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Person } from '../../../model/person.model';
import {
  StatusRules, ActivitiesRules, StatusInCanada, Activities,
  DocumentRules, Documents, Relationship
} from "../../../model/status-activities-documents";
import {Valid} from "../../../common/valid";
import { Observable } from 'rxjs/Observable';

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

export class PersonalDetailsComponent implements AfterViewInit, OnInit {
  lang = require('./i18n');
  langStatus = require('../../../common/status/i18n');
  langActivities = require('../../../common/activities/i18n');
  langDocuments = require('../../../common/documents/i18n');

  // Expose some types to template
  Activities: typeof Activities = Activities;
  Relationship: typeof Relationship = Relationship;

  @ViewChild('formRef') form: NgForm;

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

  personalInfoLabel(): string {
    switch (this.person.relationship) {
      case Relationship.Applicant:
        return this.lang('./en/index.js').applicantPersonalInfo;
      default:
        return '';
    }
  }

  ngAfterViewInit() {
    if(this.form){
      this.form.valueChanges
      .subscribe(values => {
        this.onChange.emit(values);
      });
    }
  }

  ngOnInit(){

  }

  provinceUpdate(evt:string){
    this.person.movedFromProvince = evt;
    this.onChange.emit(evt);
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

  get isInstitutionListShown() {
    return this.institutionWorkSignal === 'out';
  }
  
}