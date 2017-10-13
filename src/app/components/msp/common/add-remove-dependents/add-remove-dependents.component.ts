import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from '../../model/person.model';

@Component({
  selector: 'msp-add-remove-dependent',
  templateUrl: './add-remove-dependents.component.html',
  styleUrls: ['./add-remove-dependents.component.less']
})
export class AddRemoveDependentComponent implements OnInit {
  @Input() person: Person;
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
  lang = require('./i18n');

  constructor() { }

  change($event){
    console.log('addRemoveDeps component onChange', $event);
    this.onChange.emit();
  }

  ngOnInit() {
  }

  cancelDependentRemoval(){
    this.onCancel.emit();
  }

}
