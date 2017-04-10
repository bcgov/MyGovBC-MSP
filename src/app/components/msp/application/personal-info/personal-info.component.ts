import {Component, Injectable, ViewChild, ViewChildren, 
  ChangeDetectorRef, QueryList, AfterViewInit, OnInit} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import DataService from '../../service/msp-data.service';
// import CompletenessCheckService from '../../service/completeness-check.service';
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
  // private combinedValidationState:boolean;
  Relationship: typeof Relationship = Relationship;

  // validitySubscription:Subscription;

  formValidStatus:boolean;
  @ViewChild('formRef') form: NgForm;
  // @ViewChildren(PersonalDetailsComponent) personalDetailsList:QueryList<PersonalDetailsComponent>;
  personalDetailsList:PersonalDetailsComponent[] = [];
  // childComponentValidStatus:boolean[] = [];
  constructor(private dataService: DataService,
    private cd:ChangeDetectorRef,
    private _router: Router){

  }


  ngOnInit(){
  }

  ngAfterViewInit(){
    // this.updateSubscription();
    // this.cd.detectChanges();
  }

  // updateSubscription(){
  //   let currentFormObservable: Observable<boolean> =
  //     this.form.valueChanges.map(values => {
  //       return this.form.valid;
  //   });

  //   let childrenObservables:Observable<boolean>[] = [];
  //   childrenObservables = this.personalDetailsList.map((comp:PersonalDetailsComponent)=>{
  //     return comp.isFormValid;
  //   });

  //   for(let i=0; i < childrenObservables.length; i++){
  //     childrenObservables[i].subscribe(
  //       (status:boolean) => {
  //         this.childComponentValidStatus[i] = status;
      
  //         this.combinedValidationState = 
  //           this.childComponentValidStatus.reduce(
  //             (acc, cur, idx, arr) => {
  //               return acc && cur;
  //             },true
  //           );

  //         console.log('combinedValidationState on personal info screen: ' + this.combinedValidationState);
  //       }
  //     );
  //   }
  // }


  ngOnDestroy(){
    // this.validitySubscription.unsubscribe();
  }

  onChange(values:any){
    // console.log('save msp application upon changes from child component percolated up to parent, %o', this.applicant.dob_year);
    this.dataService.saveMspApplication();
  }

  onRegisterPersonalDetailsComponent(personalDetailsComp:PersonalDetailsComponent){
    this.personalDetailsList.push(personalDetailsComp);
    // this.cd.detectChanges();
    // this.updateSubscription();
  }
  onUnregisterPersonalDetailsComponent(c:PersonalDetailsComponent){
    this.personalDetailsList = this.personalDetailsList.filter(
      (cp:PersonalDetailsComponent)=>{
        return cp.person.uuid !== c.person.uuid;
      }
    );
    // this.cd.detectChanges();
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
    // return this.gatherChildValidationStatus();
    return true;
  }

  gatherChildValidationStatus(){
    let validStatus:boolean = 
    this.personalDetailsList.reduce(
      (acc:boolean, cur:PersonalDetailsComponent, idx:number, arr:PersonalDetailsComponent[])=>{
        // console.log('personal details list: %o', arr);
        return acc && cur.emitFormValidationStatus();
      },true
    );
    console.log('Child personal-detail component rolled-up validation status: %s', validStatus);
    return validStatus;
  }

  continue():void {

    this.formValidStatus = this.gatherChildValidationStatus();
    // console.log('personal info form itself valid: %s', this.form.valid);
    console.log('combinedValidationState on personal info: %s', this.formValidStatus);
    if(!this.formValidStatus){
      console.log('Please fill in all required fields on the form.');
    }else{
      this._router.navigate(['/msp/application/address']);
    }
  }
}