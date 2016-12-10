import { Component, OnInit } from '@angular/core';
import MspDataService from '../../service/msp-data.service';
import {FinancialAssistApplication}from '../../model/financial-assist-application.model';
@Component({
  templateUrl: './review.component.html'
})
export class AssistanceReviewComponent implements OnInit{
  lang = require('./i18n');
  application: FinancialAssistApplication;
  constructor(private dataService: MspDataService){
    this.application = this.dataService.finAssistApp;
  }

  ngOnInit(){
    // console.log('This fin assist application ', this.application);
  }

}