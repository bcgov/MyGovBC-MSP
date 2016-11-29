import { Component, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';


import DataService from '../../application/application-data.service';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';

require('./prepare.component.less');

@Component({
  templateUrl: './prepare.component.html'
})
export class AssistancePrepareComponent implements AfterViewInit{
  @ViewChild('prepForm') prepForm: NgForm;
  @ViewChild('ageOver65Btn') ageOver65Btn: ElementRef;
  @ViewChild('ageNotOver65Btn') ageNotOver65Btn: ElementRef;
  @ViewChild('hasSpouse') hasSpouse: ElementRef;
  @ViewChild('negativeHasSpouse') negativeHasSpouse: ElementRef;

  lang = require('./i18n');
  _showDisabilityInfo:boolean = false;
  private _showChildrenInfo:boolean = false;
  constructor(private dataService: DataService){

  }

  ngAfterViewInit() {
    // this.prepForm.valueChanges.subscribe(
    //   values => {
    //     console.log('value changes on fin assist prep form.', values);
    //     console.log(this.dataService.finAssistApp);
    //   }
    // );

    
    let ageOver$ = Observable.fromEvent<MouseEvent>(this.ageOver65Btn.nativeElement, 'click')
      .map( x=>{
        this.dataService.finAssistApp.ageOver65 = true;
      });
    let ageUnder$ = Observable.fromEvent<MouseEvent>(this.ageNotOver65Btn.nativeElement, 'click')
      .map( x=>{
        this.dataService.finAssistApp.ageOver65 = false;
      });

    this.prepForm.valueChanges.filter(
        (values) => {
          let isEmptyObj = _.isEmpty(values);
          return !isEmptyObj;
        }
      )
      .merge(ageOver$).merge(ageUnder$)
      .merge(
          Observable.fromEvent<MouseEvent>(this.hasSpouse.nativeElement, 'click')
            .map(x => {
              this.finAssistApp.hasSpouseOrCommonLaw = true;
            })
        )
      .merge(
          Observable.fromEvent<MouseEvent>(this.negativeHasSpouse.nativeElement, 'click')
            .map(x => {
              this.finAssistApp.hasSpouseOrCommonLaw = false;
            })
      )
      .subscribe(
        values => {
          console.log('model to be saved', this.dataService.finAssistApp);
        }
      );
  }

  get showDisabilityInfo(){
    return this._showDisabilityInfo;
  }

  set showDisabilityInfo(doShow:boolean){
    this._showDisabilityInfo = doShow;
  }

  get showChildrenInfo() {
    return this._showChildrenInfo;
  }

  set showChildrenInfo(show: boolean){
    this._showChildrenInfo = show;
  }

  get finAssistApp(): FinancialAssistApplication{
    return this.dataService.finAssistApp;
  }

  addSpouse():void {
    this.finAssistApp.hasSpouseOrCommonLaw = true;
  }
}
