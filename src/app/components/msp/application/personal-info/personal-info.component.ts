import {Component, Injectable, ViewChild, ViewChildren, 
  ChangeDetectorRef, QueryList, AfterViewInit, OnInit} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import DataService from '../../service/msp-data.service';
import { Router } from '@angular/router';
import {Relationship} from "../../model/status-activities-documents";
import {NgForm} from "@angular/forms";
import {PersonalDetailsComponent} from "./personal-details/personal-details.component";
import {BaseComponent} from "../../common/base.component";
import ProcessService from "../../service/process.service";

@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent extends BaseComponent {

  lang = require('./i18n');
  Relationship: typeof Relationship = Relationship;

  @ViewChild('formRef') form: NgForm;
  @ViewChildren(PersonalDetailsComponent) personalDetailsComponent: QueryList<PersonalDetailsComponent>;

  constructor(private dataService: DataService,
    private processService:ProcessService,
    private _router: Router){
    super();
  }

  onChange(values:any){
    this.dataService.saveMspApplication();
  }

  get application(): MspApplication {
    return this.dataService.getMspApplication();
  }
  get applicant(): Person {
    return this.dataService.getMspApplication().applicant;
  }

  get spouse(): Person {
    return this.dataService.getMspApplication().spouse;
  }

  addSpouse = () =>{
    let sp:Person = new Person(Relationship.Spouse)    
    this.dataService.getMspApplication().addSpouse(sp);
  };

  addChild(relationship: Relationship): void {
    this.dataService.getMspApplication().addChild(relationship);
  }

  get children(): Person[] {
    return this.dataService.getMspApplication().children;
  }

  removeChild(event: Object, idx: number): void{
    // console.log('remove child ' + JSON.stringify(event));
    this.dataService.getMspApplication().removeChild(idx);    
    this.dataService.saveMspApplication();
    
  }

  removeSpouse(event: Object): void{
    // console.log('remove spouse ' + JSON.stringify(event));
    this.dataService.getMspApplication().removeSpouse();
    this.dataService.saveMspApplication();
  }

  documentsReady(): boolean {
    return this.dataService.getMspApplication().documentsReady;
  }

  canContinue():boolean {
    return this.isAllValid();
  }

  continue():void {

    // console.log('personal info form itself valid: %s', this.form.valid);
    console.log('combinedValidationState on personal info: %s', this.isAllValid());
    if(!this.isAllValid()){
      console.log('Please fill in all required fields on the form.');
    }else{
      this.processService.setStep(1, true);
      this._router.navigate(['/msp/application/address']);
    }
  }
}