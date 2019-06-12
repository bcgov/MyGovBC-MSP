import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Person, Gender } from '../../model/person.model';
import { UUID } from 'angular2-uuid';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'msp-gender',
  templateUrl: './gender.component.html'
})
export class MspGenderComponent extends BaseComponent {
  lang = require('./i18n');

  @ViewChild('formRef') form: NgForm;

  // Expose type to template
  Gender: typeof Gender = Gender;

  @Input('person') person: Person;
  @Input() showError: boolean;

  @Output() onChange = new EventEmitter<any>();

  /**
   * Generate uuid for use in element's ID
   * @type {string}
   */
  uuid = UUID.UUID();

  genderLabels = [
    { label: 'Female', value: this.Gender.Female },
    { label: 'Male', value: this.Gender.Male }
  ];

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  genderChange(evt: Gender) {
    this.onChange.emit(evt);
    this.emitIsFormValid(true);
  }

  isValid(): boolean {
    return this.person && this.person.gender != null;
  }
}
