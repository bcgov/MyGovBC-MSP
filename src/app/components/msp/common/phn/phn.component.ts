import {Component, Inject, Input} from '@angular/core'

require('./phn.component.less')
@Component({
  selector: 'msp-phn',
  templateUrl: './phn.component.html'
})
export class MspPhnComponent {
    lang = require('./i18n');

    @Input() phn: String;

    constructor(@Inject('appConstants') appConstants: Object) {
    }
}
