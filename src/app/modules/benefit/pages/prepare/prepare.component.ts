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
import {CommonDeductionCalculatorComponent} from '../../../msp-core/components/common-deduction-calculator/common-deduction-calculator.component'
//import moment = require('moment');
import * as moment from 'moment';
import {Router} from '@angular/router';
import {ProcessService} from '../../../../services/process.service';

@Component({
    selector: 'msp-prepare',
    templateUrl: './prepare.component.html',
    styleUrls: ['./prepare.component.scss']
})
export class BenefitPrepareComponent  extends BaseComponent  {
    
    //static ProcessStepNum = 0;

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
    @ViewChild('disabilityNursingHomeChoiceModal') public disabilityNursingHomeChoiceModal: ModalDirective;
    @ViewChild('commonCalculator') commonCalculator: CommonDeductionCalculatorComponent;

    lang = require('./i18n');
    _showDisabilityInfo: boolean = false;
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

    CREDIT_CLAIM_CATEGORY: string[] = ['disability credit', 'attendant or nursing home expense credit'];
    CREDIT_CLAIMANT: string[] = ['yourself', 'spouse or common law partner'];


    /**
     * Past 6 tax years from now.
     */
    pastYears: number[] = [];

    constructor(private _router: Router, 
                public dataService: MspBenefitDataService , cd: ChangeDetectorRef){
        super(cd);
        this.showAttendantCareInfo = this.benefitApp.applicantClaimForAttendantCareExpense
            || this.benefitApp.spouseClaimForAttendantCareExpense
            || this.benefitApp.childClaimForAttendantCareExpense;
    }

    ngOnInit(){
       // this.initProcessMembers(BenefitPrepareComponent.ProcessStepNum, this._processService);
    
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
        // console.log('image added: %s', evt);
        this.benefitApp.attendantCareExpenseReceipts = this.benefitApp.attendantCareExpenseReceipts.concat(evt);
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
        if(this.prepForm != undefined) {
            merge(this.prepForm.valueChanges.pipe(debounceTime(250),
                distinctUntilChanged(),
                filter(
                    (values) => {
                        console.log('value changes: ', values);
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

                        return value;
                    }
                ))).subscribe(
                    values => {
                        console.log('values before saving: ', values);
                        this.dataService.saveBenefitApplication();
                    }
                ); 
        }
            
    }


    toggleClaimForSelfDisabilityCredit(evt: Event): void {
        if(evt) {
            this.dataService.benefitApp.selfDisabilityCredit = true;
            this.applicantClaimDisabilityCredit();
        } else {
            this.dataService.benefitApp.selfDisabilityCredit = false;
        }
    }

    setYear(assistYearParam: AssistanceYear) {
        this.userSelectedMostRecentTaxYear = assistYearParam.year;
        this.benefitApp.userSelectedMostRecentTaxYear = assistYearParam.year;

    }

    canContinue(evt): any {
        if(evt) {
            //this._processService.setStep(0, true);
            this.continue = evt; 
        }
        return evt ;
    }

    navigateToPersonalInfo() {
       // this._processService.setStep(0, true);
        this._router.navigate(['/benefit/personal-info']);
    }


