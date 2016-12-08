import { Component } from '@angular/core';
import {MspApplication} from "../../model/application.model";

import DataService from '../../service/msp-data.service';
import {Gender} from "../../model/person.model";
import {StatusInCanada, Activities} from "../../model/status-activities-documents";

@Component({
  templateUrl: './review.component.html'
})
export class ReviewComponent {
  lang = require('./i18n');

  application: MspApplication;

  constructor(private dataService: DataService) {
    this.application = this.dataService.getMspApplication();



    this.application.applicant.firstName = "Greg";
    this.application.applicant.middleName = "W";
    this.application.applicant.lastName = "Tur";

    this.application.applicant.gender = Gender.Male;

    this.application.applicant.dob_day = 2;
    this.application.applicant.dob_month = 6;
    this.application.applicant.dob_year = 1901;

    this.application.applicant.status = StatusInCanada.CitizenAdult;
    this.application.applicant.currentActivity = Activities.ReligousWorker;
    this.application.applicant.movedFromProvince = "BC";
  }

}