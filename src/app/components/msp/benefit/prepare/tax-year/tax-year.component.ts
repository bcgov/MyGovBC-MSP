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

    constructor(cd: ChangeDetectorRef, public dataService: MspBenefitDataService) {
        super(cd);
    }

    ngOnInit() {
        this.today = moment();
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
                //console.log('cutoffDate'+this.cutOffDate().toDate()) ;
                //console.log('today  '+this.today.toDate());

                // checking the cutoff Date and disabling the last year
                if(this.cutOffDate() && this.cutOffDate().isSameOrBefore(this.today) && assistYear.year == this.benefitApp.MostRecentTaxYear - 1) {
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

    // Calculates the cutoff date  
    cutOffDate() {
        if(this.spaEnvResponse && this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START) {
            console.log(this.spaEnvResponse);
            //this.suppBenefitCutOffDate = '2019-11-01';
            const myDate = moment(this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START, 'YYYY-MM-DD HH:mm:ss').toDate();
            console.log('*******'+myDate.getUTCMonth()+'====='+myDate.getUTCDate());
           // let dateString = this.suppBenefitCutOffDate; 
           // let newDate1 = new Date(dateString);
           // console.log(this.suppBenefitCutOffDate);
            console.log(myDate);
            return moment({
              year: myDate.getFullYear(),
              month: myDate.getUTCMonth() + 1 , //this.spaEnvMonth - 1 , // moment use 0 index for month, so adding - 1 to get the correct month:(
              day: myDate.getUTCDate() //this.spanEnvDay,
            }).utc();

        } else {return ;}
       
    }

}
