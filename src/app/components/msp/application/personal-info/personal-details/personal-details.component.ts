import {
  Component, Input, Output, OnChanges, EventEmitter,TemplateRef,
  SimpleChange, ViewChild, AfterViewInit, OnInit, ViewContainerRef,
  animate,transition, state, trigger, style
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { EnumValues } from 'enum-values';

import { Person } from '../../../model/application.model';
import {StatusRules, ActivitiesRules, StatusInCanada, Activities} from "../../../model/status-activities-documents";

require('./personal-details.component.less')
@Component({
    selector: 'msp-personal-details',
    templateUrl: './personal-details.component.html',
    // animations: [
    //   trigger('shrinkOut', [
    //     state('in', style({ height: '*' })),
    //     transition('* => void', [
    //       style({ height: '*' }),
    //       animate(250, style({ height: 0 }))
    //     ])
    //   ])
    // ]


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

  @ViewChild('formRef') form: NgForm;
  // @ViewChild('viewOnlyContainer', {read: ViewContainerRef}) viewOnlyContainer: ViewContainerRef;
  // @ViewChild('viewOnlyTempalte') viewOnlyTempalte: TemplateRef<Object>;

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

  /**
   * Gets the available activities given the known status
   */
  get activities(): Activities[] {
    return ActivitiesRules.availableActivities(this.person.status);
  }

  /**
   * Change log, for debugging purpose, for input properties on the component
   */
  private changeLog: string[] = [];

  constructor(){

  }

  /**
   * propKey is the input property value of this component
   */
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('applicant set on details component: ' + JSON.stringify(this.person));
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

  get legalGender(): string {
    return this.person.legalGender;
  }

  get institutionWorkHistory(): string {
    return this.person.institutionWorkHistory;
  }

  showStatusList(){
    this.shrinkOutStatus === 'out' ? this.shrinkOutStatus = 'in' : this.shrinkOutStatus = 'out';
  }

  get isStatusListShown(){
    return this.shrinkOutStatus === 'out';
  }

  showActivities(){
    this.shrinkOut === 'out' ? this.shrinkOut = 'in' : this.shrinkOut = 'out';
  }

  get isActivitiesListShown() {
    return this.shrinkOut === 'out';
  }

  selectGender(gender: string){
    // this.genderListSignal = 'in';
    this.person.legalGender = gender;
  }

  // toggleGenderList(){
  //   this.genderListSignal === 'out' ? this.genderListSignal = 'in' : this.genderListSignal = 'out';
  // }

  get isGenderListShown(){
    return this.genderListSignal === 'out';
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