import {Component, Inject, Input, NgModule, Output, EventEmitter, ViewChild, AfterViewInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Address} from "../../model/address.model";
import {CompleterData, CompleterService} from "ng2-completer";

@Component({
  selector: 'msp-country',
  templateUrl: './country.component.html'
})

export class MspCountryComponent {
  lang = require('./i18n');

  /**
   * Model Inputs
   */
  @Input() address: Address;

  /**
   * Auto complete for country
   */
  private dataService: CompleterData;
  private countryData = this.lang('./en/index.js').countryData;

  constructor(private completerService: CompleterService) {

    this.dataService = completerService.local(this.countryData, 'name', 'name');
  }
}
