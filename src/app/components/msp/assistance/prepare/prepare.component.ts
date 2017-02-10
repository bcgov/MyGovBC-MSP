import { Component, ViewChild, AfterViewInit, OnInit, ElementRef, DoCheck} from '@angular/core';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import DataService from '../../service/msp-data.service';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';
import {MspConsentModalComponent} from "../../common/consent-modal/consent-modal.component";
import {MspImage} from "../../../msp/model/msp-image";
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
import {MspImageErrorModalComponent} from "../../common/image-error-modal/image-error-modal.component";
@Component({
  templateUrl: './prepare.component.html'
})
export class AssistancePrepareComponent implements AfterViewInit, OnInit, DoCheck{
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
  @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;

  @ViewChild('childDisabilityCreditset') childDisabilityCreditset: ElementRef;
  @ViewChild('childDisabilityCreditUnset') childDisabilityCreditUnset: ElementRef;

  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

  lang = require('./i18n');
  _showDisabilityInfo:boolean = false;
  showAttendantCareInfo = true;
  private _showChildrenInfo:boolean = false;

  private _likelyQualify:boolean = false;
  private changeLog: string[] = [];
  qualifiedForAssistance = false;
  requireAttendantCareReceipts = false;

  qualificationThreshhold:number = 42000;

  constructor(private dataService: DataService){
    this.showAttendantCareInfo = this.finAssistApp.applicantClaimForAttendantCareExpense
    || this.finAssistApp.spouseClaimForAttendantCareExpense
    || this.finAssistApp.childClaimForAttendantCareExpense;
  }

  ngOnInit(){
    this._showDisabilityInfo = 
    this.dataService.finAssistApp.selfDisabilityCredit === true ||
    this.dataService.finAssistApp.spouseEligibleForDisabilityCredit === true ||
    !!this.finAssistApp.childWithDisabilityCount ||
    !_.isNil(this.dataService.finAssistApp.spouseDSPAmount_line125);

    this.showChildrenInfo =       
      !_.isNil(this.dataService.finAssistApp.childrenCount) ||
      (!_.isNil(this.finAssistApp.claimedChildCareExpense_line214) && this.finAssistApp.claimedChildCareExpense_line214 > 0) || 
      ((!_.isNil(this.finAssistApp.reportedUCCBenefit_line117)&&(this.finAssistApp.reportedUCCBenefit_line117>0)) );

      
  }

  addReceipts(evt:any){
    console.log('image added: %s', evt);
    this.finAssistApp.attendantCareExpenseReceipts.push(evt);
    this.fileUploader.forceRender();
    this.dataService.saveFinAssistApplication();
  }

  errorReceipts(evt:MspImage) {
    this.mspImageErrorModal.imageWithError = evt;
    this.mspImageErrorModal.showFullSizeView();
    this.mspImageErrorModal.forceRender();
  }

  deleteReceipts(evt:MspImage){
    this.finAssistApp.attendantCareExpenseReceipts = this.finAssistApp.attendantCareExpenseReceipts.filter(
      receipt => {
        return receipt.id != evt.id;
      }
    );
    this.dataService.saveFinAssistApplication();
  }

  ngAfterViewInit() {
    if (!this.dataService.finAssistApp.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
    }

    // console.log('income input field ', this.incomeRef);

    let ageOver$ = Observable.fromEvent<MouseEvent>(this.ageOver65Btn.nativeElement, 'click')
      .map( x=>{
        this.dataService.finAssistApp.ageOver65 = true;
      });
    let ageUnder$ = Observable.fromEvent<MouseEvent>(this.ageNotOver65Btn.nativeElement, 'click')
      .map( x=>{
        this.dataService.finAssistApp.ageOver65 = false;
      });

    this.prepForm.valueChanges.debounceTime(250)
      .distinctUntilChanged()
      .filter(
        (values) => {
          // console.log('value changes: ', values);
          let isEmptyObj = _.isEmpty(values);
          return !isEmptyObj;
        }
      ).do(
        (value)=>{
            console.log('netIncome value: ');
            console.log(value.netIncome);
            console.log(typeof value.netIncome);
          if(!value.netIncome){
            this.finAssistApp.netIncomelastYear = null;
          }
          if(!value.spouseIncomeLine236 || value.spouseIncomeLine236.trim().length === 0){
            this.finAssistApp.spouseIncomeLine236 = null;
          }
          if(!value.line125){
            this.finAssistApp.spouseDSPAmount_line125 = null;
          }
          if(!value.line214){
            this.finAssistApp.claimedChildCareExpense_line214 = null;
          }
          if(!value.line117){
            this.finAssistApp.reportedUCCBenefit_line117 = null;
          }
          if(!value.childrenCount || value.childrenCount.trim().length === 0){
            this.finAssistApp.childrenCount = null;
          }

          return value;
        }
      )
      .merge(ageOver$).merge(ageUnder$)
      .merge(
          Observable.fromEvent<MouseEvent>(this.spouseOver65Btn.nativeElement, 'click')
            .map(x => {
              this.finAssistApp.spouseAgeOver65 = true;
            })
      )
      .merge(
          Observable.fromEvent<MouseEvent>(this.spouseOver65NegativeBtn.nativeElement, 'click')
            .map(x => {
              this.finAssistApp.spouseAgeOver65 = false;
            })
      )
      .merge(
          Observable.fromEvent<MouseEvent>(this.hasSpouse.nativeElement, 'click')
            .map(x => {
              this.dataService.finAssistApp.setSpouse = true;
            })
        )
      .merge(
          Observable.fromEvent<MouseEvent>(this.negativeHasSpouse.nativeElement, 'click')
            .map(x => {
              this.finAssistApp.setSpouse = false;
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
      .merge(
        Observable.fromEvent<MouseEvent>(this.childDisabilityCreditset.nativeElement, 'click')
          .map( x=> {
            this.finAssistApp.childWithDisabilityCount = 1;
            console.log('Set childWithDisabilityCount to ' + this.finAssistApp.childWithDisabilityCount);
          })
      )
      .merge(
        Observable.fromEvent<MouseEvent>(this.childDisabilityCreditUnset.nativeElement, 'click')
          .map( x=> {
            this.finAssistApp.childWithDisabilityCount = 0;
            console.log('unset childWithDisabilityCount to ' + this.finAssistApp.childWithDisabilityCount);
          })
      )
      .subscribe(
        values => {
          // console.log('values: ', values);
          this.dataService.saveFinAssistApplication();
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
    this.finAssistApp.setSpouse =true;
  }

  updateQualify(evt:boolean):void {
    this._likelyQualify = evt;
  }  

  get likelyQualify():boolean{
    return this._likelyQualify;
  }

  updateChildDisabilityCreditCreditMultiplier(evt:string){
    this.finAssistApp.childWithDisabilityCount = parseInt(evt);
    this.dataService.saveFinAssistApplication();
  }

  toggleChildClaimForAttendantCareExpense(evt:boolean){
    // console.log('toggleChildClaimForAttendantCareExpense: %o', evt);
    this.finAssistApp.childClaimForAttendantCareExpense = evt;
  }  

  ngDoCheck(){
    this.qualifiedForAssistance = this.finAssistApp.eligibility.adjustedNetIncome <= this.qualificationThreshhold;
    this.requireAttendantCareReceipts = this.qualifiedForAssistance && (this.finAssistApp.applicantClaimForAttendantCareExpense ||
    this.finAssistApp.spouseClaimForAttendantCareExpense || this.finAssistApp.childClaimForAttendantCareExpense);
  }
}
