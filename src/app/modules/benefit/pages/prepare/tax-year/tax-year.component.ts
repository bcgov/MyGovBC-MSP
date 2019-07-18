import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {BaseComponent} from '../../../../../models/base.component';
import {AssistanceYear} from '../../../../assistance/models/assistance-year.model';
import {BenefitApplication} from '../../../models/benefit-application.model';
import {MspBenefitDataService} from '../../../services/msp-benefit-data.service';
import {ISpaEnvResponse} from '../../../../../components/msp/model/spa-env-response.interface';

@Component({
    selector: 'msp-tax-year',
    templateUrl: './tax-year.component.html',
    styleUrls: ['./tax-year.component.scss']
})
/**
 * this is a component to support current year or previous tax year.
 * This component has to grow and fetch the tax year either from RAPID OR some other mechanism.
 *
 */
export class TaxYearComponent extends BaseComponent {

    lang = require('./i18n');
    taxYears: number[] ;
    @Input() currentTaxYear: boolean;
    assistanceYears: AssistanceYear[];
    currentYear: number;  // = this.benefitApp.taxYear;
    @Input() spaEnvResponse: ISpaEnvResponse;
    @Output() onTaxYearChange: EventEmitter<number> = new EventEmitter<number>();
    today: Date;
    cutOffStartDate: Date;
    cutOffEndDate: Date;


    constructor(cd: ChangeDetectorRef, public dataService: MspBenefitDataService) {
        super(cd);
    }

    ngOnInit() {
        this.taxYears = this.getTaxYears();
        this.assistanceYears = this.assistanceYearsList();
    }

    setTaxYear(value: number) {
        this.currentYear = value;
        this.onTaxYearChange.emit(value);
    }

    getTaxYears(): number[] {
        const currentTaxYear = moment().year() ;
        return [currentTaxYear, currentTaxYear - 1 ];
    }

    get benefitApp(): BenefitApplication{
        return this.dataService.benefitApp;
    }


   /* isValid(): boolean {
        return !!this.currentTaxYear ;
    }*/

    assistanceYearsList(): AssistanceYear[] {

        return this.benefitApp.assistYears = this.getTaxYears().reduce(
            (tally, yearNum) => {
                const assistYear: AssistanceYear = new AssistanceYear();
                assistYear.apply = false;
                assistYear.year = yearNum;
                assistYear.docsRequired = true;
                assistYear.currentYear = this.benefitApp.MostRecentTaxYear;
                // this.cutOffDate();

                // checking the cutoff Date and disabling the last year
                // console.log('momment date?', this.cutOffStartDate);
                if (this.cutOffStartDate && moment(this.cutOffStartDate).isSameOrBefore(this.today) && assistYear.year === this.benefitApp.MostRecentTaxYear - 1 && moment(this.cutOffEndDate).isSameOrAfter(this.today)) {
                    assistYear.disabled =  true; //  (assistYear.year == this.benefitApp.MostRecentTaxYear - 1) ? true : false;
                } else {
                    assistYear.disabled =  false;
                }

                if (yearNum === this.benefitApp.MostRecentTaxYear){
                    assistYear.docsRequired = false;
                }
                tally.push(assistYear);

                return tally;
            }, []);

           //return [{docsRequired: false, apply:false, year:2019, currentYear:2019, disabled: false}, {docsRequired: false, apply:false, year:2018, currentYear:2018, disabled: false}]
    }

    // Gets the cutoff date time frame from SPA-ENV server
    cutOffDate() {
        if (this.spaEnvResponse && this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START && this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_END && this.spaEnvResponse.SPA_ENV_NOW) {
            this.today = new Date(this.spaEnvResponse.SPA_ENV_NOW);
            this.cutOffStartDate = new Date(this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START);
            this.cutOffEndDate  = new Date(this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_END);
            // console.log('cutoffDate ran', {
            //     SPA_ENV_NOW: this.spaEnvResponse.SPA_ENV_NOW,
            //     SPA_ENV_PACUTOFF_MAINTENANCE_START: this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START,
            //     SPA_ENV_PACUTOFF_MAINTENANCE_END: this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_END,
            //     today: this.today,
            //     cutOffStartDate: this.cutOffStartDate,
            //     cutOffEndDate: this.cutOffEndDate
            // })
        }

    }

}
