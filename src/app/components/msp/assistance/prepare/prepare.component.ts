import { Component } from '@angular/core';
import DataService from '../../application/application-data.service';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';

require('./prepare.component.less');

@Component({
  templateUrl: './prepare.component.html'
})
export class AssistancePrepareComponent {
  lang = require('./i18n');

  constructor(private dataService: DataService){

  }

  get finAssistApp(): FinancialAssistApplication{
    return this.dataService.finAssistApp;
  }

  addSpouse():void {
    this.finAssistApp.hasSpouseOrCommonLaw = true;
  }
}