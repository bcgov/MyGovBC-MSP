import {Component, Input} from '@angular/core';
import {Person} from "../../../model/person.model";

@Component({
  selector: 'msp-assistance-personal-details',
  templateUrl: './personal-details.component.html'
})
export class AssistancePersonalDetailComponent {
  lang = require('./i18n');

  @Input() person: Person;

}