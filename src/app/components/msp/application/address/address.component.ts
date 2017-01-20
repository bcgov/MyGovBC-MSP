import {Component, OnChanges} from '@angular/core';
import DataService from '../../service/msp-data.service';
import {MspApplication} from "../../model/application.model";
import {Person} from "../../model/person.model";
import {UUID} from "angular2-uuid";

@Component({
  templateUrl: './address.component.html'
})
export class AddressComponent {
  lang = require('./i18n');
  mspApplication: MspApplication;
  outOfProvinceFor30DayCandidates: Person[];
  departurePersonUuids: string[];

  constructor(private dataService: DataService) {
    this.mspApplication = this.dataService.getMspApplication();
    this.outOfProvinceFor30DayCandidates = this.mspApplication.getOutOfProvinceFor30DayCandidates();

    this.departurePersonUuids = new Array<string>();
    for (let person of this.mspApplication.getOutOfProvincePersons()) {
      this.departurePersonUuids.push(person.uuid);
    }
  }

  setOutsideBCFor30DaysLabel (value:boolean) {
    this.mspApplication.outsideBCFor30Days = value;
    if (!value) {

      // erase departure persons
      this.departurePersonUuids = null;

      //erase all previous work
      for (let person of this.outOfProvinceFor30DayCandidates) {
        person.resetOutsideBCValues();
      }
    }
    else {
      // erase departure persons
      this.departurePersonUuids = new Array<string>();
      this.departurePersonUuids.push("");
    }
  }

  addAnotherOutsideBCPersonButton():void {
    this.departurePersonUuids.push("");
  }

  removeDeparture(uuid: string): void {
    let index = this.departurePersonUuids.indexOf(uuid);
    if (index > -1) {
      this.departurePersonUuids.splice(index, 1);
    }
  }
  /**
   * Function to determine if any person left are not being worked on
   */
  hasOutOfProvinceFor30CandidatesNotWorking(): boolean {
    return true;
  }

}