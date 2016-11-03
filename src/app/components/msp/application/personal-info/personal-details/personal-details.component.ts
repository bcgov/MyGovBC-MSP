import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import {MspApplication, Person} from '../../application';

require('./personal-details.component.less')
@Component({
  selector: 'msp-personal-details',
  templateUrl: './personal-details.component.html'
}
)

export class PersonalDetailsComponent implements OnChanges{
  @Input() person: Person; 
  @Output() notifyChildRemoval: EventEmitter<String> = new EventEmitter<string>();
  @Output() notifySpouseRemoval: EventEmitter<String> = new EventEmitter<string>();

  ngOnChanges():void {
    console.log('applicant set on details component: ' + JSON.stringify(this.person));
  }

  removeChild(id?: string): void{
    console.log('firing removing child: ' + id);
    this.notifyChildRemoval.emit(id);
  }

  removeSpouse(): void {
    console.log('firing removing spouse');
    
    this.notifySpouseRemoval.emit('remove spouse event');
  }
}