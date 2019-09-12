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
import { Gender, MspPerson } from '../../model/msp-person.model';
import { UUID } from 'angular2-uuid';
import { BaseComponent } from '../../../../models/base.component';

@Component({
  selector: 'msp-gender',
  templateUrl: './gender.component.html'
})
export class MspGenderComponent extends BaseComponent {
  lang = require('./i18n');

  @ViewChild('formRef') form: NgForm;

  // Expose type to template
  Gender: typeof Gender = Gender;

  @Input('person') person: MspPerson;
  @Input() showError: boolean;

  @Output() onChange = new EventEmitter<any>();

  /**
   * Generate uuid for use in element's ID
   * @type {string}
   */
  uuid = UUID.UUID();

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
