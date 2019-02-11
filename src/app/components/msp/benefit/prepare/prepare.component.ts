import {AfterViewInit, ChangeDetectorRef, Component, DoCheck, ElementRef, OnInit,ViewChild} from '@angular/core';
import {BaseComponent} from '../../common/base.component';
import {MspDataService} from '../../service/msp-data.service';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';
import {BenefitApplication} from '../../model/benefit-application.model';
import {MspBenefitDataService} from '../../service/msp-benefit-data.service';
import {FileUploaderComponent} from '../../common/file-uploader/file-uploader.component';
import {debounceTime, distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {MspImageErrorModalComponent} from '../../common/image-error-modal/image-error-modal.component';
import {ModalDirective} from 'ngx-bootstrap';
import {NgForm} from '@angular/forms';
import {MspImage} from '../../model/msp-image';
import {AssistanceYear} from '../../model/assistance-year.model';
import {merge} from 'rxjs/internal/observable/merge';
import {MspAssistanceYearComponent} from '../../assistance/prepare/assistance-year/assistance-year.component';
import * as _ from 'lodash';
import {MspConsentModalComponent} from '../../common/consent-modal/consent-modal.component';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';


@Component({
    selector: 'msp-prepare',
    templateUrl: './prepare.component.html',
    styleUrls: ['./prepare.component.scss']
})
export class BenefitPrepareComponent implements AfterViewInit, OnInit, DoCheck {

    @ViewChild('formRef') prepForm: NgForm;
    @ViewChild('incomeRef') incomeRef: ElementRef;
    @ViewChild('ageOver65Btn') ageOver65Btn: ElementRef;
    @ViewChild('ageNotOver65Btn') ageNotOver65Btn: ElementRef;
    @ViewChild('spouseOver65Btn') spouseOver65Btn: ElementRef;
    @ViewChild('spouseOver65NegativeBtn') spouseOver65NegativeBtn: ElementRef;
    @ViewChild('hasSpouse') hasSpouse: ElementRef;
    @ViewChild('negativeHasSpouse') negativeHasSpouse: ElementRef;
    @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
    @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;

    @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;
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

    counterClaimCategory: string;
    claimCategory: string;
    claimant: string;

    CREDIT_CLAIM_CATEGORY: string[] = ['disability credit', 'attendant or nursing home expense credit'];
    CREDIT_CLAIMANT: string[] = ['yourself', 'spouse or common law partner'];


    /**
     * Past 6 tax years from now.
     */
    pastYears: number[] = [];

    constructor(public dataService: MspBenefitDataService){
        this.showAttendantCareInfo = this.benefitApp.applicantClaimForAttendantCareExpense
            || this.benefitApp.spouseClaimForAttendantCareExpense
            || this.benefitApp.childClaimForAttendantCareExpense;
    }



    ngOnInit(){
        this._showDisabilityInfo =
            this.dataService.benefitApp.selfDisabilityCredit === true ||
            this.dataService.benefitApp.spouseEligibleForDisabilityCredit === true ||
            !!this.benefitApp.childWithDisabilityCount ||
            !_.isNil(this.dataService.benefitApp.spouseDSPAmount_line125);

        this.showChildrenInfo =
            !_.isNil(this.dataService.benefitApp.childrenCount) ||
            (!_.isNil(this.benefitApp.claimedChildCareExpense_line214) && this.benefitApp.claimedChildCareExpense_line214 > 0) ||
            ((!_.isNil(this.benefitApp.reportedUCCBenefit_line117) && (this.benefitApp.reportedUCCBenefit_line117 > 0)) );

        this.initYearsList();

    }

    addReceipts(evt: any){
        // console.log('image added: %s', evt);
        this.benefitApp.attendantCareExpenseReceipts = this.benefitApp.attendantCareExpenseReceipts.concat(evt);
        this.fileUploader.forceRender();
        this.dataService.saveBenefitApplication();
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

        //removing subscribe wont register clicks
        const ageOver$ = fromEvent<MouseEvent>(this.ageOver65Btn.nativeElement, 'click').pipe(
            map( x => {
                this.dataService.benefitApp.ageOver65 = true;
            }));


        const ageUnder$ = fromEvent<MouseEvent>(this.ageNotOver65Btn.nativeElement, 'click').pipe(
            map( x => {
                this.dataService.benefitApp.ageOver65 = false;
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
            )), ageOver$, ageUnder$,

            merge(
                fromEvent<MouseEvent>(this.spouseOver65Btn.nativeElement, 'click').pipe(
                    map(x => {
                        this.benefitApp.spouseAgeOver65 = true;
                    }))
            ),
            merge(
                fromEvent<MouseEvent>(this.spouseOver65NegativeBtn.nativeElement, 'click').pipe(
                    map(x => {
                        this.benefitApp.spouseAgeOver65 = false;
                    }))
            ),
            merge(
                fromEvent<MouseEvent>(this.hasSpouse.nativeElement, 'click').pipe(
                    map(x => {
                        this.dataService.benefitApp.setSpouse = true;
                    }))
            ),
            merge(
                fromEvent<MouseEvent>(this.negativeHasSpouse.nativeElement, 'click').pipe(
                    map(x => {
                        this.benefitApp.setSpouse = false;
                    }))
            ))
            .subscribe(
                values => {
                    // console.log('values before saving: ', values);
                    this.dataService.saveBenefitApplication();
                }
            );
    }

    toggleClaimForSelfDisabilityCredit($event: Event): void {
        if (this.benefitApp.applicantClaimForAttendantCareExpense){
            $event.preventDefault();
            this.applicantClaimDisabilityCredit();
        }else{
            this.benefitApp.selfDisabilityCredit = !this.benefitApp.selfDisabilityCredit;
        }
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

    addSpouse(): void {
        this.benefitApp.setSpouse = true;
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

    ngDoCheck(){
        this.qualifiedForAssistance = this.benefitApp.eligibility.adjustedNetIncome <= this.qualificationThreshhold;
        // fix for DEF-91
        this.requireAttendantCareReceipts = this.benefitApp.applicantClaimForAttendantCareExpense ||
            this.benefitApp.spouseClaimForAttendantCareExpense || this.benefitApp.childClaimForAttendantCareExpense;
    }

    applicantClaimForAttendantCareExpense($event: Event){
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

    spouseClaimForAttendantCareExpense($event: Event){
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

    childClaimForAttendantCareExpense(evt: boolean){
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


    initYearsList(){
        this.pastYears = [];
        const recentTaxYear = this.benefitApp.MostRecentTaxYear;
        this.pastYears.push(recentTaxYear);

        let i = 1;
        while (i < 7){
            this.pastYears.push(recentTaxYear - i);
            i++;
        }

        if (!this.benefitApp.assistYears || this.benefitApp.assistYears.length < 7){
            this.benefitApp.assistYears = this.pastYears.reduce(
                (tally, yearNum) => {
                    const assistYear: AssistanceYear = new AssistanceYear();
                    assistYear.apply = false;
                    assistYear.year = yearNum;
                    assistYear.docsRequired = true;
                    assistYear.currentYear = this.benefitApp.MostRecentTaxYear;

                    if (yearNum === this.benefitApp.MostRecentTaxYear){
                        assistYear.docsRequired = false;
                    }
                    tally.push(assistYear);

                    return tally;
                }, []);
        }
        this.dataService.saveBenefitApplication();
    }

    get assistanceYearsList(): AssistanceYear[] {
        return this.benefitApp.assistYears;
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
        return this.benefitApp.taxtYearsProvided;
    }

    get userSelectedMostRecentTaxYear(): number {
        let max = 0;
        if (this.benefitApp.assistYears && this.benefitApp.assistYears.length > 0){
            this.benefitApp.assistYears.forEach(
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
        this.benefitApp.assistYears.forEach(
            assistYear => {
                if (assistYear.year + '' === assistYearParam.year + ''){
                    assistYear.apply = assistYearParam.apply;
                }
            }
        );

        this.dataService.saveBenefitApplication();
    }

    onTaxYearInfoMissing(){
        this.taxYearInfoMissing = true;
    }

}
