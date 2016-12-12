import { Component } from '@angular/core';
import MspDataService from '../../service/msp-data.service';
@Component({
  templateUrl: './authorize-submit.component.html'
})
export class AssistanceAuthorizeSubmitComponent {
  lang = require('./i18n');

  constructor(private dataSerivce:MspDataService){

  }
  get questionApplicant(){
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.applicantName);    
  }
  get questionSpouse(){
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.spouseName);    
  }
  get applicantName(){
    return this.dataSerivce.finAssistApp.applicant.firstName + ' ' + this.dataSerivce.finAssistApp.applicant.lastName;
  }
  get spouseName(){
    return this.dataSerivce.finAssistApp.spouse.firstName + ' ' + this.dataSerivce.finAssistApp.spouse.lastName;
  }
}