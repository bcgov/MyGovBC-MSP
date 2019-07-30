import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../models/base.component';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {debounceTime, distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import {ModalDirective} from 'ngx-bootstrap';
import {NgForm} from '@angular/forms';
import {MspImage} from '../../../../models/msp-image';
import {AssistanceYear} from '../../../assistance/models/assistance-year.model';
import {merge} from 'rxjs/internal/observable/merge';
import * as _ from 'lodash';
import {ConsentModalComponent} from 'moh-common-lib';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {CommonDeductionCalculatorComponent} from '../../../msp-core/components/common-deduction-calculator/common-deduction-calculator.component';
//import moment = require('moment');
import * as moment from 'moment';
import {Router} from '@angular/router';
import { ProcessService } from 'app/services/process.service';
//import {ProcessService} from '../../../../services/process.service';


@Component({
    selector: 'msp-prepare',
    templateUrl: './prepare.component.html',
    styleUrls: ['./prepare.component.scss']
})
export class BenefitPrepareComponent  extends BaseComponent  {
    //static ProcessStepNum = 1;
    @ViewChild('formRef') prepForm: NgForm;
    @ViewChild('incomeRef') incomeRef: ElementRef;
    @ViewChild('ageOver65Btn') ageOver65Btn: ElementRef;
    @ViewChild('ageNotOver65Btn') ageNotOver65Btn: ElementRef;
    @ViewChild('spouseOver65Btn') spouseOver65Btn: ElementRef;
    @ViewChild('spouseOver65NegativeBtn') spouseOver65NegativeBtn: ElementRef;
    @ViewChild('hasSpouse') hasSpouse: ElementRef;
    @ViewChild('negativeHasSpouse') negativeHasSpouse: ElementRef;
    //@ViewChild('fileUploader') fileUploader: FileUploaderComponent;
    @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;

    @ViewChild('mspConsentModal') mspConsentModal: ConsentModalComponent;
    @ViewChild('commonCalculator') commonCalculator: CommonDeductionCalculatorComponent;

    lang = require('./i18n');
    _showDisabilityInfo: boolean = false;
    chldCountExceededError: boolean = false;
    isDisabled: boolean = false ;
    showAttendantCareInfo = true;
    private _showChildrenInfo: boolean = false;
    today: any;
    private _likelyQualify: boolean = false;
    qualifiedForAssistance = false;
    requireAttendantCareReceipts = false;
    taxYearInfoMissing = false;
    qualificationThreshhold: number = 42000;
    userSelectedMostRecentTaxYear: number;
    counterClaimCategory: string;
    claimCategory: string;
    claimant: string;
    continue: boolean;
    showNursingError: boolean;
    showDisabilityError: boolean;

    CREDIT_CLAIM_CATEGORY: string[] = ['disability credit', 'attendant or nursing home expense credit'];
    CREDIT_CLAIMANT: string[] = ['yourself', 'spouse or common law partner'];


    /**
     * Past 6 tax years from now.
     */
    pastYears: number[] = [];

    constructor(private _router: Router,
                public dataService: MspBenefitDataService , cd: ChangeDetectorRef,
                private _processService: ProcessService){
        super(cd);
        this.showAttendantCareInfo = this.benefitApp.applicantClaimForAttendantCareExpense
            || this.benefitApp.spouseClaimForAttendantCareExpense
            || this.benefitApp.childClaimForAttendantCareExpense;
    }

    ngOnInit(){
       // this.initProcessMembers(BenefitPrepareComponent.ProcessStepNum, this._processService);
        //this._processService.setStep(BenefitPrepareComponent.ProcessStepNum, false);
        this._showDisabilityInfo =
            this.dataService.benefitApp.selfDisabilityCredit === true ||
            this.dataService.benefitApp.spouseEligibleForDisabilityCredit === true ||
            !!this.benefitApp.childWithDisabilityCount ||
            !_.isNil(this.dataService.benefitApp.spouseDSPAmount_line125);

        this.showChildrenInfo =
            !_.isNil(this.dataService.benefitApp.childrenCount) ||
            (!_.isNil(this.benefitApp.claimedChildCareExpense_line214) && this.benefitApp.claimedChildCareExpense_line214 > 0) ||
            ((!_.isNil(this.benefitApp.reportedUCCBenefit_line117) && (this.benefitApp.reportedUCCBenefit_line117 > 0)) );
        this.today = moment();
       // this.initYearsList();

    }

