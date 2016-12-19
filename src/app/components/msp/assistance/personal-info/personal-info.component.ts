import { Component } from '@angular/core';
import DataService from '../../service/msp-data.service';
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