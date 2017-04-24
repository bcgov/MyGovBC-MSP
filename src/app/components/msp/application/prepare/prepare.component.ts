import {Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import {MspApplication, Person} from '../../model/application.model';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import DataService from '../../service/msp-data.service';
import {MspConsentModalComponent} from "../../common/consent-modal/consent-modal.component";
import ProcessService from "../../service/process.service";
import {BaseComponent} from "../../common/base.component";


@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent extends BaseComponent {
  static ProcessStepNum = 0;
  lang = require('./i18n');
  @ViewChild('formRef') form: NgForm;
  @ViewChild('liveInBCBtn') liveInBCBtn: ElementRef;
  @ViewChild('notLiveInBCBtn') notLiveInBCBtn: ElementRef;
  @ViewChild('unUsualCircumstanceBtn') unUsualCircumstanceBtn: ElementRef;
  @ViewChild('noUnusualCircustanceBtn') noUnusualCircustanceBtn: ElementRef;
  @ViewChild('plannedAbsenceBtn') plannedAbsenceBtn: ElementRef;
  @ViewChild('noPlannedAbsenceBtn') noPlannedAbsenceBtn: ElementRef;
  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

  private apt: Person;
  mspApplication: MspApplication;

  constructor(private dataService: DataService,
    private _processService:ProcessService,
    private _router: Router) {
    super(PrepareComponent.ProcessStepNum, _processService);
    this.mspApplication = this.dataService.getMspApplication();
    this.apt = this.mspApplication.applicant;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    if (!this.mspApplication.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
    }

    let liveInBC$ = Observable.fromEvent<MouseEvent>(this.liveInBCBtn.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().applicant.liveInBC = true;
      });
    let notLiveInBC$ = Observable.fromEvent<MouseEvent>(this.notLiveInBCBtn.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().applicant.liveInBC = false;
      });

    let unUsualCircumstance$ = Observable.fromEvent<MouseEvent>(this.unUsualCircumstanceBtn.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().unUsualCircumstance = true;
      });
    let noUnUsualCircumstance$ = Observable.fromEvent<MouseEvent>(this.noUnusualCircustanceBtn.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().unUsualCircumstance = false;
      });

    let plannedAbsenceBtn$ = Observable.fromEvent<MouseEvent>(this.plannedAbsenceBtn.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().applicant.plannedAbsence = true;
      });
    let noPlannedAbsenceBtn$ = Observable.fromEvent<MouseEvent>(this.noPlannedAbsenceBtn.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().applicant.plannedAbsence = false;
      });

    if(this.form){
      this.form.valueChanges.merge(liveInBC$).merge(notLiveInBC$)
      .merge(unUsualCircumstance$).merge(noUnUsualCircumstance$)
      .merge(plannedAbsenceBtn$).merge(noPlannedAbsenceBtn$)
      .subscribe(values => {
        this.dataService.saveMspApplication();
        this.emitIsFormValid();
      });
    }
  }

  goToPersonalInfo(){
    if(this.mspApplication.infoCollectionAgreement !== true){
      console.log('user agreement not accepted yet, show user dialog box.');
      this.mspConsentModal.showFullSizeView();
    } else {
      this._processService.setStep(0, true);
      this._router.navigate(["/msp/application/personal-info"]);
    }
  }

  get liveInBC() {
    return this.apt.liveInBC;
  }

  get plannedAbsence() {
    return this.apt.plannedAbsence;
  }

  get unUsualCircumstance() {
    return this.dataService.getMspApplication().unUsualCircumstance;
  }

  setLiveInBC(live: boolean) {
    return this.apt.liveInBC = live;
  }
  get applicant(): Person {
    return this.apt;
  }

  canContinue(): boolean {
    return this.isAllValid();
  }

  isValid(): boolean {
    let app = this.dataService.getMspApplication();
    return app.applicant.plannedAbsence === false
      && app.applicant.liveInBC === true
      && app.unUsualCircumstance === false;
  }
}