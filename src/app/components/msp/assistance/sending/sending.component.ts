import {Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import DataService from '../../service/msp-data.service';
import {MspApiService} from "../../service/msp-api.service";
import {Router} from "@angular/router";
import {ResponseType} from "../../api-model/responseTypes";
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";

@Component({
  templateUrl: 'sending.component.html'
})
@Injectable()
export class AssistanceSendingComponent implements AfterViewInit  {
  lang = require('./i18n');

  application:FinancialAssistApplication;
  rawUrl: string;
  rawError: string;
  rawRequest: string;

  constructor(private dataService: DataService, private service:MspApiService, public router: Router) {
    this.application = this.dataService.finAssistApp;
  }

  ngAfterViewInit() {
    // After view inits, begin sending the application
    this.service
      .sendApplication(this.application)
      .then((application:FinancialAssistApplication) => {
        this.application = application;

        //  go to confirmation
        this.router.navigateByUrl("/msp/assistance/confirmation");
      })
      .catch((error: ResponseType | any) => {
        this.rawUrl = error.url;
        this.rawError = error._body;
        this.rawRequest = error._requestBody
      });
  }
}