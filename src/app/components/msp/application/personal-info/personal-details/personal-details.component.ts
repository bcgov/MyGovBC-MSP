import { Component, Input, Output, OnChanges, EventEmitter, 
    SimpleChange, ViewChild, AfterViewInit} from '@angular/core';
import {FormGroup, NgForm, AbstractControl} from '@angular/forms';

import {MspApplication, Person} from '../../application';

require('./personal-details.component.less')
@Component({
  selector: 'msp-personal-details',
  templateUrl: './personal-details.component.html'
}
)

export class PersonalDetailsComponent implements OnChanges, AfterViewInit{
  @ViewChild('formRef') form: NgForm;

  @Input() person: Person; 
  @Output() notifyChildRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() notifySpouseRemoval: EventEmitter<Person> = new EventEmitter<Person>();

  /**
   * Change log, for debugging purpuse, for input properties on the component
   */
  private changeLog: string[] = [];

  /**
   * propKey is the input property value of this component
   */
  ngOnChanges(changes: {[propKey: string]: SimpleChange}){
    console.log('applicant set on details component: ' + JSON.stringify(this.person));
    this.logPropertyChange(changes);
  }

  private logPropertyChange(changes: {[propKey: string]: SimpleChange}): void{
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      let isFirst = changedProp.isFirstChange();
      let from = JSON.stringify(changedProp.previousValue);
      let to =   JSON.stringify(changedProp.currentValue);
      log.push( `${propName} changed from ${from} to ${to}, is first change: ${isFirst}`);
    }
    this.changeLog.push(log.join(', '));    
  }

  ngAfterViewInit(){
    this.form.valueChanges.subscribe(value => {
      // console.table(value);
    });
  }

  removeChild(): void{
    this.notifyChildRemoval.emit(this.person);
    // this.notifyChildRemoval.next(id);
  }

  removeSpouse(): void {
    this.notifySpouseRemoval.emit(this.person);
  }

}