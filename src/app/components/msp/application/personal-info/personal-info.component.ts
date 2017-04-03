import {Component, Injectable, ViewChild, ViewChildren, QueryList, AfterViewInit, OnInit} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import DataService from '../../service/msp-data.service';
import CompletenessCheckService from '../../service/completeness-check.service';
import { Router } from '@angular/router';

import {Relationship} from "../../model/status-activities-documents";
import {NgForm} from "@angular/forms";
import {PersonalDetailsComponent} from "./personal-details/personal-details.component";

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Observer } from 'rxjs/Observer';

@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent implements AfterViewInit{
  lang = require('./i18n');
  private combinedValidationState:boolean;
  Relationship: typeof Relationship = Relationship;

  validitySubscription:Subscription;
  currentFormValidity:Observable<boolean>;

  @ViewChild('formRef') form: NgForm;
  // @ViewChildren(PersonalDetailsComponent) personalDetailsList:QueryList<PersonalDetailsComponent>;
  personalDetailsList:PersonalDetailsComponent[] = [];
  
  constructor(private dataService: DataService,
    private completenessCheck:CompletenessCheckService,
    private _router: Router){

  }


  ngOnInit(){
    let curForm = this.form;
    this.currentFormValidity = Observable.create((observer:Observer<boolean>)=>{
      observer.next(curForm.valid);
    });

    this.updateSubscription();
  }

  ngAfterViewInit(){
  }

  updateSubscription(){

    if(this.validitySubscription){
      this.validitySubscription.unsubscribe();
    }

    let childrenObservables:Observable<boolean>[] = [];
    childrenObservables = this.personalDetailsList.map((comp:PersonalDetailsComponent)=>{
      return comp.isFormValid;
    });

    this.validitySubscription = Observable.combineLatest(
      // this.currentFormValidity,
      ...childrenObservables
    ).subscribe(collection => {
      this.combinedValidationState = collection.reduce( function(acc, cur){
        return acc && !!cur;
      },true)&& this.form.valid;

      console.log('combinedValidationState on personal info screen: ' + this.combinedValidationState);
    });

  }

  ngOnDestroy(){
    this.validitySubscription.unsubscribe();
  }

  onChange(values:any){
    // console.log('save msp application upon changes from child component percolated up to parent, %o', this.applicant.dob_year);
    this.dataService.saveMspApplication();
  }

  onRegisterPersonalDetailsComponent(personalDetailsComp:PersonalDetailsComponent){
    // console.log('register personal details component with personal info screen');
    this.personalDetailsList.push(personalDetailsComp);
    this.updateSubscription();
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

  get canContinue():boolean {
    return this.completenessCheck.mspPersonalInfoDocsCompleted() && this.combinedValidationState;
  }

  continue():void {
    if(!this.canContinue){
      console.log('Please fill in all required fields on the form.');
    }else{
      this._router.navigate(['/msp/application/address']);
    }
  }
}