import { Component } from '@angular/core';
import MspDataService from '../../service/msp-data.service';
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";
@Component({
  templateUrl: './authorize-submit.component.html'
})
export class AssistanceAuthorizeSubmitComponent {
  lang = require('./i18n');

  application: FinancialAssistApplication;
  constructor(private dataService: MspDataService){
    this.application = this.dataService.finAssistApp;
  }

  get questionApplicant(){
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.applicantName);    
  }
  get questionSpouse(){
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.spouseName);    
  }
  get applicantName(){
    return this.application.applicant.firstName + ' ' + this.application.applicant.lastName;
  }
  get spouseName(){
    return this.application.spouse.firstName + ' ' + this.application.spouse.lastName;
  }
}