import {Component, Injectable} from '@angular/core';
import {MspApplication, Person} from '../application';
import DataService from '../application-data.service';

require('./personal-info.component.less')
@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent {
  lang = require('./i18n');

  constructor(private dataService: DataService){

  }

  onClick(): void{
    console.log('child clicked');
  }

  get application(): MspApplication {
    return this.dataService.getApplication();
  }
  get applicant(): Person {
    return this.dataService.getApplication().applicant;
  }

  get spouse(): Person {
    return this.dataService.getApplication().spouse;
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

  removeChild(event: Object, idx: number): void{
    // console.log('remove child ' + JSON.stringify(event));
    this.dataService.getApplication().removeChild(idx);    
  }

  removeSpouse(event: Object): void{
    // console.log('remove spouse ' + JSON.stringify(event));
    this.dataService.getApplication().removeSpouse();
  }
}