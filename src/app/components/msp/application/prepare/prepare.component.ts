import {Component, Inject, Injectable} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import DataService from '../../service/msp-data.service';


@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent {
  lang = require('./i18n');

  private apt: Person;

  constructor(private dataService: DataService) {
    this.apt = this.dataService.getMspApplication().applicant
  }

  get stayLonger() {
    return this.apt.stayForSixMonthsOrLonger;
  }

  get liveInBC() {
    return this.apt.liveInBC;
  }

  get plannedAbsence() {
    return this.apt.plannedAbsence;
  }

  get uncommonSituation() {
    return this.apt.uncommonSituation;
  }

  setStayLonger(stay: boolean) {
    return this.apt.stayForSixMonthsOrLonger = stay;
  }

  setLiveInBC(live: boolean) {
    return this.apt.liveInBC = live;
  }

  setPlannedAbsense(leave: boolean) {
    this.apt.plannedAbsence = leave;
  }

  setUncommonSituation(uncommon: boolean) {
    this.apt.uncommonSituation = uncommon;
  }

  get applicant(): Person {
    return this.apt;
  }

}