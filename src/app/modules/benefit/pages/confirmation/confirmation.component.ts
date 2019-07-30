import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import {BaseComponent} from '../../../../models/base.component';
import {Subscription} from 'rxjs';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {ActivatedRoute} from '@angular/router';
import {BenefitApplication} from '../../models/benefit-application.model';
import * as moment from 'moment';

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
                console.log('****CutOf year***');
                this.noticeOfAssessment =  this.lang('./en/index.js').noticeOfAssessmentCutOffyear;

            } else {
                console.log('****non CutOf year***');
                this.noticeOfAssessment = this.lang('./en/index.js').noticeOfAssessmentNonCutOffyear;

            }
        } else if (this.isCutOff === false) {
            console.log('****No CutOff Date***');
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
        return moment().format('MMMM DD, YYYY');
    }

    // Logic to get the cutoff Date text
   /* get noticeOfAssessment() {
        


    }*/
}
