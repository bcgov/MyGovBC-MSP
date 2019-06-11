import {Component, DoCheck, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MspDataService} from '../../../../../components/msp/service/msp-data.service';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {Eligibility} from '../../../../../components/msp/model/eligibility.model';
import {ProcessService} from '../../../../../components/msp/service/process.service';
import {MspBenefitDataService} from '../../../../../components/msp/service/msp-benefit-data.service';
import {BenefitApplication} from '../../../../../components/msp/model/benefit-application.model';
import * as moment from 'moment';

@Component({
  selector: 'benefit-deduction-calculator',
  templateUrl: './benefit-deduction-calculator.component.html',
  styleUrls: ['./benefit-deduction-calculator.component.scss']
})
export class BenefitDeductionCalculatorComponent implements DoCheck {

    static ProcessStepNum = 0;

    @Input() application: BenefitApplication;
    @Output() updateQualify: EventEmitter<Boolean> = new EventEmitter<Boolean>();
    @Output() taxYearInfoMissing: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    @Input() qualificationThreshhold: number;
    lang = require('./i18n');

    constructor(private _router: Router,
                private dataService: MspBenefitDataService,
                private _processService: ProcessService) {
    }

    ngDoCheck(): void {
        this._processService.setStep(BenefitDeductionCalculatorComponent.ProcessStepNum, this.canContinue);
    }

    get ageOver65Amt(): number {
        return !!this.application.ageOver65 ? 3000 : 0;
    }

    get spouseAmt(): number {
        return !!this.application.hasSpouseOrCommonLaw ? 3000 : 0;
    }

    get spouseAgeOver65Amt(): number {
        return !!this.application.spouseAgeOver65 ? 3000 : 0;
    }

    /**
     * Children amount has been reduced with 50% of child care expense claimed on income tax
     */
    get adjustedChildrenAmt(): number {
        const amt = this.childrenAmt + this.childCareExpense;
        return amt > 0 ? amt : 0;
    }

    get childrenAmt(): number {
        const cnt: number = (!!this.application.childrenCount && this.application.childrenCount > 0) ? this.application.childrenCount : 0;
        const amt = cnt * 3000;
        return amt > 0 ? amt : 0;
    }

    get childCareExpense(): number {
        return !!this.application.claimedChildCareExpense_line214 ? (this.application.claimedChildCareExpense_line214 / 2) * -1 : 0;
    }

    get uCCBenefitAmt(): number {
        return !!this.application.reportedUCCBenefit_line117 ? this.application.reportedUCCBenefit_line117 : 0;
    }

    get disabilityCreditAmt(): number {
        const amt = !!this.application.selfDisabilityCredit ? 3000 : 0;
        this.application.applicantDisabilityCredit = amt;
        return amt;
    }

    get spouseDisabilityCreditAmt(): number {
        const amt = !!this.application.spouseEligibleForDisabilityCredit ? 3000 : 0;
        this.application.spouseDisabilityCredit = amt;
        return amt;
    }

    get childrenDisabilityCreditAmt(): number {
        const m = this.application.childWithDisabilityCount;
        const amt = !!m ? 3000 * m : 0;
        this.application.childrenDisabilityCredit = amt;
        return amt;
    }

    get attendantCareExpenseAmt(): number {
        if (_.isNumber(this.application.attendantCareExpense)
            && this.application.attendantCareExpense < 3000
            && this.application.attendantCareExpense > 0) {
            return this.application.attendantCareExpense;
        } else {
            return 0;
        }
    }

    get childClaimForAttendantCareExpenseAmt(): number {
        if (!!this.application.childClaimForAttendantCareExpense) {
            return this.application.childClaimForAttendantCareExpenseCount * 3000;
        } else {
            return 0;
        }
    }

    get spouseClaimForAttendantCareExpenseAmt(): number {
        if (!!this.application.spouseClaimForAttendantCareExpense) {
            return 3000;
        } else {
            return 0;
        }
    }

    get applicantClaimForAttendantCareExpenseAmt(): number {
        if (!!this.application.applicantClaimForAttendantCareExpense) {
            return 3000;
        } else {
            return 0;
        }
    }

    get familyClaimForAttendantCareExpenseAmt(): number {
        return this.childClaimForAttendantCareExpenseAmt + this.spouseClaimForAttendantCareExpenseAmt
            + this.applicantClaimForAttendantCareExpenseAmt;
    }

    get totalDeductions(): number {
        const total = this.ageOver65Amt
            + this.spouseAmt
            + this.spouseAgeOver65Amt
            + this.adjustedChildrenAmt
            + this.uCCBenefitAmt
            + this.disabilityCreditAmt
            + this.spouseDisabilityCreditAmt
            + this.childrenDisabilityCreditAmt
            + this.application.spouseDSPAmount_line125
            + this.applicantClaimForAttendantCareExpenseAmt
            + this.spouseClaimForAttendantCareExpenseAmt
            + this.childClaimForAttendantCareExpenseAmt;

        this.dataService.saveFinAssistApplication();
        return total;
    }

