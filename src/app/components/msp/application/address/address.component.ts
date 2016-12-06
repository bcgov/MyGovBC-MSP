import {Component} from '@angular/core';
import DataService from '../../service/msp-data.service';
import {MspApplication} from "../../model/application.model";

@Component({
  templateUrl: './address.component.html'
})
export class AddressComponent {
  lang = require('./i18n');
  mspApplication: MspApplication;

  constructor(private dataService: DataService) {
    this.mspApplication = this.dataService.getMspApplication();
  }
}