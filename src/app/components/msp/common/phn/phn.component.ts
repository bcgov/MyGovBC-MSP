import {Component, Input} from '@angular/core';

require('./phn.component.less');

@Component({
  selector: 'msp-phn',
  templateUrl: './phn.component.html',

})

export class MspPhnComponent {
  lang = require('./i18n');

  @Input() required: boolean = true;
  @Input() phnLabel: string = this.lang("./en/index.js").phnLabel;
  @Input() phn: string;
}