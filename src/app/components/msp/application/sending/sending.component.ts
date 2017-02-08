import {Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import DataService from '../../service/msp-data.service';
import {MspApiService} from "../../service/msp-api.service";
import {Router} from "@angular/router";
import {ResponseType} from "../../api-model/responseTypes";
import {MspLogService} from '../../service/log.service'

@Component({
  templateUrl: 'sending.component.html'
})
@Injectable()
export class SendingComponent implements AfterViewInit {
  lang = require('./i18n');

  application: MspApplication;
  rawUrl: string;
  rawError: string;
  rawRequest: string;

  constructor(private dataService: DataService, private service: MspApiService, public router: Router, private logService: MspLogService) {
    this.application = this.dataService.getMspApplication();
  }

  ngAfterViewInit() {
    // After view inits, begin sending the application
    this.service
      .sendApplication(this.application)
      .then((application: MspApplication) => {
        this.application = application;
        this.logService.log({name: 'x', confirmationNumber: 'replaceMe'})
        //  go to confirmation
        this.router.navigateByUrl("/msp/application/confirmation");
      })
      .catch((error: ResponseType | any) => {
        this.rawUrl = error.url;
        this.rawError = error._body;
        this.rawRequest = error._requestBody
      });
  }
}
