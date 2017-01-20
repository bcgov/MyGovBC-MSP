import {Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import {MspApplication, Person} from '../../model/application.model';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import DataService from '../../service/msp-data.service';


@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent implements AfterViewInit{
  lang = require('./i18n');
  @ViewChild('formRef') form: NgForm;
  @ViewChild('liveInBCBtn') liveInBCBtn: ElementRef;
  @ViewChild('notLiveInBCBtn') notLiveInBCBtn: ElementRef;
  @ViewChild('staySixMonthOrLonger') staySixMonthOrLonger: ElementRef;
  @ViewChild('notStaySixMonthOrLonger') notStaySixMonthOrLonger: ElementRef;
  @ViewChild('unUsualCircumstanceBtn') unUsualCircumstanceBtn: ElementRef;
  @ViewChild('noUnusualCircustanceBtn') noUnusualCircustanceBtn: ElementRef;
  @ViewChild('plannedAbsenceBtn') plannedAbsenceBtn: ElementRef;
  @ViewChild('noPlannedAbsenceBtn') noPlannedAbsenceBtn: ElementRef;

  private apt: Person;

  constructor(private dataService: DataService) {
    this.apt = this.dataService.getMspApplication().applicant
  }

  ngAfterViewInit() {
    let liveInBC$ = Observable.fromEvent<MouseEvent>(this.liveInBCBtn.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().applicant.liveInBC = true;
      });
    let notLiveInBC$ = Observable.fromEvent<MouseEvent>(this.notLiveInBCBtn.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().applicant.liveInBC = false;
      });

    let staySixMonthOrLonger$ = Observable.fromEvent<MouseEvent>(this.staySixMonthOrLonger.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().applicant.stayForSixMonthsOrLonger = true;
      });
    let notStaySixMonthOrLonger$ = Observable.fromEvent<MouseEvent>(this.notStaySixMonthOrLonger.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().applicant.stayForSixMonthsOrLonger = false;
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
      .merge(staySixMonthOrLonger$).merge(notStaySixMonthOrLonger$)
      .merge(unUsualCircumstance$).merge(noUnUsualCircumstance$)
      .merge(plannedAbsenceBtn$).merge(noPlannedAbsenceBtn$)
      .subscribe(values => {
        this.dataService.saveMspApplication();
      });
    }
  }

  get stayLonger() {
    return this.apt.stayForSixMonthsOrLonger;
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

  setStayLonger(stay: boolean) {
    return this.apt.stayForSixMonthsOrLonger = stay;
  }

  setLiveInBC(live: boolean) {
    return this.apt.liveInBC = live;
  }
  get applicant(): Person {
    return this.apt;
  }

}