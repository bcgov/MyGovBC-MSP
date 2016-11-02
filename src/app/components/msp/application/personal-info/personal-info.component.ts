import {Component} from '@angular/core';
import {MspApplicantioin, Applicant, Spouse, Child} from '../application';
import DataService from '../application-data.service';

require('./personal-info.component.less')
@Component({
  templateUrl: './personal-info.component.html'
})

export class PersonalInfoComponent {

  constructor(private dataService: DataService){

  }

  get applicant(): Applicant {
    return this.dataService.getApplication().applicant;
  }
}