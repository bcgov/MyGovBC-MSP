import {Component, Inject} from '@angular/core'

require('./birthdate.component.less')
@Component({
  selector: 'msp-birthdate',
  templateUrl: './birthdate.component.html'
})
export class MspBirthDateComponent {

    lang = require('./i18n');

    constructor(@Inject('appConstants') appConstants: Object) {
    }
}
