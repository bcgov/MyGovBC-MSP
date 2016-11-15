import {Component, Inject} from '@angular/core'

require('./phone.component.less')
@Component({
  selector: 'msp-phone',
  templateUrl: './phone.component.html'
})
export class MspPhoneComponent {

    lang = require('./i18n');

    constructor(@Inject('appConstants') appConstants: Object) {
    }
}
