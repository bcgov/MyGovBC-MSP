import {Component} from '@angular/core';
import {MspApplication, Applicant, Person} from '../application';
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

  addSpouse(): void{
    this.dataService.getApplication().addSpouse();
  }

  addChild(): void {
    this.dataService.getApplication().addChild();
  }

  get children(): Person[] {
    return this.dataService.getApplication().children;
  }

  removeDependent(id?: string): void{
    this.dataService.getApplication().removeChild();    
  }
}