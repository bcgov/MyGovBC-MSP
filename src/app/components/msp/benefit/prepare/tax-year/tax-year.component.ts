import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StatusInCanada, StatusRules} from '../../../model/status-activities-documents';
import * as moment from 'moment';
import {BaseComponent} from '../../../common/base.component';
import {Person} from '../../../model/person.model';
import {AssistanceYear} from '../../../model/assistance-year.model';
import {BenefitApplication} from '../../../model/benefit-application.model';
import {MspDataService} from '../../../service/msp-data.service';
import {MspBenefitDataService} from '../../../service/msp-benefit-data.service';
import {ISpaEnvResponse} from '../../../model/spa-env-response.interface';

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
    @Input() spaEnvResponse: ISpaEnvResponse;
    @Output() onTaxYearChange: EventEmitter<number> = new EventEmitter<number>();
    today: any; 
    cutOffStartDate: any;
    cutOffEndDate: any;


    constructor(cd: ChangeDetectorRef, public dataService: MspBenefitDataService) {
        super(cd);
    }

    ngOnInit() {
        this.taxYears = this.getTaxYears ();
    }
    setTaxYear(value: number) {
        this.onTaxYearChange.emit(value);
    }
    getTaxYears(): number[] {
        const currentTaxYear = moment().year() ;
        return [currentTaxYear, currentTaxYear - 1 ];
    }
    get benefitApp(): BenefitApplication{
        return this.dataService.benefitApp;
    }


    isValid(): boolean {
        return !!this.currentTaxYear ;
    }

    get assistanceYearsList(): AssistanceYear[] {
        
        return this.benefitApp.assistYears = this.getTaxYears().reduce(
            (tally, yearNum) => {
                const assistYear: AssistanceYear = new AssistanceYear();
                assistYear.apply = false;
                assistYear.year = yearNum;
                assistYear.docsRequired = true;
                assistYear.currentYear = this.benefitApp.MostRecentTaxYear;
                this.cutOffDate();

                // checking the cutoff Date and disabling the last year
                if(this.cutOffStartDate && moment(this.cutOffStartDate).isSameOrBefore(this.today) && assistYear.year == this.benefitApp.MostRecentTaxYear - 1 && moment(this.cutOffEndDate).isSameOrAfter(this.today)) {
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
    }

    // Gets the cutoff date time frame from SPA-ENV server  
    cutOffDate() {
        if(this.spaEnvResponse && this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START && this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_END && this.spaEnvResponse.SPA_ENV_NOW) {
            this.today = this.spaEnvResponse.SPA_ENV_NOW;
            this.cutOffStartDate = this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START;
            this.cutOffEndDate  = this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_END;
        }
       
    }

}
