import {Component, Inject, ViewChild} from '@angular/core'
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';

require('./name.component.less')
@Component({
  selector: 'msp-name',
  templateUrl: './name.component.html'
})
export class MspNameComponent {

    lang = require('./i18n');

    constructor(@Inject('appConstants') appConstants: Object) {
    }
}
