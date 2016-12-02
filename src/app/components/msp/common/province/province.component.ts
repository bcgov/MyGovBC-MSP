import {Component, Input} from '@angular/core'

require('./province.component.less')
@Component({
  selector: 'msp-province',
  templateUrl: './province.component.html'
})

export class MspProvinceComponent {

    lang = require('./i18n');

    @Input() province: string;

    @Input() provinceLabel: string = this.lang('./en/index.js').provinceLabel;
}
