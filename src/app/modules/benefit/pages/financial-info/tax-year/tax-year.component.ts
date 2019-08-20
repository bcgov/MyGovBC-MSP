import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {BaseComponent} from '../../../../../models/base.component';
import {AssistanceYear} from '../../../../assistance/models/assistance-year.model';
import {BenefitApplication} from '../../../models/benefit-application.model';
import {MspBenefitDataService} from '../../../services/msp-benefit-data.service';
import {ISpaEnvResponse} from '../../../../../components/msp/model/spa-env-response.interface';
import { parseDate } from 'ngx-bootstrap/chronos';

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
    @Input() currentTaxYear: number;
    assistanceYears: AssistanceYear[];
    currentYear: number;  // = this.benefitApp.taxYear;
    @Input() spaEnvResponse: ISpaEnvResponse;
    @Output() onTaxYearChange: EventEmitter<number> = new EventEmitter<number>();
    today: Date;
    cutOffStartDate: Date;
    cutOffEndDate: Date;
    cutOffYear: number;


    constructor(cd: ChangeDetectorRef, public dataService: MspBenefitDataService) {
        super(cd);
    }

    ngOnInit() {
        this.cutOffDate();
        this.taxYears = this.getTaxYears();
        this.assistanceYears = this.assistanceYearsList();
    }

    setTaxYear(value: number) {
        this.currentYear = value;
        this.onTaxYearChange.emit(value);
    }

    getTaxYears(): number[] {
        const currentTaxYear = this.currentYear ;
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
                assistYear.currentYear = this.currentYear;

                // checking the cutoff Date and displaying the message
                if (this.cutOffStartDate && moment(this.cutOffStartDate).isSameOrBefore(this.today) && (assistYear.year === this.benefitApp.MostRecentTaxYear - 1) && moment(this.cutOffEndDate).isSameOrAfter(this.today)) {
                    console.log('Cut off date year ' + assistYear.year);
                    this.cutOffYear = assistYear.year;
                    this.dataService.benefitApp.cutoffYear = assistYear.year;
                    this.dataService.benefitApp.isCutoffDate = true;

                    //  (assistYear.year == this.benefitApp.MostRecentTaxYear - 1) ? true : false;
                } else {

                    this.dataService.benefitApp.isCutoffDate = false;
                }


                if (yearNum === this.benefitApp.MostRecentTaxYear){
                    assistYear.docsRequired = false;
                }
                //console.log(assistYear);
                tally.push(assistYear);

                return tally;
            }, []);

           //return [{docsRequired: false, apply:false, year:2019, currentYear:2019, disabled: false}, {docsRequired: false, apply:false, year:2018, currentYear:2018, disabled: false}]
    }

    // Gets the cutoff date time frame from SPA-ENV server
    cutOffDate() {
        if (this.spaEnvResponse && this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START && this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_END && this.spaEnvResponse.SPA_ENV_NOW) {
            this.today = new Date(this.spaEnvResponse.SPA_ENV_NOW.replace(/-/g, '/'));
            this.currentYear = this.today.getFullYear();
            //console.log(this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START);
            //const mydate1 = this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START;
            //const mydate = moment(mydate1).format();       // new Date(String(this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START));
           // var str = mydate1;
           // str = str.replace(/-/g,'/');  // replaces all occurances of "-" with "/"
          //  var dateObject = new Date(str);
          //  console.log(dateObject);
            //this.today = moment().toDate();
            let startDate = new Date (this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_START.replace(/-/g, '/'));
            let endDate = new Date(this.spaEnvResponse.SPA_ENV_PACUTOFF_MAINTENANCE_END.replace(/-/g, '/'));
            this.cutOffStartDate = new Date(this.currentYear, startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds());
            this.cutOffEndDate  = new Date(this.currentYear, endDate.getMonth(), endDate.getDate(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds());
            console.log('CutOff Start Date', this.cutOffStartDate);
            console.log('CutOff End Date', this.cutOffEndDate);

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