    toggleClaimForSpouseDisabilityCredit($event: Event): void{
        if (this.benefitApp.spouseClaimForAttendantCareExpense && !this.benefitApp.spouseEligibleForDisabilityCredit){
            $event.preventDefault();
            this.spouseClaimDisabilityCredit();
        }else{
            this.benefitApp.spouseEligibleForDisabilityCredit = !this.benefitApp.spouseEligibleForDisabilityCredit;
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
        this.benefitApp.childWithDisabilityCount = parseInt(evt);
        this.dataService.saveBenefitApplication();
    }

    setAgeOver65(evt: boolean) {
        if(evt) {
            this.dataService.benefitApp.ageOver65 = true;
        } else {
            this.dataService.benefitApp.ageOver65 = false;
        }
        this.dataService.saveBenefitApplication();
    }

    sethasSpouse(evt: boolean) {
        if(evt) {
            this.dataService.benefitApp.hasSpouse = true;
        } else {
            this.dataService.benefitApp.hasSpouse = false;
        }
        this.dataService.saveBenefitApplication();
    }

    setchildren(evt: boolean) {
        if(evt) {
            this.dataService.benefitApp.haveChildrens = true;
        } else {
            this.dataService.benefitApp.haveChildrens = false;
        }
    }
    
    setApplicantClaimForAttendantCareExpense(evt: boolean) {
        if(evt) {
            this.dataService.benefitApp.applicantClaimForAttendantCareExpense = true;
        } else{
            

        }

    }

    ngDoCheck(){
        this.qualifiedForAssistance = this.benefitApp.eligibility.adjustedNetIncome <= this.qualificationThreshhold;
        // fix for DEF-91
        this.requireAttendantCareReceipts = this.benefitApp.applicantClaimForAttendantCareExpense ||
            this.benefitApp.spouseClaimForAttendantCareExpense || this.benefitApp.childClaimForAttendantCareExpense;
    }

    applicantClaimForAttendantCareExpense($event){
        if (!this.benefitApp.applicantClaimForAttendantCareExpense
            && this.benefitApp.selfDisabilityCredit === true){
            event.preventDefault();

            this.claimCategory = this.CREDIT_CLAIM_CATEGORY[1];
            this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY[0];
            this.claimant = this.CREDIT_CLAIMANT[0];

            this.disabilityNursingHomeChoiceModal.config.backdrop = false;
            this.disabilityNursingHomeChoiceModal.show();
        }else{
            this.benefitApp.applicantClaimForAttendantCareExpense = !this.benefitApp.applicantClaimForAttendantCareExpense;
        }
    }

    spouseClaimForAttendantCareExpense(){
        if (!this.benefitApp.spouseClaimForAttendantCareExpense
            && (this.benefitApp.spouseDSPAmount_line125 || this.benefitApp.spouseEligibleForDisabilityCredit)){
            event.preventDefault();

            this.claimCategory = this.CREDIT_CLAIM_CATEGORY[1];
            this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY[0];
            this.claimant = this.CREDIT_CLAIMANT[1];

            this.disabilityNursingHomeChoiceModal.config.backdrop = false;
            this.disabilityNursingHomeChoiceModal.show();
        }else{
            this.benefitApp.spouseClaimForAttendantCareExpense = !this.benefitApp.spouseClaimForAttendantCareExpense;
        }
    }

    childClaimForAttendantCareExpense(){
        this.benefitApp.childClaimForAttendantCareExpense = !this.benefitApp.childClaimForAttendantCareExpense;

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
                this.benefitApp.applicantClaimForAttendantCareExpense = true;
                this.benefitApp.selfDisabilityCredit = false;

            }else if (args[2] === this.CREDIT_CLAIM_CATEGORY[1]){
                // apply disability credit
                this.benefitApp.applicantClaimForAttendantCareExpense = false;
                this.benefitApp.selfDisabilityCredit = true;
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

        this.disabilityNursingHomeChoiceModal.hide();
    }

    get getFinanialInfoSectionTitle(){
        if (!!this.userSelectedMostRecentTaxYear){
            return this.lang('./en/index.js').checkEligibilityScreenTitle.replace('{userSelectedMostRecentTaxYear}',
                this.userSelectedMostRecentTaxYear);
        }else{
            return this.lang('./en/index.js').checkEligibilityScreenTitleDefault;
        }
    }

    onTaxYearUpdate(taxYear: number){
        this.benefitApp.taxYear = taxYear;
        this.dataService.saveBenefitApplication();
    }

    onTaxYearInfoMissing(){
        this.taxYearInfoMissing = true;
    }

}
