import { Component, Inject, Injectable } from '@angular/core';
import {MspApplication, Person} from '../application';

import DataService from '../application-data.service';


@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent {
    private apt: Person;
    constructor(private dataService: DataService){
        this.apt = this.dataService.getApplication().applicant
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
        console.log('plannedAbsence set to ' + this.apt.plannedAbsence);
    }

    get applicant(): Person {
        return this.apt;
    }

}