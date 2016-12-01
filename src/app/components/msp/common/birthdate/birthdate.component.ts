import {Component, Input} from '@angular/core'
import {Person} from "../../model/person.model";
require('./birthdate.component.less');

@Component({
  selector: 'msp-birthdate',
  templateUrl: './birthdate.component.html'
})
export class MspBirthDateComponent {

    lang = require('./i18n');

    @Input() person: Person;

}
