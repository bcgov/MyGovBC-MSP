import {Component, Injectable, ViewChild} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import DataService from '../../service/msp-data.service';
import {Relationship} from "../../model/status-activities-documents";
import {NgForm} from "@angular/forms";

require('./personal-info.component.less')
@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent {
  lang = require('./i18n');

  Relationship: typeof Relationship = Relationship;
  spouse:Person;
  @ViewChild('formRef') form: NgForm;

  constructor(private dataService: DataService){

  }

  save(){
    this.dataService.saveMspApplication();
  }
  onClick(): void{
  }

  get application(): MspApplication {
    return this.dataService.getApplication();
  }
  get applicant(): Person {
    return this.dataService.getApplication().applicant;
  }

  // get spouse(): Person {
  //   return this.dataService.getApplication().spouse;
  // }
  addSpouse = () =>{
    let sp:Person = new Person(Relationship.Spouse)    
    this.dataService.getApplication().addSpouse(sp);
    this.spouse = sp;
    // this.spouse = this.dataService.getApplication().spouse;
  };

  addChild(relationship: Relationship): void {
    this.dataService.getApplication().addChild(relationship);
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