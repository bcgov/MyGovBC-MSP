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
  @ViewChild('uncommonSituationBtn') uncommonSituationBtn: ElementRef;
  @ViewChild('noUncommonSituationBtn') noUncommonSituationBtn: ElementRef;

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

    let uncommonSituation$ = Observable.fromEvent<MouseEvent>(this.uncommonSituationBtn.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().applicant.uncommonSituation = true;
      });
    let noUncommonSituation$ = Observable.fromEvent<MouseEvent>(this.noUncommonSituationBtn.nativeElement, 'click')
      .map( x=>{
        this.dataService.getMspApplication().applicant.uncommonSituation = false;
      });

    if(this.form){
      this.form.valueChanges.merge(liveInBC$).merge(notLiveInBC$)
      .merge(staySixMonthOrLonger$).merge(notStaySixMonthOrLonger$)
      .merge(uncommonSituation$).merge(noUncommonSituation$)
      .subscribe(values => {
        console.log('saving application from preparation screen.');
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

  get uncommonSituation() {
    return this.apt.uncommonSituation;
  }

  setStayLonger(stay: boolean) {
    return this.apt.stayForSixMonthsOrLonger = stay;
  }

  setLiveInBC(live: boolean) {
    return this.apt.liveInBC = live;
  }

  setPlannedAbsense(leave: boolean) {
    this.apt.plannedAbsence = leave;
  }

  setUncommonSituation(uncommon: boolean) {
    this.apt.uncommonSituation = uncommon;
  }

  get applicant(): Person {
    return this.apt;
  }

}