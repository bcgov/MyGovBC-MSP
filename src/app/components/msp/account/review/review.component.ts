import {Component, Inject, ViewChild, ElementRef, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import {MspApplication} from "../../model/application.model";
import {MspAccountApp} from '../../model/account.model';
import {MspDataService} from '../../service/msp-data.service';
import {Gender, Person} from "../../model/person.model";
import {StatusInCanada, Activities, Relationship} from "../../model/status-activities-documents";
import {ProcessService} from "../../service/process.service";
import { environment } from '../../../../../environments/environment';

@Component({
  templateUrl: './review.component.html'
})
export class AccountReviewComponent implements OnInit{
  lang = require('./i18n');

  mspAccountApp: MspAccountApp;
  captchaApiBaseUrl:string;
  @ViewChild(NgForm) form: NgForm;

  constructor(private dataService: MspDataService,
              private _router: Router,
              private processService:ProcessService,) {
      this.mspAccountApp = dataService.getMspAccountApp();
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
  }


  ngOnInit(){

  }
  
  applicantAuthorizeOnChange(event: boolean) {
    
  }
  spouseAuthorizeOnChange(event: boolean) {
  }



  handleFormSubmission(evt:any){

  }
}