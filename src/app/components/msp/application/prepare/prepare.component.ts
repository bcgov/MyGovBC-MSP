import { Component, Inject, Injectable } from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import DataService from '../../service/msp-data.service';


@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent {
    private apt: Person;
    constructor(private dataService: DataService){
        this.apt = this.dataService.getMspApplication().applicant
    }

    get stayLonger() {
        return this.apt.stayForSixMonthsOrLonger;
    }

    get liveInBC(){
        return this.apt.liveInBC;
    }

    get plannedAbsence() {
        return this.apt.plannedAbsence;
    }

    setStayLonger(stay: boolean){
        return this.apt.stayForSixMonthsOrLonger = stay;
    }

    setLiveInBC(live: boolean){
        return this.apt.liveInBC = live;
    }

    setPlannedAbsense(leave: boolean){
        this.apt.plannedAbsence = leave;
    }

    get applicant(): Person {
        return this.apt;
    }

}