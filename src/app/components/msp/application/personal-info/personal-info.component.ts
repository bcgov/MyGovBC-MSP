import {Component, Injectable, ViewChild, ViewChildren,
  ChangeDetectorRef, QueryList, AfterViewInit, OnInit} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

// import {MspDataService} from '../../service/msp-data.service';
import { MspDataService } from '../../service/msp-data.service';

import { Router } from '@angular/router';
import {Relationship} from '../../model/status-activities-documents';
import {NgForm} from '@angular/forms';
import {PersonalDetailsComponent} from './personal-details/personal-details.component';
import {BaseComponent} from '../../common/base.component';
import {ProcessService} from '../../service/process.service';
import { StatusInCanada} from '../../model/status-activities-documents';

import { ServicesCardDisclaimerModalComponent  } from '../../common/services-card-disclaimer/services-card-disclaimer.component';

@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent extends BaseComponent {

  static ProcessStepNum = 1;
  lang = require('./i18n');
  Relationship: typeof Relationship = Relationship;
  public buttonClass: string = 'btn btn-default';

  @ViewChild('formRef') form: NgForm;
  @ViewChild('mspServicesCardModal') mspServicesCardModal: ServicesCardDisclaimerModalComponent;
  @ViewChildren(PersonalDetailsComponent) personalDetailsComponent: QueryList<PersonalDetailsComponent>;

  constructor(private dataService: MspDataService,
    private _router: Router,
    private _processService: ProcessService,
    private cd: ChangeDetectorRef) {

    super(cd);
  }

  ngOnInit(){
    this.initProcessMembers(PersonalInfoComponent.ProcessStepNum, this._processService);
  }

  onChange(values: any){
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

  addSpouse = () => {
    const sp: Person = new Person(Relationship.Spouse);
    this.dataService.getMspApplication().addSpouse(sp);
  }

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

  // fix for DEF-90
  isStayinginBCAfterstudies(): boolean {
    let stayingInBc = true;
    if (this.personalDetailsComponent) {  // initial page load..empty object
      this.personalDetailsComponent.forEach((personalDetailsComponent) => {
        if (personalDetailsComponent && personalDetailsComponent.person) {  //dependent can be empty object..ignore them

          const currentApplicant: Person = personalDetailsComponent.person;
          if (currentApplicant.status === StatusInCanada.CitizenAdult || currentApplicant.status === StatusInCanada.PermanentResident) {
            if (currentApplicant.fullTimeStudent && currentApplicant.inBCafterStudies == false) {
              this._processService.setStep(1, false);
              stayingInBc = false;
            }
          }
        }
     });
    }

    return stayingInBc;
  }
  canContinue(): boolean {
    return this.isAllValid();
  }

  isValid(): boolean {
     return this.dataService.getMspApplication().isUniquePhns;
  }

  checkAnyDependentsIneligible(): boolean {
        const target = [this.dataService.getMspApplication().applicant];
        return target.filter(x => x)
            .filter(x => x.ineligibleForMSP).length >= 1;
    }


    continue(): void {

    // console.log('personal info form itself valid: %s', this.form.valid);
    console.log('combinedValidationState on personal info: %s', this.isAllValid());
    if (!this.isAllValid()){
      console.log('Please fill in all required fields on the form.');
    }else{
      this._router.navigate(['/msp/application/spouse-info']);
    }
  }
}
