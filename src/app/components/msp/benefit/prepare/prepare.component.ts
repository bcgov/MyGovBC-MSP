import {AfterViewInit, ChangeDetectorRef, Component, DoCheck, OnInit} from '@angular/core';
import {BaseComponent} from '../../common/base.component';
import {MspDataService} from '../../service/msp-data.service';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';
import {BenefitApplication} from '../../model/benefit-application.model';
import {MspBenefitDataService} from '../../service/msp-benefit-data.service';


@Component({
    selector: 'msp-prepare',
    templateUrl: './prepare.component.html',
    styleUrls: ['./prepare.component.scss']
})
export class BenefitPrepareComponent extends BaseComponent implements AfterViewInit, OnInit, DoCheck {

    constructor( private cd: ChangeDetectorRef , public benefitDataService: MspBenefitDataService) {
        super(cd);
    }

    lang = require('./i18n');

    ngOnInit() {
    }

    ngAfterViewInit() {

    }

    get getFinanialInfoSectionTitle() {
        return this.lang('./en/index.js').checkEligibilityScreenTitle.replace('{userSelectedMostRecentTaxYear}',
            this.benefitApp.currentYear);
    }

    get benefitApp(): BenefitApplication{
        return this.benefitDataService.benefitApp;
    }

}
