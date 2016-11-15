import { Component } from '@angular/core';
require('./personal-info.component.less');

@Component({
  templateUrl: './personal-info.component.html'
})
export class AssistancePersonalInfoComponent {
  lang = require('./i18n');
}