import {Component} from '@angular/core';
import {MspApplication} from "../../model/application.model";
import DataService from '../../service/msp-data.service';

@Component({
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent {
  lang = require('./i18n');
  mspApplication: MspApplication;

  constructor(private dataService: DataService) {
    this.mspApplication = this.dataService.getMspApplication();
  }
}