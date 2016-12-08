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
  }

}