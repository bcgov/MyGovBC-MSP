import { Component, ViewChild, AfterViewInit, OnInit, ElementRef, DoCheck} from '@angular/core';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
//import { Observable } from 'rxjs/internal';
import { Observable} from 'rxjs/internal/Observable';


import { ModalDirective } from 'ngx-bootstrap';

import { MspDataService } from '../../service/msp-data.service';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';
import {ConsentModalComponent} from 'moh-common-lib';
import {MspImage} from '../../model/msp-image';
import {AssistanceYear} from '../../model/assistance-year.model';
import {MspFileUploaderComponent} from '../../common/file-uploader/file-uploader.component';
import {MspImageErrorModalComponent} from '../../../../modules/msp-core/components/image-error-modal/image-error-modal.component';
import {MspAssistanceYearComponent} from './assistance-year/assistance-year.component';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {debounceTime, distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import { merge} from 'rxjs/internal/observable/merge';
import { CommonIncomeInputtextComponent} from '../../common/common-income-inputtext/common-income-inputtext.component';

@Component({
  templateUrl: './prepare.component.html',
  styleUrls: ['./prepare.component.scss']
})
export class AssistancePrepareComponent implements AfterViewInit, OnInit, DoCheck{
  @ViewChild('formRef') prepForm: NgForm;
  @ViewChild('incomeRef') incomeRef: CommonIncomeInputtextComponent;
  @ViewChild('ageOver65Btn') ageOver65Btn: ElementRef;
  @ViewChild('ageNotOver65Btn') ageNotOver65Btn: ElementRef;
  @ViewChild('spouseOver65Btn') spouseOver65Btn: ElementRef;
  @ViewChild('spouseOver65NegativeBtn') spouseOver65NegativeBtn: ElementRef;
  @ViewChild('hasSpouse') hasSpouse: ElementRef;
  @ViewChild('negativeHasSpouse') negativeHasSpouse: ElementRef;
  @ViewChild('fileUploader') fileUploader: MspFileUploaderComponent;
  @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;
  @ViewChild('assistanceYearComp') assistanceYearComp: MspAssistanceYearComponent;

  @ViewChild('mspConsentModal') mspConsentModal: ConsentModalComponent;
  @ViewChild('disabilityNursingHomeChoiceModal') public disabilityNursingHomeChoiceModal: ModalDirective;

    lang = require('./i18n');
  _showDisabilityInfo: boolean = false;
  showAttendantCareInfo = true;
  private _showChildrenInfo: boolean = false;

  private _likelyQualify: boolean = false;
  private changeLog: string[] = [];
  qualifiedForAssistance = false;
  requireAttendantCareReceipts = false;
  taxYearInfoMissing = false;
  qualificationThreshhold: number = 42000;
  incomePattern: string = "^[0-9]{1}[0-9]{0,5}(\.[0-9]{1,2})?$";

  counterClaimCategory: string;
  claimCategory: string;
  claimant: string;

  CREDIT_CLAIM_CATEGORY: string[] = ['disability credit', 'attendant or nursing home expense credit'];
  CREDIT_CLAIMANT: string[] = ['yourself', 'spouse or common law partner'];


  /**
   * Past 6 tax years from now.
   */
  pastYears: number[] = [];


  constructor(public dataService: MspDataService){
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
      ((!_.isNil(this.finAssistApp.reportedUCCBenefit_line117) && (this.finAssistApp.reportedUCCBenefit_line117 > 0)) );

    this.initYearsList();

  }

  addReceipts(evt: any){
    // console.log('image added: %s', evt);
    this.finAssistApp.attendantCareExpenseReceipts = this.finAssistApp.attendantCareExpenseReceipts.concat(evt);
    this.fileUploader.forceRender();
    this.dataService.saveFinAssistApplication();
  }

  errorReceipts(evt: MspImage) {
    this.mspImageErrorModal.imageWithError = evt;
    this.mspImageErrorModal.showFullSizeView();
    this.mspImageErrorModal.forceRender();
  }

  deleteReceipts(evt: MspImage){
    this.finAssistApp.attendantCareExpenseReceipts = this.finAssistApp.attendantCareExpenseReceipts.filter(
      receipt => {
        return receipt.id != evt.id;
      }
    );
    this.dataService.saveFinAssistApplication();
  }

  ngAfterViewInit() {
    console.log("asasasas"+this.finAssistApp.netIncomelastYear);
    if (!this.dataService.finAssistApp.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
    }

    //removing subscribe wont register clicks
    const ageOver$ = fromEvent<MouseEvent>(this.ageOver65Btn.nativeElement, 'click').pipe(
      map( x => {
        this.dataService.finAssistApp.ageOver65 = true;
      }));


    const ageUnder$ = fromEvent<MouseEvent>(this.ageNotOver65Btn.nativeElement, 'click').pipe(
      map( x => {
        this.dataService.finAssistApp.ageOver65 = false;
      }));


    merge(this.prepForm.valueChanges.pipe(debounceTime(250),
      distinctUntilChanged(),
      filter(
        (values) => {
          // console.log('value changes: ', values);
          const isEmptyObj = _.isEmpty(values);
          return !isEmptyObj;
        }
      ), tap(
        (value) => {
           console.log('form value: ', value.netIncome);
          if (!value.netIncome || value.netIncome.trim().length === 0){
            console.log('form value:11 ', value);
             this.finAssistApp.netIncomelastYear = null;
          }else{
            console.log('form value:22 ', value);
            this.finAssistApp.netIncomelastYear = value.netIncome;
          }

          if (!value.spouseIncomeLine236 || value.spouseIncomeLine236.trim().length === 0){
             this.finAssistApp.spouseIncomeLine236 = null;
          }

          if (!value.line125){
            this.finAssistApp.spouseDSPAmount_line125 = null;
          }

          if (!value.line214){
            this.finAssistApp.claimedChildCareExpense_line214 = null;
          }

          if (!value.line117){
            this.finAssistApp.reportedUCCBenefit_line117 = null;
          }

          if (!value.childrenCount || value.childrenCount.trim().length === 0){
            this.finAssistApp.childrenCount = null;
          }

          return value;
        }
      )), ageOver$, ageUnder$,

      merge(
          fromEvent<MouseEvent>(this.spouseOver65Btn.nativeElement, 'click').pipe(
            map(x => {
              this.finAssistApp.spouseAgeOver65 = true;
            }))
      ),
      merge(
          fromEvent<MouseEvent>(this.spouseOver65NegativeBtn.nativeElement, 'click').pipe(
            map(x => {
              this.finAssistApp.spouseAgeOver65 = false;
            }))
      ),
      merge(
          fromEvent<MouseEvent>(this.hasSpouse.nativeElement, 'click').pipe(
            map(x => {
              this.dataService.finAssistApp.setSpouse = true;
            }))
      ),
      merge(
          fromEvent<MouseEvent>(this.negativeHasSpouse.nativeElement, 'click').pipe(
            map(x => {
              this.finAssistApp.setSpouse = false;
            }))
      ))
      .subscribe(
        values => {
          // console.log('values before saving: ', values);
          this.dataService.saveFinAssistApplication();
        }
      );
  }

  toggleClaimForSelfDisabilityCredit($event: Event): void {
    if (this.finAssistApp.applicantClaimForAttendantCareExpense){
      $event.preventDefault();
      this.applicantClaimDisabilityCredit();
    }else{
      this.finAssistApp.selfDisabilityCredit = !this.finAssistApp.selfDisabilityCredit;
    }
  }

  toggleClaimForSpouseDisabilityCredit($event: Event): void{
    if (this.finAssistApp.spouseClaimForAttendantCareExpense && !this.finAssistApp.spouseEligibleForDisabilityCredit){
      $event.preventDefault();
      this.spouseClaimDisabilityCredit();
    }else{
      this.finAssistApp.spouseEligibleForDisabilityCredit = !this.finAssistApp.spouseEligibleForDisabilityCredit;
    }
  }

  get showDisabilityInfo(){
    return this._showDisabilityInfo;
  }

  set showDisabilityInfo(doShow: boolean){
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

  addSpouse(): void {
    this.finAssistApp.setSpouse = true;
  }

  updateQualify(evt: boolean): void {
    this._likelyQualify = evt;
  }

  get likelyQualify(): boolean{
    return this._likelyQualify;
  }

  updateChildDisabilityCreditCreditMultiplier(evt: string){
    this.finAssistApp.childWithDisabilityCount = parseInt(evt);
    this.dataService.saveFinAssistApplication();
  }

  ngDoCheck(){
    this.qualifiedForAssistance = this.finAssistApp.eligibility.adjustedNetIncome <= this.qualificationThreshhold;
    // fix for DEF-91
    this.requireAttendantCareReceipts = this.finAssistApp.applicantClaimForAttendantCareExpense ||
    this.finAssistApp.spouseClaimForAttendantCareExpense || this.finAssistApp.childClaimForAttendantCareExpense;
  }

  applicantClaimForAttendantCareExpense($event: Event){
    if (!this.finAssistApp.applicantClaimForAttendantCareExpense
        && this.finAssistApp.selfDisabilityCredit === true){
      event.preventDefault();

      this.claimCategory = this.CREDIT_CLAIM_CATEGORY[1];
      this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY[0];
      this.claimant = this.CREDIT_CLAIMANT[0];

      this.disabilityNursingHomeChoiceModal.config.backdrop = false;
      this.disabilityNursingHomeChoiceModal.show();
    }else{
      this.finAssistApp.applicantClaimForAttendantCareExpense = !this.finAssistApp.applicantClaimForAttendantCareExpense;
    }
  }

  spouseClaimForAttendantCareExpense($event: Event){
    if (!this.finAssistApp.spouseClaimForAttendantCareExpense
        && (this.finAssistApp.spouseDSPAmount_line125 || this.finAssistApp.spouseEligibleForDisabilityCredit)){
      event.preventDefault();

      this.claimCategory = this.CREDIT_CLAIM_CATEGORY[1];
      this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY[0];
      this.claimant = this.CREDIT_CLAIMANT[1];

      this.disabilityNursingHomeChoiceModal.config.backdrop = false;
      this.disabilityNursingHomeChoiceModal.show();
    }else{
      this.finAssistApp.spouseClaimForAttendantCareExpense = !this.finAssistApp.spouseClaimForAttendantCareExpense;
    }
  }

  childClaimForAttendantCareExpense(evt: boolean){
    this.finAssistApp.childClaimForAttendantCareExpense = !this.finAssistApp.childClaimForAttendantCareExpense;

    // if(!this.finAssistApp.childClaimForAttendantCareExpense && this.finAssistApp.childWithDisabilityCount){
    //     event.preventDefault();
    //     this.disabilityNursingHomeChoiceModal.config.backdrop = false;
    //     this.disabilityNursingHomeChoiceModal.show();
    // }else{
    //   this.finAssistApp.childClaimForAttendantCareExpense = !this.finAssistApp.childClaimForAttendantCareExpense;
    // }
  }

  // private childClaimDisabilityCredit(){
  //     this.disabilityNursingHomeChoiceModal.config.backdrop = false;
  //     this.disabilityNursingHomeChoiceModal.show();
  // }
  /**
   * Prevent spouse from claiming disability credit
   */
  private spouseClaimDisabilityCredit(){
      this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY[1];
      this.claimCategory = this.CREDIT_CLAIM_CATEGORY[0];
      this.claimant = this.CREDIT_CLAIMANT[1];
      this.disabilityNursingHomeChoiceModal.config.backdrop = false;
      this.disabilityNursingHomeChoiceModal.show();
  }
  /**
   * Prevent application from claiming disability credit
   */
  private applicantClaimDisabilityCredit(){
      this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY[1];
      this.claimCategory = this.CREDIT_CLAIM_CATEGORY[0];
      this.claimant = this.CREDIT_CLAIMANT[0];
      this.disabilityNursingHomeChoiceModal.config.backdrop = false;
      this.disabilityNursingHomeChoiceModal.show();
  }

  switchClaim(...args: string[]){
    //for self
    if (args[0] === this.CREDIT_CLAIMANT[0]){
      if (args[2] === this.CREDIT_CLAIM_CATEGORY[0]){
        // The counter claim is disability credit, now user has opted to switch to
        // apply for nursing home expense
        this.finAssistApp.applicantClaimForAttendantCareExpense = true;
        this.finAssistApp.selfDisabilityCredit = false;

      }else if (args[2] === this.CREDIT_CLAIM_CATEGORY[1]){
        // apply disability credit
        this.finAssistApp.applicantClaimForAttendantCareExpense = false;
        this.finAssistApp.selfDisabilityCredit = true;
      }
    }else if (args[0] === this.CREDIT_CLAIMANT[1]){
      // for spouse
      if (args[2] === this.CREDIT_CLAIM_CATEGORY[0]){
        // apply disability credit
        this.finAssistApp.spouseClaimForAttendantCareExpense = true;
        this.finAssistApp.spouseEligibleForDisabilityCredit = false;
      }else if (args[2] === this.CREDIT_CLAIM_CATEGORY[1]){
        // apply nursing home expense
        this.finAssistApp.spouseClaimForAttendantCareExpense = false;
        this.finAssistApp.spouseEligibleForDisabilityCredit = true;
      }
    }

    this.disabilityNursingHomeChoiceModal.hide();

  }


  initYearsList(){
    this.pastYears = [];
    const recentTaxYear = this.finAssistApp.MostRecentTaxYear; //< 2020 ? 2020 : this.finAssistApp.MostRecentTaxYear;
    const cutOffYear = 2020;

    const numberOfYears = (7 - (recentTaxYear - cutOffYear));
    let i = 3;
    while (i <= numberOfYears){
      this.pastYears.push(cutOffYear - i);
      i++;
    }

    if (!this.finAssistApp.assistYears || this.finAssistApp.assistYears.length < 7){
      this.finAssistApp.assistYears = this.pastYears.reduce(
        (tally, yearNum) => {
          const assistYear: AssistanceYear = new AssistanceYear();
          assistYear.apply = false;
          assistYear.year = yearNum;
          assistYear.docsRequired = true;
          assistYear.currentYear = this.finAssistApp.MostRecentTaxYear;

          if (yearNum === this.finAssistApp.MostRecentTaxYear){
            assistYear.docsRequired = false;
          }
          tally.push(assistYear);

          return tally;
      }, []);
    }
    this.dataService.saveFinAssistApplication();
  }

  get assistanceYearsList(): AssistanceYear[] {
    return this.finAssistApp.assistYears;
  }

  get getFinanialInfoSectionTitle(){
    if (!!this.userSelectedMostRecentTaxYear){
      return this.lang('./en/index.js').checkEligibilityScreenTitle.replace('{userSelectedMostRecentTaxYear}',
        this.userSelectedMostRecentTaxYear);
    }else{
      return this.lang('./en/index.js').checkEligibilityScreenTitleDefault;
    }
  }

  get taxYearsSpecified(){
    return this.finAssistApp.taxtYearsProvided;
  }

  get userSelectedMostRecentTaxYear(): number {
    let max = 0;
    if (this.finAssistApp.assistYears && this.finAssistApp.assistYears.length > 0){
      this.finAssistApp.assistYears.forEach(
        assistYear => {
          if (assistYear.apply && assistYear.year > max){
            max = assistYear.year;
          }
        }
      );
    }

    return max;

  }
  onAssistanceYearUpdate(assistYearParam: AssistanceYear){
    this.finAssistApp.assistYears.forEach(
      assistYear => {
        if (assistYear.year + '' === assistYearParam.year + ''){
          assistYear.apply = assistYearParam.apply;
        }
      }
    );

    this.dataService.saveFinAssistApplication();
  }

  onTaxYearInfoMissing(){
    this.taxYearInfoMissing = true;
  }

}
