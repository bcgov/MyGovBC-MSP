import { Component, Inject, Injectable } from '@angular/core';
import {MspApplication, Applicant, Person} from '../application';

import DataService from '../application-data.service';


@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent {
    staying: boolean;
    constructor(private dataService: DataService){
        this.staying = true;
    }

    isStaying() {
        this.staying = true;
    }
    isNotStaying() {
        this.staying = false;
    }

  get applicant(): Applicant {
    return this.dataService.getApplication().applicant;
  }

}