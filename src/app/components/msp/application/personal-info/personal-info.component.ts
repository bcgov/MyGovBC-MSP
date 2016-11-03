import {Component, Injectable} from '@angular/core';
import {MspApplication, Applicant, Person} from '../application';
import DataService from '../application-data.service';

require('./personal-info.component.less')
@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
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

  removeChild(id?: string): void{
    this.dataService.getApplication().removeChild();    
  }

  removeSpouse(): void{
    console.log('roger remove spouse');
    this.dataService.getApplication().removeSpouse();
  }
}