import {Component} from '@angular/core';
import DataService from '../../service/msp-data.service';
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";
require('./confirmation.component.less');

@Component({
  templateUrl: './confirmation.component.html'
})
export class AssistanceConfirmationComponent {
  lang = require('./i18n');

  finAssistApp: FinancialAssistApplication;

  constructor(private dataService: DataService) {
    this.finAssistApp = this.dataService.finAssistApp;
  }
}