    addReceipts(evt: any){
        console.log('image added: %s', evt.length);
       /* if(evt.length === 0 && (this.benefitApp.applicantClaimForAttendantCareExpense || this.benefitApp.spouseClaimForAttendantCareExpense || this.benefitApp.childClaimForAttendantCareExpense )) {
            this.continue = false;
        }*/
        this.benefitApp.attendantCareExpenseReceipts = evt;
        //this.fileUploader.forceRender();
        this.dataService.saveBenefitApplication();
    }

    spaEnvCutOffDate(evt: any){
        this.benefitApp.spaEnvRes = evt;
    }

    errorReceipts(evt: MspImage) {
        this.mspImageErrorModal.imageWithError = evt;
        this.mspImageErrorModal.showFullSizeView();
        this.mspImageErrorModal.forceRender();
    }

    deleteReceipts(evt: MspImage){
        this.benefitApp.attendantCareExpenseReceipts = this.benefitApp.attendantCareExpenseReceipts.filter(
            receipt => {
                return receipt.id !== evt.id;
            }
        );
        this.dataService.saveBenefitApplication();
    }

    ngAfterViewInit() {
        if (!this.dataService.benefitApp.infoCollectionAgreement) {
            this.mspConsentModal.showFullSizeView();
        }

       /* this.prepForm.valueChanges.subscribe(() => {
            console.log('authorization form change: %o');
            this.dataService.saveBenefitApplication();
        });

        /*removing subscribe wont register clicks
        const ageOver$ = fromEvent<MouseEvent>(this.ageOver65Btn.nativeElement, 'click').pipe(
            map( () => {
                this.dataService.benefitApp.ageOver65 = true;
            }));


        const ageUnder$ = fromEvent<MouseEvent>(this.ageNotOver65Btn.nativeElement, 'click').pipe(
            map( () => {
                this.dataService.benefitApp.ageOver65 = false;
            }));*/
        if (this.prepForm !== undefined) {
            console.log('Prepform?', this.prepForm, this.prepForm.valueChanges);
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
                        // console.log('form value: ', value);
                        if (!value.netIncome || value.netIncome.trim().length === 0){
                            this.benefitApp.netIncomelastYear = null;
                        }else{
                            this.benefitApp.netIncomelastYear = value.netIncome;
                        }
                        if (!value.spouseIncomeLine236 || value.spouseIncomeLine236.trim().length === 0){
                            this.benefitApp.spouseIncomeLine236 = null;
                        }
                        if (!value.line125){
                            this.benefitApp.spouseDSPAmount_line125 = null;
                        }
                        if (!value.line214){
                            this.benefitApp.claimedChildCareExpense_line214 = null;
                        }
                        if (!value.line117){
                            this.benefitApp.reportedUCCBenefit_line117 = null;
                        }
                        if (!value.childrenCount || value.childrenCount.trim().length === 0){
                            this.benefitApp.childrenCount = null;
                        }

                        // TODO - INVESTIGATE. Does commenting this out fix the runtime TypeError for rxjs subscribe?
                        // return value;
                    }
                    // TODO - Sometimes this subscribe fails. Race condition, or something else?
                    // TypeError: You provided an invalid object where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.
                    // TODO - Test with blacklisting the SPA ENV request.

                    // THeory on "spouse" persistence - is the input not in the form? form.values doesn't include it, why?
                    // does that matter? could just write to service and persist anyways, that should work regardless of template
                )));
        }
    }



    setYear(assistYearParam: AssistanceYear) {
        this.userSelectedMostRecentTaxYear = assistYearParam.year;
        this.benefitApp.userSelectedMostRecentTaxYear = assistYearParam.year;

    }

    canContinue(evt): any {

        console.log(evt);
        console.log(this.continue);

        if(this.benefitApp.hasRegisteredDisabilityPlan === undefined ||this.benefitApp.hasClaimedAttendantCareExpenses === undefined) {
            return false;
        }

        if ((this.benefitApp.childClaimForAttendantCareExpenseCount > this.benefitApp.childrenCount) || (this.benefitApp.childWithDisabilityCount > this.benefitApp.childrenCount)) {
            this.continue = false;
            return false ;
        }

        if (this.benefitApp.attendantCareExpenseReceipts.length === 0 && (this.benefitApp.applicantClaimForAttendantCareExpense || this.benefitApp.spouseClaimForAttendantCareExpense || this.benefitApp.childClaimForAttendantCareExpense)) {
            this.continue = false;
            return false;
        }

        if (evt) {
            this.continue = evt;
        }
        return evt ;
    }

    navigateToPersonalInfo() {
        this._processService.setStep(CommonDeductionCalculatorComponent.ProcessStepNum, true);
        this._router.navigate(['/benefit/personal-info']);
    }


    toggleClaimForSpouseDisabilityCredit($event: Event): void{
        if (this.benefitApp.spouseClaimForAttendantCareExpense && !this.benefitApp.spouseEligibleForDisabilityCredit){
            $event.preventDefault();
            this.showNursingError = true;
            this.spouseClaimDisabilityCredit();
        }else{
            this.showNursingError = false;
            this.benefitApp.spouseEligibleForDisabilityCredit = !this.benefitApp.spouseEligibleForDisabilityCredit;
        }
        this.dataService.saveBenefitApplication();
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

    get benefitApp(): BenefitApplication{
        return this.dataService.benefitApp;
    }

    updateQualify(evt: boolean): void {
        this._likelyQualify = evt;
    }

    get likelyQualify(): boolean{
        return this._likelyQualify;
    }

    updateChildDisabilityCreditCreditMultiplier(evt: string){
        this.benefitApp.childWithDisabilityCount = parseInt(evt, 10);
        if (this.benefitApp.childWithDisabilityCount > this.benefitApp.childrenCount) {
            this.chldCountExceededError = true;
        }
        this.dataService.saveBenefitApplication();
    }

   /* setAgeOver65(evt: boolean) {
        if (evt) {
            this.dataService.benefitApp.ageOver65 = true;
        } else {
            this.dataService.benefitApp.ageOver65 = false;
        }
         this.dataService.saveBenefitApplication();
    }*/

    setHasSpouse(hasSpouse: boolean) {
        this.benefitApp.hasSpouse = hasSpouse;
        if (!hasSpouse){
            this.benefitApp.spouseAgeOver65 = null;
            this.benefitApp.spouseIncomeLine236 = null;

        }
        this.dataService.saveBenefitApplication();
    }

   /* setchildren(evt: boolean) {
        if (evt) {
            this.dataService.benefitApp.haveChildrens = true;
        } else {
            this.dataService.benefitApp.haveChildrens = false;
        }
    }*/


    ngDoCheck(){
        this.qualifiedForAssistance = this.benefitApp.eligibility.adjustedNetIncome <= this.qualificationThreshhold;
        // fix for DEF-91
        this.requireAttendantCareReceipts = this.benefitApp.applicantClaimForAttendantCareExpense ||
            this.benefitApp.spouseClaimForAttendantCareExpense || this.benefitApp.childClaimForAttendantCareExpense;
    }

    checkSelfDisabilityCredit(evt: any) {
        console.log(evt);
        this.dataService.benefitApp.applicantEligibleForDisabilityCredit = evt;
        this.dataService.saveBenefitApplication();

    }



    applicantClaimDataChange(evt: boolean) {
        console.log(evt);
        console.log(this.benefitApp.applicantEligibleForDisabilityCredit);
        if (evt && this.benefitApp.applicantEligibleForDisabilityCredit !== true) {
            console.log('---Abbbbb----');
            this.dataService.benefitApp.applicantClaimForAttendantCareExpense = evt;
            this.dataService.saveBenefitApplication();
        } else {
            this.isDisabled = true;
        }

    }

    toggleClaimForSelfDisabilityCredit(evt: Event): void {
        console.log(evt.defaultPrevented);

        this.dataService.benefitApp.applicantEligibleForDisabilityCredit = !this.dataService.benefitApp.applicantEligibleForDisabilityCredit;


        /* if (evt) {
             this.dataService.benefitApp.applicantEligibleForDisabilityCredit = true;
             this.applicantClaimDisabilityCredit();
         } else {
             this.dataService.benefitApp.applicantEligibleForDisabilityCredit = false;
         }*/

         if (this.dataService.benefitApp.applicantEligibleForDisabilityCredit === true && this.showNursingError) {
            this.showNursingError = false;
         }

         if (this.dataService.benefitApp.applicantClaimForAttendantCareExpense === true && this.dataService.benefitApp.applicantEligibleForDisabilityCredit === true) {

             evt.preventDefault();
             console.log(evt.defaultPrevented);
             this.showNursingError = true;
         }
         this.dataService.saveBenefitApplication();

     }


     applicantClaimForAttendantCare(evt: Event){
        /* console.log(evt);
        console.log(this.dataService.benefitApp.applicantEligibleForDisabilityCredit);
        console.log(this.dataService.benefitApp.applicantClaimForAttendantCareExpense);
        this.dataService.benefitApp.applicantClaimForAttendantCareExpense = !this.dataService.benefitApp.applicantClaimForAttendantCareExpense;

        if (this.dataService.benefitApp.applicantEligibleForDisabilityCredit === true && this.dataService.benefitApp.applicantClaimForAttendantCareExpense === true) {
            evt.preventDefault();
            this.claimCategory = this.CREDIT_CLAIM_CATEGORY[1];
            this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY[0];
            this.claimant = this.CREDIT_CLAIMANT[0];
            this.showDisabilityError = true;
        }

        if (this.dataService.benefitApp.applicantClaimForAttendantCareExpense === true && this.showDisabilityError) {
            this.showNursingError = false;
        }*/

        if (!this.dataService.benefitApp.applicantClaimForAttendantCareExpense
            && this.dataService.benefitApp.applicantEligibleForDisabilityCredit === true){
            evt.preventDefault();
            this.showDisabilityError = true;

            this.claimCategory = this.CREDIT_CLAIM_CATEGORY[1];
            this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY[0];
            this.claimant = this.CREDIT_CLAIMANT[0];

            //this.disabilityNursingHomeChoiceModal.config.backdrop = false;
            //this.disabilityNursingHomeChoiceModal.show();
        }else{
            this.showDisabilityError = false;
            this.benefitApp.applicantClaimForAttendantCareExpense = !this.benefitApp.applicantClaimForAttendantCareExpense;
        }

        this.dataService.saveBenefitApplication();
    }

    spouseClaimForAttendantCare(event: Event){
        console.log(event);
        if (!this.benefitApp.spouseClaimForAttendantCareExpense
            && (this.benefitApp.spouseDSPAmount_line125 || this.benefitApp.spouseEligibleForDisabilityCredit)){
            event.preventDefault();
            this.showDisabilityError = true;

            this.claimCategory = this.CREDIT_CLAIM_CATEGORY[1];
            this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY[0];
            this.claimant = this.CREDIT_CLAIMANT[1];

        }else{
            this.benefitApp.spouseClaimForAttendantCareExpense = !this.benefitApp.spouseClaimForAttendantCareExpense;
            this.showDisabilityError = false;
        }
        this.dataService.saveBenefitApplication();
    }

    updateChildren(evt: boolean) {
        this.dataService.benefitApp.haveChildrens = evt;
        if (!evt) {

            this.dataService.benefitApp.childrenCount = 0;
            this.dataService.benefitApp.claimedChildCareExpense_line214 = 0;
        }
        this.dataService.saveBenefitApplication();

    }

    checkedChildClaimDisabilityCredit(evt: boolean) {
        this.benefitApp.childClaimForDisabilityCredit = evt;
        if (!evt) {
           this.benefitApp.childWithDisabilityCount = 0;
        }

    }

    childClaimForAttendantCareExpense(evt: boolean){
        this.benefitApp.childClaimForAttendantCareExpense = !this.benefitApp.childClaimForAttendantCareExpense;
        if (!evt) {
           this.benefitApp.childClaimForAttendantCareExpenseCount = 0;
        }
        this.dataService.saveBenefitApplication();
        // if(!this.benefitApp.childClaimForAttendantCareExpense && this.benefitApp.childWithDisabilityCount){
        //     event.preventDefault();
        //     this.disabilityNursingHomeChoiceModal.config.backdrop = false;
        //     this.disabilityNursingHomeChoiceModal.show();
        // }else{
        //   this.benefitApp.childClaimForAttendantCareExpense = !this.benefitApp.childClaimForAttendantCareExpense;
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
        this.claimant = this.CREDIT_CLAIMANT[1];    }
    /**
     * Prevent application from claiming disability credit
    */
    private applicantClaimDisabilityCredit(){
        this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY[1];
        this.claimCategory = this.CREDIT_CLAIM_CATEGORY[0];
        this.claimant = this.CREDIT_CLAIMANT[0];
       // this.disabilityNursingHomeChoiceModal.config.backdrop = false;
        //this.disabilityNursingHomeChoiceModal.show();
    }

    switchClaim(...args: string[]){
        //for self
        if (args[0] === this.CREDIT_CLAIMANT[0]){
            if (args[2] === this.CREDIT_CLAIM_CATEGORY[0]){
                // The counter claim is disability credit, now user has opted to switch to
                // apply for nursing home expense
                this.benefitApp.applicantClaimForAttendantCareExpense = true;
                this.benefitApp.selfDisabilityCredit = false;

            }else if (args[2] === this.CREDIT_CLAIM_CATEGORY[1]){
                // apply disability credit
                this.benefitApp.applicantClaimForAttendantCareExpense = false;
                //this.benefitApp.selfDisabilityCredit = true;
            }
        }else if (args[0] === this.CREDIT_CLAIMANT[1]){
            // for spouse
            if (args[2] === this.CREDIT_CLAIM_CATEGORY[0]){
                // apply disability credit
                this.benefitApp.spouseClaimForAttendantCareExpense = true;
                this.benefitApp.spouseEligibleForDisabilityCredit = false;
            }else if (args[2] === this.CREDIT_CLAIM_CATEGORY[1]){
                // apply nursing home expense
                this.benefitApp.spouseClaimForAttendantCareExpense = false;
                this.benefitApp.spouseEligibleForDisabilityCredit = true;
            }
        }

    }

    get getFinanialInfoSectionTitle(){
        if (!!this.benefitApp.taxYear){
            return this.lang('./en/index.js').checkEligibilityScreenTitle.replace('{userSelectedMostRecentTaxYear}',
                this.benefitApp.taxYear);
        }else{
            return this.lang('./en/index.js').checkEligibilityScreenTitleDefault;
        }
    }

 /*   selectNursingOrDisabilityError(): boolean {
        let currentSelectedProgram;
        let otherProgram;

        if (this.benefitApp.applicantClaimForAttendantCareExpense) {
            return true;
            currentSelectedProgram = 'nursing home expense';
            otherProgram = 'disability credit';
        }

        if (this.benefitApp.applicantEligibleForDisabilityCredit) {
            return true;
            currentSelectedProgram = 'disability credit';
            otherProgram = 'nursing home expense';
        }
        return false;*/
//        let error =  this.lang('./en/index.js').selectNursingHomeOrDisabilityError.replace('{program}', currentSelectedProgram);
  //      error = this.lang('./en/index.js').selectNursingHomeOrDisabilityError.replace('{otherProgram}', otherProgram);
    //    return error;




    get getSpouseFinanialInfoSectionTitle(){
        if (!!this.benefitApp.taxYear){
            return this.lang('./en/index.js').whatIsYourSpouseOrPartnerIncome.replace('{userSelectedMostRecentTaxYear}',
                this.benefitApp.taxYear);
        }else{
            return this.lang('./en/index.js').whatIsYourSpouseOrPartnerIncome;
        }
    }

    get getDisablityCreditTitle() {
        return this.lang('./en/index.js').didAnyoneClaimDisabilityTaxCreditLastYear.replace('{userSelectedMostRecentTaxYear}',
        this.benefitApp.taxYear);
    }

    updateDisabilityCredit(evt: boolean){

        if (!evt) {
            this.dataService.benefitApp.applicantEligibleForDisabilityCredit = false;
            this.benefitApp.spouseEligibleForDisabilityCredit = false;
            this.benefitApp.childClaimForDisabilityCredit = false;
        }
        this.benefitApp.selfDisabilityCredit = evt;
        this.dataService.saveBenefitApplication();
    }

    updateRegisteredDisabilityPlan(evt: boolean) {
        if (!evt) {
            this.dataService.benefitApp.spouseDSPAmount_line125 = 0;
        }
        this.benefitApp.hasRegisteredDisabilityPlan = evt;
        this.dataService.saveBenefitApplication();
    }

    updateNursingHomeExpense(evt: boolean) {
        if (!evt) {

            this.dataService.benefitApp.applicantClaimForAttendantCareExpense = evt;
            this.dataService.benefitApp.spouseClaimForAttendantCareExpense = evt;
            this.dataService.benefitApp.childClaimForAttendantCareExpense = evt;
            this.dataService.benefitApp.childClaimForAttendantCareExpenseCount = 0;
            this.dataService.benefitApp.attendantCareExpenseReceipts = [] ;
        }

        this.benefitApp.hasClaimedAttendantCareExpenses = evt;
        this.dataService.saveBenefitApplication();


    }

    get didAnyoneClaimAttendantCareLastYear() {
        return this.lang('./en/index.js').didAnyoneClaimAttendantCareLastYear.replace('{userSelectedMostRecentTaxYear}',
        this.benefitApp.taxYear);

    }

    onTaxYearUpdate(taxYear: number){
        this.benefitApp.taxYear = taxYear;

        if (this.dataService.benefitApp.applicant.assistYearDocs && this.dataService.benefitApp.applicant.assistYearDocs.length > 0) {
            this.dataService.benefitApp.applicant.assistYearDocs = [];
        }

        if (this.dataService.benefitApp.spouse.assistYearDocs && this.dataService.benefitApp.spouse.assistYearDocs.length > 0) {
            this.dataService.benefitApp.spouse.assistYearDocs = [];
        }
        this.dataService.saveBenefitApplication();
    }

    onTaxYearInfoMissing(){
        this.taxYearInfoMissing = true;
    }

}
