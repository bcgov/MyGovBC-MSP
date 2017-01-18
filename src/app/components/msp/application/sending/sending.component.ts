import {Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import DataService from '../../service/msp-data.service';
import {MspApiService} from "../../service/msp-api.service";
import {Router} from "@angular/router";
import {ResponseType} from "../../api-model/responseTypes";

@Component({
  templateUrl: 'sending.component.html'
})
@Injectable()
export class SendingComponent implements AfterViewInit  {
  lang = require('./i18n');

  application:MspApplication;
  rawError: string;

  constructor(private dataService: DataService, private service:MspApiService, public router: Router) {
    this.application = this.dataService.getMspApplication();
  }

  ngAfterViewInit() {
    // After view inits, begin sending the application
    this.service
      .sendMspApplication(this.application)
      .then((application:MspApplication) => {
        this.application = application;

        //  go to confirmation
        this.router.navigateByUrl("/msp/application/confirmation");
      })
      .catch((error: ResponseType | any) => {
        this.rawError = (error) ? error._body : "unknown error";
      });
  }
}