import { Component, Inject, Injectable } from '@angular/core';
import {MspApplication, Person} from '../application';

import DataService from '../application-data.service';


@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent {
    constructor(private dataService: DataService){
    }
    isStaying() {
        return this.dataService.getApplication().applicant.stayForSixMonthsOrLonger;
    }
    isNotStaying() {
        this.dataService.getApplication().applicant.stayForSixMonthsOrLonger = false;;
    }

    get applicant(): Person {
        return this.dataService.getApplication().applicant;
    }

}