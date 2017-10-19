import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Person } from '../../model/person.model';
import { Relationship, StatusInCanada } from '../../model/status-activities-documents';

@Component({
  selector: 'msp-add-remove-dependent',
  templateUrl: './add-remove-dependents.component.html',
  styleUrls: ['./add-remove-dependents.component.less']
})
export class AddRemoveDependentComponent {
  Relationship: typeof Relationship = Relationship;
  StatusInCanada: typeof StatusInCanada = StatusInCanada;
  @Input() person: Person;
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
  /** The element we focus on when this component is inited, for a11y. */
  @ViewChild('firstFocus') firstFocus: ElementRef;
  lang = require('./i18n');

  constructor() { }

  change($event){
    this.onChange.emit();
  }

  ngAfterViewInit(){
    this.firstFocus.nativeElement.focus();
  }

  cancelDependentRemoval(){
    this.onCancel.emit();
  }

}
