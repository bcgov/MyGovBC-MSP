import { Component, ViewChild, AfterViewInit, OnInit, ElementRef} from '@angular/core';
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
export class AssistancePrepareComponent implements AfterViewInit, OnInit{
  @ViewChild('formRef') prepForm: NgForm;
  @ViewChild('incomeRef') incomeRef: ElementRef;
  @ViewChild('ageOver65Btn') ageOver65Btn: ElementRef;
  @ViewChild('ageNotOver65Btn') ageNotOver65Btn: ElementRef;
  @ViewChild('spouseOver65Btn') spouseOver65Btn: ElementRef;
  @ViewChild('spouseOver65NegativeBtn') spouseOver65NegativeBtn: ElementRef;
  @ViewChild('hasSpouse') hasSpouse: ElementRef;
  @ViewChild('negativeHasSpouse') negativeHasSpouse: ElementRef;
  @ViewChild('selfDisabilityCreditSet') selfDisabilityCreditSet: ElementRef;
  @ViewChild('selfDisabilityCreditUnset') selfDisabilityCreditUnset: ElementRef;
  @ViewChild('spouseDisabilityCreditSet') spouseDisabilityCreditSet: ElementRef;
  @ViewChild('spouseDisabilityCreditUnset') spouseDisabilityCreditUnset: ElementRef;

  lang = require('./i18n');
  _showDisabilityInfo:boolean = false;
  private _showChildrenInfo:boolean = false;

  formValidationInfo = {
    spouseAgeSpecified: false,
    ageSpecified: false,
    spouseSpecified: false
  };

  private _likelyQualify:boolean = false;

  constructor(private dataService: DataService){

  }

  ngOnInit(){
    this._showDisabilityInfo = 
    !_.isNil(this.dataService.finAssistApp.selfDisabilityCredit) ||
    !_.isNil(this.dataService.finAssistApp.spouseEligibleForDisabilityCredit) ||
    !_.isNil(this.dataService.finAssistApp.spouseDSPAmount_line125);

    this.showChildrenInfo =       
      !_.isNil(this.dataService.finAssistApp.childrenCount) ||
      (!_.isNil(this.finAssistApp.claimedChildCareExpense_line214) && this.finAssistApp.claimedChildCareExpense_line214 > 0) || 
      ((!_.isNil(this.finAssistApp.reportedUCCBenefit_line117)&&(this.finAssistApp.reportedUCCBenefit_line117>0)) );

      
  }

  ngAfterViewInit() {
    Observable.fromEvent<Event>(this.incomeRef.nativeElement, 'input')
      .map(x => {
        console.log('input event', x);
      });

    let ageOver$ = Observable.fromEvent<MouseEvent>(this.ageOver65Btn.nativeElement, 'click')
      .map( x=>{
        this.dataService.finAssistApp.ageOver65 = true;
        this.formValidationInfo.ageSpecified = true;
      });
    let ageUnder$ = Observable.fromEvent<MouseEvent>(this.ageNotOver65Btn.nativeElement, 'click')
      .map( x=>{
        this.dataService.finAssistApp.ageOver65 = false;
        this.formValidationInfo.ageSpecified = true;
      });

    this.prepForm.valueChanges.filter(
        (values) => {
          let isEmptyObj = _.isEmpty(values);
          return !isEmptyObj;
        }
      )
      .merge(ageOver$).merge(ageUnder$)
      .merge(
          Observable.fromEvent<MouseEvent>(this.spouseOver65Btn.nativeElement, 'click')
            .map(x => {
              this.finAssistApp.spouseAgeOver65 = true;
              this.formValidationInfo.spouseAgeSpecified = true;
            })
      )
      .merge(
          Observable.fromEvent<MouseEvent>(this.spouseOver65NegativeBtn.nativeElement, 'click')
            .map(x => {
              this.finAssistApp.spouseAgeOver65 = false;
              this.formValidationInfo.spouseAgeSpecified = true;
            })
      )
      .merge(
          Observable.fromEvent<MouseEvent>(this.hasSpouse.nativeElement, 'click')
            .map(x => {
              this.dataService.finAssistApp.setSpouse = true;
              this.formValidationInfo.spouseSpecified = true;
            })
        )
      .merge(
          Observable.fromEvent<MouseEvent>(this.negativeHasSpouse.nativeElement, 'click')
            .map(x => {
              this.finAssistApp.setSpouse = false;
              this.formValidationInfo.spouseAgeSpecified = false;
              this.formValidationInfo.spouseSpecified = true;
            })
      )
      .merge(
        Observable.fromEvent<MouseEvent>(this.selfDisabilityCreditSet.nativeElement, 'click')
          .map( x=> {
            this.finAssistApp.selfDisabilityCredit = true;
          })
      )
      .merge(
        Observable.fromEvent<MouseEvent>(this.selfDisabilityCreditUnset.nativeElement, 'click')
          .map( x=> {
            this.finAssistApp.selfDisabilityCredit= false;
          })
      )
      .merge(
        Observable.fromEvent<MouseEvent>(this.spouseDisabilityCreditSet.nativeElement, 'click')
          .map( x=> {
            this.finAssistApp.spouseEligibleForDisabilityCredit = true;
          })
      )
      .merge(
        Observable.fromEvent<MouseEvent>(this.spouseDisabilityCreditUnset.nativeElement, 'click')
          .map( x=> {
            this.finAssistApp.spouseEligibleForDisabilityCredit = false;
          })
      )
      .subscribe(
        values => {
          // console.log('model to be saved', this.dataService.finAssistApp);
          this.dataService.saveFinAssistApplication();
        }
      );
  }
  // ngModelChange(value:string){
  //   console.log("ngModelChange: ", value);
  //   let result:number = parseInt(value.trim());
  //   if(result+'' === 'NaN'){
  //     console.log("value is NaN after parseInt " + result);
  //     result = null;
  //     console.log("make result null: " + result);
  //   }else{
  //     console.log('input is not NaN, it is ' + result);
  //   }
  //   this.finAssistApp.netIncomelastYear = result;
  //     console.log("result on model: " + this.finAssistApp.netIncomelastYear);
  // }

  


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
    this.finAssistApp.setSpouse =true;
  }

  updateQualify(evt:boolean):void {
    this._likelyQualify = evt;
  }  

  get likelyQualify():boolean{
    return this._likelyQualify;
  }
}
