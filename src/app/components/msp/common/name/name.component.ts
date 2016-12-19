import {Component, Inject, Input} from '@angular/core'
import {Person} from "../../model/person.model";

@Component({
  selector: 'msp-name',
  templateUrl: './name.component.html'
})
export class MspNameComponent {
    lang = require('./i18n');

    @Input() person: Person;
}