    get adjustedIncome(): number {
        let adjusted: number = parseFloat(this.totalHouseholdIncome) - this.totalDeductions;
        adjusted < 0 ? adjusted = 0 : adjusted = adjusted;

        this.application.eligibility.adjustedNetIncome = adjusted;
        this.application.eligibility.totalDeductions = this.totalDeductions;

        this.application.eligibility.childDeduction = this.childrenAmt;
        this.application.eligibility.disabilityDeduction = this.childrenDisabilityCreditAmt;
        this.application.eligibility.totalDeductions = this.totalDeductions;
        this.application.eligibility.totalNetIncome = parseFloat(this.totalHouseholdIncome);
        this.application.eligibility.spouseDeduction = this.spouseAmt;
        this.application.eligibility.spouseSixtyFiveDeduction = this.spouseAgeOver65Amt;
        this.application.eligibility.sixtyFiveDeduction = this.ageOver65Amt;

        /**
         * Rule 23 on FDS document
         *
         * IF D0.NUMBER OF CHILDREN = 0
         *  THEN Value = 0
         *  ELSE Value =
         *  D0.CHILD DEDUCTION -
         *  D0.CHILD CARE EXPENSES
         *  IF Value < 0
         *  THEN Value = 0
         */
        this.application.eligibility.deductions = this.adjustedChildrenAmt;

        return adjusted;
    }

    get applicantIncomeInfoProvided() {
        const result = (!!this.application.netIncomelastYear && !isNaN(this.application.netIncomelastYear) && (this.application.netIncomelastYear + '').trim() !== '');
        const stamp = new Date().getTime();
        // console.log( stamp + '- income info number : ' + this.application.netIncomelastYear);
        // console.log(stamp + '- income info provided? : ' + result);
        return result;
    }

    get spouseIncomeInfoProvided() {
        const result = (!!this.application.spouseIncomeLine236 && !isNaN(this.application.spouseIncomeLine236) && (this.application.spouseIncomeLine236 + '').trim() !== '');
        return result;
    }

    get incomeUnderThreshhold() {
        return _.isNumber(this.adjustedIncome) && this.adjustedIncome <= this.qualificationThreshhold;
        // let r = this.adjustedIncome <= this.qualificationThreshhold;
        // return r;
    }

    get canContinue() {
        const spouseSpecified =
            !(this.application.hasSpouseOrCommonLaw === null || this.application.hasSpouseOrCommonLaw === undefined);

        const spouseAgeSpecified = !(this.application.spouseAgeOver65 === null || this.application.spouseAgeOver65 === undefined);
        const applicantAgeSpecified = !(this.application.ageOver65 === null || this.application.ageOver65 === undefined);

        // check the net income with pattern "^[0-9]{1}[0-9]{0,5}(\.[0-9]{1,2})?$"
        const patt = /^[0-9]{1}[0-9]{0,5}(\.[0-9]{1,2}){0,1}$/g;
        let netIncomeValid = false;
        if (this.application.netIncomelastYear === null || this.application.netIncomelastYear === undefined) {
            netIncomeValid = false;
        }
        else {
            const pm = this.application.netIncomelastYear.toString().match(patt);
            if (pm && !(pm === null) && pm[0] && ! (pm[0] === null)) {
                netIncomeValid = this.application.netIncomelastYear.toString() === pm[0];
            }
        }
        // added for DEAM-2 fix Invalid comma in money decimal fields
        const isSpouseIncomeValid = !spouseSpecified || !this.application || !this.application.spouseIncomeLine236 || this.application.spouseIncomeLine236.toString().match(patt);

        if (this.applicantIncomeInfoProvided && applicantAgeSpecified && spouseSpecified && netIncomeValid && isSpouseIncomeValid) {
            if (this.application.hasSpouseOrCommonLaw) {
                return spouseAgeSpecified && this.attendantCareExpenseReceiptsProvided;
            } else {
                return this.attendantCareExpenseReceiptsProvided;
            }
        } else {
            return false;
        }
    }


    navigateToPersonalInfo() {
            this._router.navigate(['/msp/benefit/personal-info']);
    }


    private get attendantCareExpenseReceiptsProvided(): boolean {
        let provided = true;
        if (this.incomeUnderThreshhold && (this.childClaimForAttendantCareExpenseAmt > 0
            || this.applicantClaimForAttendantCareExpenseAmt > 0 || this.spouseClaimForAttendantCareExpenseAmt > 0)) {
            provided = this.application.attendantCareExpenseReceipts.length > 0;
        }

        return provided;
    }

    get isPristine() {
        return (this.application.ageOver65 !== true && this.application.ageOver65 !== false) &&
            (this.application.netIncomelastYear === null || this.application.netIncomelastYear === undefined);
    }

    get personalIncome(): number {
        if (this.application.netIncomelastYear === null) {
            return null;
        }
        const n = (!!this.application.netIncomelastYear &&
            !isNaN(this.application.netIncomelastYear)) ? this.application.netIncomelastYear : 0;
        //console.log("application net income: " + this.application.netIncomelastYear);
        return parseFloat(n + '');
    }

    get spouseIncome(): number {
        const n = this.spouseIncomeInfoProvided ? this.application.spouseIncomeLine236 : 0;
        return parseFloat(n + '');
    }

    get totalHouseholdIncome(): string {
        const t: number = this.personalIncome + this.spouseIncome;
        const total: string = new Number(t).toFixed(2);
        return total;
    }

    get eligibility(): Eligibility {
        return this.application.eligibility;
    }

    get currentCalendarYear(): string {
        if (this.application.taxYear) {
            return this.application.taxYear.toString();
        }    else return '';

    }
    get nextCalendarYear(): Number {
        return moment().year() + 1;
    }

}
