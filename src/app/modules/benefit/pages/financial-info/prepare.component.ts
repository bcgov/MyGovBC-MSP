import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../models/base.component';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {debounceTime, distinctUntilChanged, filter, tap} from 'rxjs/operators';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import {NgForm} from '@angular/forms';
import {AssistanceYear} from '../../../assistance/models/assistance-year.model';
import {merge} from 'rxjs/internal/observable/merge';
import * as _ from 'lodash';
import {ConsentModalComponent, CommonImage} from 'moh-common-lib';
import {CommonDeductionCalculatorComponent} from '../../../msp-core/components/common-deduction-calculator/common-deduction-calculator.component';
import * as moment from 'moment';
import {Router} from '@angular/router';
import { ProcessService } from 'app/services/process.service';
import { ATTENDANT_CARE_CLAIM_AMT } from '../../../../constants';
import { ISpaEnvResponse } from 'moh-common-lib/lib/components/consent-modal/consent-modal.component';

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

    CREDIT_CLAIM_CATEGORY = {
        DISABILITY: 'disability credit',
        ATTENDANT_CARE: 'attendant or nursing home expense credit'
    };
    CREDIT_CLAIMANT = {
        APPLICANT: 'yourself',
        SPOUSE: 'spouse or common law partner'
    };


    /**
     * Past 6 tax years from now.
     */
    pastYears: number[] = [];

    constructor(
        private _router: Router,
        public dataService: MspBenefitDataService , cd: ChangeDetectorRef,
        private _processService: ProcessService
    ) {
        super(cd);
        this.showAttendantCareInfo = this.benefitApp.applicantClaimForAttendantCareExpense
            || this.benefitApp.spouseClaimForAttendantCareExpense
            || this.benefitApp.childClaimForAttendantCareExpense;
    }

    ngOnInit() {
        this._showDisabilityInfo =
            this.benefitApp.selfDisabilityCredit === true ||
            this.benefitApp.spouseEligibleForDisabilityCredit === true ||
            !!this.benefitApp.childWithDisabilityCount ||
            !_.isNil(this.benefitApp.spouseDSPAmount_line125);

        this.showChildrenInfo =
            !_.isNil(this.benefitApp.childrenCount) ||
            (!_.isNil(this.benefitApp.claimedChildCareExpense_line214) && this.benefitApp.claimedChildCareExpense_line214 > 0) ||
            ((!_.isNil(this.benefitApp.reportedUCCBenefit_line117) && (this.benefitApp.reportedUCCBenefit_line117 > 0)) );
        this.today = moment();
       // this.initYearsList();
    }

    addReceipts(receipts: CommonImage[]) {
        this.benefitApp.attendantCareExpenseReceipts = receipts;
        this.dataService.saveBenefitApplication();
    }

    spaEnvCutOffDate(response: ISpaEnvResponse){
        this.benefitApp.spaEnvRes = response;
    }


    errorReceipts(image: CommonImage) {
        this.mspImageErrorModal.imageWithError = image;
        this.mspImageErrorModal.showFullSizeView();
        this.mspImageErrorModal.forceRender();
    }

    deleteReceipts(image: CommonImage){
        this.benefitApp.attendantCareExpenseReceipts = this.benefitApp.attendantCareExpenseReceipts.filter(
            receipt => (receipt.id !== image.id)
        );

        this.dataService.saveBenefitApplication();
    }

    ngAfterViewInit() {
        if (!this.benefitApp.infoCollectionAgreement) {
            this.mspConsentModal.showFullSizeView();
        }

       /* this.prepForm.valueChanges.subscribe(() => {
            console.log('authorization form change: %o');
            this.dataService.saveBenefitApplication();
        });

        /*removing subscribe wont register clicks
        const ageOver$ = fromEvent<MouseEvent>(this.ageOver65Btn.nativeElement, 'click').pipe(
            map( () => {
                this.benefitApp.ageOver65 = true;
            }));


        const ageUnder$ = fromEvent<MouseEvent>(this.ageNotOver65Btn.nativeElement, 'click').pipe(
            map( () => {
                this.benefitApp.ageOver65 = false;
            }));*/
        if (this.prepForm !== undefined) {
           // console.log('Prepform?', this.prepForm, this.prepForm.valueChanges);
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

    // All the validations and required field are coming from common-deduction-calculator canContinue method
    canContinue(event: boolean): boolean {
        this.continue = event;

        if (this.childCountExceedError()) {
            return this.continue = false;
        }

        return event;
    }

    navigateToPersonalInfo() {
        this._processService.setStep(CommonDeductionCalculatorComponent.ProcessStepNum, true);
        this._router.navigate(['/benefit/personal-info']);
    }

    spouseDisabilityClicked($event: Event): void {
        if (this.benefitApp.spouseClaimForAttendantCareExpense) {
            $event.preventDefault();
            this.showNursingError = true;
        }
    }

    spouseNursingClicked($event: Event): void {
        if (this.benefitApp.spouseEligibleForDisabilityCredit) {
            $event.preventDefault();
            this.showDisabilityError = true;
        }
    }

    toggleClaimForSpouseDisabilityCredit(): void {
        if (
            this.benefitApp.spouseClaimForAttendantCareExpense &&
            !this.benefitApp.spouseEligibleForDisabilityCredit
        ) {
            this.preventSpouseDisabilityCreditClaim();
        } else {
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

    updateChildDisabilityCreditCreditMultiplier(evt: number){
        console.log('updateChildDisabilityCreditCreditMultiplier', evt);

        if (evt) {
            this.benefitApp.childWithDisabilityCount = evt;

            if (this.benefitApp.childWithDisabilityCount > this.benefitApp.childrenCount) {
                this.chldCountExceededError = true;
            }

            this.dataService.saveBenefitApplication();
        } else {
            console.log(this.benefitApp.childWithDisabilityCount);
            this.benefitApp.childWithDisabilityCount = null;
        }
    }

    childCountExceedError(): boolean {
        if (
            (this.benefitApp.childWithAttendantCareCount && this.benefitApp.numberOfChildrenWithDisability) &&
            this.benefitApp.childrenCount
        ) {
            const childcount = this.benefitApp.childrenCount;
            const childDeclaredForbenefit = (
                (this.benefitApp.childWithAttendantCareCount) + (this.benefitApp.numberOfChildrenWithDisability)
            );

            return childDeclaredForbenefit > childcount ? true : false;
        } else {
            return false;
        }
    }

    setHasSpouse(hasSpouse: boolean) {
        this.benefitApp.hasSpouse = hasSpouse;

        if (!hasSpouse){
            this.benefitApp.spouseAgeOver65 = null;
            this.benefitApp.spouseIncomeLine236 = null;
            this.benefitApp.spouseEligibleForDisabilityCredit = false;
            this.spouseClaimForAttendantCare(false);
        }

        this.dataService.saveBenefitApplication();
    }

    ngDoCheck(){
        this.qualifiedForAssistance = this.benefitApp.eligibility.adjustedNetIncome <= this.qualificationThreshhold;
        // fix for DEF-91
        this.requireAttendantCareReceipts = this.benefitApp.applicantClaimForAttendantCareExpense ||
            this.benefitApp.spouseClaimForAttendantCareExpense ||
            this.benefitApp.childClaimForAttendantCareExpense;
    }

    checkSelfDisabilityCredit(evt: any) {
       // console.log(evt);
        this.benefitApp.applicantEligibleForDisabilityCredit = evt;
        this.dataService.saveBenefitApplication();
    }

    applicantClaimDataChange(evt: boolean) {
        if (evt && this.benefitApp.applicantEligibleForDisabilityCredit !== true) {
            this.benefitApp.applicantClaimForAttendantCareExpense = evt;
            this.dataService.saveBenefitApplication();
        } else {
            this.isDisabled = true;
        }
    }

    toggleClaimForSelfDisabilityCredit(evt: Event): void {
        this.benefitApp.applicantEligibleForDisabilityCredit = !this.benefitApp.applicantEligibleForDisabilityCredit;

        if (
            this.benefitApp.applicantEligibleForDisabilityCredit === true &&
            this.showNursingError
        ) {
            this.showNursingError = false;
         }

        if (
            this.benefitApp.applicantClaimForAttendantCareExpense === true &&
            this.benefitApp.applicantEligibleForDisabilityCredit === true
        ) {
            evt.preventDefault();
            this.showNursingError = true;
        }

         this.dataService.saveBenefitApplication();
     }

     applicantClaimForAttendantCare(claimMade: boolean) {
        if (claimMade && this.benefitApp.applicantEligibleForDisabilityCredit) {
            this.showDisabilityError = true;

            this.claimCategory = this.CREDIT_CLAIM_CATEGORY.DISABILITY;
            this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY.ATTENDANT_CARE;
            this.claimant = this.CREDIT_CLAIMANT.APPLICANT;
        }else{
            this.showDisabilityError = false;
            this.benefitApp.applicantClaimForAttendantCareExpense = claimMade;
            this.benefitApp.applicantAttendantCareExpense = claimMade
                ? ATTENDANT_CARE_CLAIM_AMT
                : 0;
        }

        this.dataService.saveBenefitApplication();
    }

    spouseClaimForAttendantCare(claimMade: boolean){
        if (
            claimMade &&
            this.benefitApp.spouseEligibleForDisabilityCredit
        ) {
            this.claimCategory = this.CREDIT_CLAIM_CATEGORY.ATTENDANT_CARE;
            this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY.DISABILITY;
            this.claimant = this.CREDIT_CLAIMANT.SPOUSE;
        } else {
            this.benefitApp.spouseClaimForAttendantCareExpense = claimMade;
            this.showDisabilityError = false;
            this.benefitApp.spouseClaimForAttendantCareExpense = claimMade;
            this.benefitApp.spouseAttendantCareExpense = claimMade
                ? ATTENDANT_CARE_CLAIM_AMT
                : 0;
        }

        this.dataService.saveBenefitApplication();
    }

    updateChildren(haveChildren: boolean) {
        this.benefitApp.haveChildrens = haveChildren;

        if (!haveChildren) {
            this.benefitApp.childrenCount = 0;
            this.benefitApp.claimedChildCareExpense_line214 = null;
            this.benefitApp.childClaimForDisabilityCredit = false;
            this.benefitApp.childClaimForAttendantCareExpense = false;
        }

        this.dataService.saveBenefitApplication();
    }

    checkedChildClaimDisabilityCredit(evt: boolean) {
        console.log(this.benefitApp.childDisablityCount);
        this.benefitApp.childClaimForDisabilityCredit = evt;
        if (!evt) {
           this.benefitApp.numberOfChildrenWithDisability = null;
        }
    }

    checkAttendantCareExpenseForChild(claimMade: boolean) {
        this.benefitApp.childClaimForAttendantCareExpense = claimMade;

        if (!claimMade) {
           this.benefitApp.childWithAttendantCareCount = null;
        }
    }

    childClaimForAttendantCareExpense(evt: boolean) {
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
     * Prevent applicant from claiming disability credit
     */
    private preventApplicantDisabilityCreditClaim() {
        this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY.DISABILITY;
        this.claimCategory = this.CREDIT_CLAIM_CATEGORY.ATTENDANT_CARE;
        this.claimant = this.CREDIT_CLAIMANT.APPLICANT;
    }

    /**
     * Prevent spouse from claiming disability credit
     */
    private preventSpouseDisabilityCreditClaim(){
        this.counterClaimCategory = this.CREDIT_CLAIM_CATEGORY.ATTENDANT_CARE;
        this.claimCategory = this.CREDIT_CLAIM_CATEGORY.DISABILITY;
        this.claimant = this.CREDIT_CLAIMANT.SPOUSE;
    }

    // @todo Remove this? Appears to be unused
    switchClaim(...args: string[]){
        //for self
        if (args[0] === this.CREDIT_CLAIMANT.APPLICANT) {
            if (args[2] === this.CREDIT_CLAIM_CATEGORY.DISABILITY) {
                // The counter claim is disability credit, now user has opted to switch to
                // apply for nursing home expense
                this.benefitApp.applicantClaimForAttendantCareExpense = true;
                this.benefitApp.selfDisabilityCredit = false;

            } else if (args[2] === this.CREDIT_CLAIM_CATEGORY.ATTENDANT_CARE) {
                // apply disability credit
                this.benefitApp.applicantClaimForAttendantCareExpense = false;
                //this.benefitApp.selfDisabilityCredit = true;
            }
        } else if (args[0] === this.CREDIT_CLAIMANT.SPOUSE) {
            // for spouse
            if (args[2] === this.CREDIT_CLAIM_CATEGORY.DISABILITY) {
                // apply disability credit
                this.benefitApp.spouseClaimForAttendantCareExpense = true;
                this.benefitApp.spouseEligibleForDisabilityCredit = false;
            } else if (args[2] === this.CREDIT_CLAIM_CATEGORY.ATTENDANT_CARE) {
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

    /*selectNursingOrDisabilityError(): boolean {
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

        return false;

        // let error =  this.lang('./en/index.js').selectNursingHomeOrDisabilityError.replace('{program}', currentSelectedProgram);
        // error = this.lang('./en/index.js').selectNursingHomeOrDisabilityError.replace('{otherProgram}', otherProgram);
        // return error;
    }*/

    get getSpouseFinanialInfoSectionTitle(){
        if (!!this.benefitApp.taxYear){
            return this
                .lang('./en/index.js')
                .whatIsYourSpouseOrPartnerIncome
                .replace(
                    '{userSelectedMostRecentTaxYear}',
                    this.benefitApp.taxYear
                );
        }else{
            return this.lang('./en/index.js').whatIsYourSpouseOrPartnerIncome;
        }
    }

    get getDisablityCreditTitle() {
        return this
            .lang('./en/index.js')
            .didAnyoneClaimDisabilityTaxCreditLastYear
            .replace(
                '{userSelectedMostRecentTaxYear}',
                this.benefitApp.taxYear
            );
    }

    updateDisabilityCredit(evt: boolean){
        if (!evt) {
            this.benefitApp.applicantEligibleForDisabilityCredit = false;
            this.benefitApp.spouseEligibleForDisabilityCredit = false;
            this.benefitApp.childClaimForDisabilityCredit = false;
            this.benefitApp.childWithDisabilityCount = 0;
        }

        this.benefitApp.selfDisabilityCredit = evt;
        this.dataService.saveBenefitApplication();
    }
    updateRegisteredDisabilityPlan(evt: boolean) {
        if (!evt) {
            this.benefitApp.spouseDSPAmount_line125 = null;
        }

        this.benefitApp.hasRegisteredDisabilityPlan = evt;
        this.dataService.saveBenefitApplication();
    }

    updateNursingHomeExpense(evt: boolean) {
        if (!evt) {
            this.benefitApp.applicantClaimForAttendantCareExpense = evt;
            this.benefitApp.spouseClaimForAttendantCareExpense = evt;
            this.benefitApp.childClaimForAttendantCareExpense = evt;
            this.benefitApp.childClaimForAttendantCareExpenseCount = 0;
            this.benefitApp.attendantCareExpenseReceipts = [] ;
        }

        this.benefitApp.hasClaimedAttendantCareExpenses = evt;
        this.dataService.saveBenefitApplication();
    }

    get didAnyoneClaimAttendantCareLastYear() {
        return this
            .lang('./en/index.js')
            .didAnyoneClaimAttendantCareLastYear
            .replace(
                '{userSelectedMostRecentTaxYear}',
                this.benefitApp.taxYear
            );
    }

    onTaxYearUpdate(taxYear: number){
        this.benefitApp.taxYear = taxYear;

        if (
            this.benefitApp.applicant.assistYearDocs &&
            this.benefitApp.applicant.assistYearDocs.length > 0
        ) {
            this.benefitApp.applicant.assistYearDocs = [];
        }

        if (
            this.benefitApp.spouse.assistYearDocs &&
            this.benefitApp.spouse.assistYearDocs.length > 0
        ) {
            this.benefitApp.spouse.assistYearDocs = [];
        }

        this.dataService.saveBenefitApplication();
    }

    onTaxYearInfoMissing(){
        this.taxYearInfoMissing = true;
    }

}
