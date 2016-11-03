import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import {MspApplication, Applicant, Person} from '../../application';

require('./personal-details.component.less')
@Component({
  selector: 'msp-personal-details',
  templateUrl: './personal-details.component.html'
}
)

export class PersonalDetailsComponent implements OnChanges{
  @Input() person: Person; 
  @Output('removeDependent') notifyRemoval: EventEmitter<String> = new EventEmitter<string>();

  ngOnChanges():void {
    console.log('applicant set on details component: ' + JSON.stringify(this.person));
  }

  removeDependent(id?: string): void{
    console.log('firing removing dependent');
    this.notifyRemoval.emit(id);
  }
}