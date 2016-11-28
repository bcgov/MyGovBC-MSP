import { Component } from '@angular/core';
require('./personal-info.component.less');
import DataService from '../../application/application-data.service';
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";

@Component({
  templateUrl: './personal-info.component.html'
})
export class AssistancePersonalInfoComponent {
  lang = require('./i18n');

  financialAssistApplication: FinancialAssistApplication;

  constructor(private dataService: DataService) {
    this.financialAssistApplication = this.dataService.finAssistApp;
  }
}