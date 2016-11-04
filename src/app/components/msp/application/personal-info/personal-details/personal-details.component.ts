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
        state('in', style({ display: 'none' })),
        state('out', style({ display: 'block'}))
      ]),

      trigger('shrinkOutStatus', [
        state('in', style({ display: 'none' })),
        state('out', style({ display: 'block'}))
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

  get activity(): string {
    return this.person.currentActivity;
  }

  selectStatus(st: string) {
    this.shrinkOutStatus = 'in';
    this.person.status = st;
  }

  selectActivity(act: string) {
    this.shrinkOut = 'in';
    this.person.currentActivity = act;
  }

  showActivities(){
    this.shrinkOut = 'out';
  }

  showStatusList(){
    this.shrinkOutStatus = 'out';
  }
  
}