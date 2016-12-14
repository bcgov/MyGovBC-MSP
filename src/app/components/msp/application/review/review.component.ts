import { Component } from '@angular/core';
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

  constructor(private dataService: DataService) {
    this.application = this.dataService.getMspApplication();
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