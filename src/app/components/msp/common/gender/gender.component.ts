import {Component, Input} from '@angular/core'
import {Person, Gender} from "../../model/person.model";

@Component({
  selector: 'msp-gender',
  templateUrl: './gender.component.html'
})
export class MspGenderComponent {

    lang = require('./i18n');

    // Expose type to template
    Gender: typeof Gender = Gender;

    @Input() person: Person;


}
