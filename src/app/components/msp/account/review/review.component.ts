import {Component, Inject, ViewChild, ElementRef, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRouteSnapshot, Router} from '@angular/router';

import {MspApplication} from "../../model/application.model";
import {MspAccountApp} from '../../model/account.model';
import {MspDataService} from '../../service/msp-data.service';
import {Gender, Person} from "../../model/person.model";
import {StatusInCanada, Activities, Relationship} from "../../model/status-activities-documents";
import {ProcessService, ProcessUrls} from "../../service/process.service";
import {environment} from '../../../../../environments/environment';
import { MspLogService } from '../../service/log.service';

@Component({
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class AccountReviewComponent implements OnInit {
    lang = require('./i18n');

    mspAccountApp: MspAccountApp;
    captchaApiBaseUrl: string;
    @ViewChild(NgForm) form: NgForm;

    constructor(private dataService: MspDataService,
                private _router: Router,
                private processService: ProcessService,
                private logService: MspLogService) {
        this.mspAccountApp = dataService.getMspAccountApp();
        this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
    }

    // unused.. logic changed
    get spousesForAuthorisation(): Person[] {
        return [this.mspAccountApp.addedSpouse, this.mspAccountApp.updatedSpouse].filter(spouse => !!spouse);
    }

    get accountPIUrl() {
        return ProcessUrls.ACCOUNT_PERSONAL_INFO_URL;
    }

    get accountDependentUrl() {
        return ProcessUrls.ACCOUNT_DEPENDENTS_URL;
    }


    get spouseForAuthorisation(): Person {
        if (this.mspAccountApp.accountChangeOptions.dependentChange && this.mspAccountApp.addedSpouse) {
            return this.mspAccountApp.addedSpouse;
        }
        if ((this.mspAccountApp.accountChangeOptions.personInfoUpdate || this.mspAccountApp.accountChangeOptions.statusUpdate ) && this.mspAccountApp.updatedSpouse) {
            return this.mspAccountApp.updatedSpouse;
        }
        return undefined;
    }


    get questionApplicant() {
        return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.applicantName);
    }

    get applicantName() {
        return this.mspAccountApp.applicant.firstName + ' ' + this.mspAccountApp.applicant.lastName;
    }


    ngOnInit() {
      /*  let oldUUID = this.mspAccountApp.uuid;
        this.mspAccountApp.regenUUID();
        this.dataService.saveMspAccountApp();
        console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspAccountApp().uuid);
*/
    }

    applicantAuthorizeOnChange(event: boolean) {
        this.mspAccountApp.authorizedByApplicant = event;
        if (this.mspAccountApp.authorizedByApplicant) {
            this.mspAccountApp.authorizedByApplicantDate = new Date();
        }
        this.dataService.saveMspAccountApp()
    }


    spouseUpdateAuthorizeOnChange(event: boolean) {
        this.mspAccountApp.authorizedBySpouse = event;
        this.dataService.saveMspAccountApp();
    }

    questionSpouse() {
        return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.spouseName());
    }

    spouseName() {
        return this.spouseForAuthorisation.firstName + ' ' + this.spouseForAuthorisation.lastName;
    }

    handleFormSubmission(evt: any) {

        if (this.mspAccountApp.hasValidAuthToken) {
            console.log('Found valid auth token, transfer to sending screen.');
            this.processService.setStep(this.processService.getStepNumber(ProcessUrls.ACCOUNT_REVIEW_URL), true);
            //  this.logService.log({name: "Account - Review Page after CAPTCHA"},"Account - Captcha Success")
            this._router.navigate(['/msp/account/sending']);
        } else {
            console.log('Auth token is not valid');
        }
    }


}
