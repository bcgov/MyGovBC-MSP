import {
  Component, Input, Output, OnChanges, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit, OnInit,
  state, trigger, style
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Person } from '../../../model/person.model';
import {
  StatusRules, ActivitiesRules, StatusInCanada, Activities,
  DocumentRules, Documents, Relationship
} from "../../../model/status-activities-documents";

require('./personal-details.component.less');

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

export class PersonalDetailsComponent implements OnChanges, AfterViewInit, OnInit {
  lang = require('./i18n');
  langStatus = require('../../../common/status/i18n');
  langActivities = require('../../../common/activities/i18n');
  langDocuments = require('../../../common/documents/i18n');

  // Expose some types to template
  Activities: typeof Activities = Activities;

  @ViewChild('formRef') form: NgForm;

  @Input() viewOnly: boolean = false;
  @Input() person: Person;
  @Output() notifyChildRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() notifySpouseRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() save: EventEmitter<Person> = new EventEmitter<Person>();

  shrinkOut: string;
  shrinkOutStatus: string;
  genderListSignal: string;
  institutionWorkSignal: string;

  genders: string[] = ['Male', 'Female'];
  institutionList: string[] = ['Yes', 'No'];

  /**
   * Gets status available to the current person
   */
  get statusInCanada(): StatusInCanada[] {
    return StatusRules.availableStatus(this.person.relationship);
  }

  setStatus(value:StatusInCanada) {
    this.person.status = value;
    this.person.currentActivity = null;
  }

  setActivity(value:Activities) {
    this.person.currentActivity = value;
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

  /**
   * Change log, for debugging purpose, for input properties on the component
   */
  private changeLog: string[] = [];

  /**
   * propKey is the input property value of this component
   */
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.logPropertyChange(changes);
  }

  private logPropertyChange(changes: { [propKey: string]: SimpleChange }): void {
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      let isFirst = changedProp.isFirstChange();
      let from = JSON.stringify(changedProp.previousValue);
      let to = JSON.stringify(changedProp.currentValue);
      log.push(`${propName} changed from ${from} to ${to}, is first change: ${isFirst}`);
    }
    this.changeLog.push(log.join(', '));
  }

  ngAfterViewInit() {
    if(this.form){
      this.form.valueChanges.subscribe(value => {
        this.save.emit(this.person);
      });
    }
  }

  ngOnInit(){
    // if(this.viewOnlyContainer){
    //   this.viewOnlyContainer.createEmbeddedView(this.viewOnlyTempalte);
    // }
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
    // this.institutionWorkSignal = 'in';
    this.person.institutionWorkHistory = history;
  }

  toggleInstituationList() {
    this.institutionWorkSignal === 'out' ? this.institutionWorkSignal = 'in' : this.institutionWorkSignal = 'out';    
  }

  get isInstitutionListShown() {
    return this.institutionWorkSignal === 'out';
  }
  
}