import { Component, OnInit } from '@angular/core';
import MspDataService from '../../service/msp-data.service';
import {FinancialAssistApplication}from '../../model/financial-assist-application.model';
@Component({
  templateUrl: './retro-years.component.html'
})
export class AssistanceRetroYearsComponent implements OnInit{
  lang = require('./i18n');
  application: FinancialAssistApplication;
  constructor(private dataService: MspDataService){
    this.application = this.dataService.finAssistApp;
  }

  ngOnInit(){

  }

}