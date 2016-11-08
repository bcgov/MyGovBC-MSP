import {
  Component, Input, Output, OnChanges, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit,
  animate,transition, state, trigger, style
} from '@angular/core';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';

import { MspApplication, Person } from '../../application';

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

export class PersonalDetailsComponent implements OnChanges, AfterViewInit {
  @ViewChild('formRef') form: NgForm;

  @Input() person: Person;
  @Output() notifyChildRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() notifySpouseRemoval: EventEmitter<Person> = new EventEmitter<Person>();

  shrinkOut: string;
  shrinkOutStatus: string;
  genderListSignal: string;
  institutionWorkSignal: string;

  genders: string[] = ['Male', 'Female'];
  institutionList: string[] = ['Yes', 'No'];

  lang = require('./i18n');

  public statusInCanada: string[] = [
    'Canadian citizen',
    'Permanent resident',
    'Temporary resident'
  ];

  public activities: string[] = [
    'Returning to BC from abroad',
    'Moving to BC from another Canadian province'
  ];
  /**
   * Change log, for debugging purpuse, for input properties on the component
   */
  private changeLog: string[] = [];

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
    this.form.valueChanges.subscribe(value => {
      // console.table(value);
    });
  }

  removeChild(): void {
    this.notifyChildRemoval.emit(this.person);
    // this.notifyChildRemoval.next(id);
  }

  removeSpouse(): void {
    this.notifySpouseRemoval.emit(this.person);
  }

  get personStatus(): string {
    return this.person.status;
  }

  get legalGender(): string {
    return this.person.legalGender;
  }

  get institutionWorkHistory(): string {
    return this.person.institutionWorkHistory;
  }

  get activity(): string {
    return this.person.currentActivity;
  }

  selectStatus(st: string) {
    this.shrinkOutStatus = 'in';
    this.person.status = st;
  }

  showStatusList(){
    this.shrinkOutStatus === 'out' ? this.shrinkOutStatus = 'in' : this.shrinkOutStatus = 'out';
  }

  get isStatusListShown(){
    return this.shrinkOutStatus === 'out';
  }

  selectActivity(act: string) {
    this.shrinkOut = 'in';
    this.person.currentActivity = act;
  }

  showActivities(){
    this.shrinkOut === 'out' ? this.shrinkOut = 'in' : this.shrinkOut = 'out';
  }

  get isActivitiesListShown() {
    return this.shrinkOut === 'out';
  }

  selectGender(gender: string){
    this.genderListSignal = 'in';
    this.person.legalGender = gender;
  }

  toggleGenderList(){
    this.genderListSignal === 'out' ? this.genderListSignal = 'in' : this.genderListSignal = 'out';
  }

  get isGenderListShown(){
    return this.genderListSignal === 'out';
  }

  selectInstitution(history: string) {
    this.institutionWorkSignal = 'in';
    this.person.institutionWorkHistory = history;
  }

  toggleInstituationList() {
    this.institutionWorkSignal === 'out' ? this.institutionWorkSignal = 'in' : this.institutionWorkSignal = 'out';    
  }

  get isInstitutionListShown() {
    return this.institutionWorkSignal === 'out';
  }
  
}