import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core'
import {NgForm} from '@angular/forms'
import {Person, Gender} from "../../model/person.model";
import {UUID} from 'angular2-uuid';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'msp-gender',
  templateUrl: './gender.component.html'
})
export class MspGenderComponent extends BaseComponent {

  lang = require('./i18n');

  @ViewChild('formRef') form:NgForm;

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

  ngAfterViewInit() {
    super.ngAfterViewInit();

    let status:boolean = (this.person.gender === Gender.Male || this.person.gender === Gender.Female);
    // console.log('gender component initial validation status: %o', status);
  }

  genderChange(evt:Gender){
    this.form.resetForm();

    this.onChange.emit(evt);

    let status:boolean = (this.person.gender === Gender.Male || this.person.gender === Gender.Female);
    // console.log('Gender component validation status: %o', status);
  }
}
