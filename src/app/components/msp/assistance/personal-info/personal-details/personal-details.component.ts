import { Component } from '@angular/core';
require('./personal-details.component.less');

@Component({
  selector: 'msp-assistance-personal-details',
  templateUrl: './personal-details.component.html'
})
export class AssistancePersonalDetailComponent {
  lang = require('./i18n');
}