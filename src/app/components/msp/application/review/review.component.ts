import {Component, Inject, ViewChild, ElementRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import {MspApplication} from "../../model/application.model";

import DataService from '../../service/msp-data.service';
import {Gender, Person} from "../../model/person.model";
import {StatusInCanada, Activities, Relationship} from "../../model/status-activities-documents";

@Component({
  templateUrl: './review.component.html'
})
export class ReviewComponent {
  lang = require('./i18n');

  application: MspApplication;
  captchaApiBaseUrl:string;
  @ViewChild(NgForm) form: NgForm;

  constructor(private dataService: DataService,
              private _router: Router,
              @Inject('appConstants') private appConstants: Object) {
    this.application = this.dataService.getMspApplication();
    this.captchaApiBaseUrl = this.appConstants["captchaApiBaseUrl"];
  }

  applicantAuthorizeOnChange(event: boolean) {
    // console.log('applicant authorization: ', event);
    this.application.authorizedByApplicant = event;

    if (this.application.authorizedByApplicant) {
      this.application.authorizedByApplicantDate = new Date();
    }
    this.dataService.saveMspApplication();
    
  }
  spouseAuthorizeOnChange(event: boolean) {
    this.application.authorizedBySpouse = event;
    this.dataService.saveMspApplication();
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

  handleFormSubmission(evt:any){
    // console.log('review form submitted, %o', evt);
    if(this.application.hasValidAuthToken){
      this._router.navigate(['/msp/application/sending']);
    }else{
      console.log('Auth token is not valid');
    }
  }
}