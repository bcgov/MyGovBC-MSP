import { Component, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {ActivatedRoute} from '@angular/router';
import {BenefitApplication} from '../../models/benefit-application.model';
import { format } from 'date-fns';

@Component({
  selector: 'msp-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class BenefitConfirmationComponent implements OnDestroy {

    lang = require('./i18n');
    confirmationNum: string;
    subscription: Subscription;
    noticeOfAssessment: string;
    isCutOff: boolean;
    isCutOffYear: boolean;

    constructor(private route: ActivatedRoute, public dataService: MspBenefitDataService) {

    }

    ngOnInit(): void {
        this.subscription = this.route.queryParams.subscribe(
            params => {
                this.confirmationNum = params['confirmationNum'];
                this.isCutOff = params['isCutOff'];
                this.isCutOffYear = params['isCutOffyear'];
            }
        );
        console.log(this.isCutOff);
        console.log(this.isCutOffYear);

        if (this.isCutOff) {
            if (this.isCutOffYear === true) {
                this.noticeOfAssessment =  this.lang('./en/index.js').noticeOfAssessmentCutOffyear;

            } else {
                this.noticeOfAssessment = this.lang('./en/index.js').noticeOfAssessmentNonCutOffyear;

            }
        } else if (this.isCutOff === false) {
            this.noticeOfAssessment = this.lang('./en/index.js').noticeOfAssessment;
        }
    }

    ngAfterViewChecked(){
        //this.dataService.removeMspBenefitApp();
    }

    get benefitApp(): BenefitApplication {
        return this.dataService.benefitApp;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Today's date
     * @returns {string}
     */
    get dateStamp(): string {
        return format(new Date(), 'MMMM dd, yyyy');
    }

    // Logic to get the cutoff Date text
   /* get noticeOfAssessment() {
        


    }*/
}
