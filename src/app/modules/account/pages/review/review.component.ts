import {Component, ViewChild, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router} from '@angular/router';
import {ProcessUrls} from '../../../../services/process.service';
import {environment} from '../../../../../environments/environment';
import { MspAccountApp } from '../../models/account.model';
import { AbstractForm } from 'moh-common-lib';
import { PageStateService } from 'app/services/page-state.service';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';

@Component({
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class AccountReviewComponent extends AbstractForm implements OnInit {
    lang = require('./i18n');

    mspAccountApp: MspAccountApp;
    captchaApiBaseUrl: string;
    @ViewChild(NgForm) form: NgForm;
    addChildIndex = 0;
    removeChildIndex = 0;
    updateChildIndex = 0;

    constructor(public dataService: MspAccountMaintenanceDataService,
                    protected router: Router,  private pageStateService: PageStateService) {
                    super(router);
        this.mspAccountApp = dataService.getMspAccountApp();
        this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
    }

    ngOnInit() {
        this.pageStateService.setPageIncomplete(this.router.url, this.dataService.accountApp.pageStatus);
    }

    get hasSpouse() {
        return this.mspAccountApp.spouse ? true : false;
    }

    // unused.. logic changed
    get spousesForAuthorisation(): MspPerson[] {
        return [this.mspAccountApp.addedSpouse, this.mspAccountApp.updatedSpouse].filter(spouse => !!spouse);
    }

    get accountPIUrl() {
        return ProcessUrls.ACCOUNT_PERSONAL_INFO_URL;
    }

    get accountSpouseUrl() {
        return ProcessUrls.ACCOUNT_SPOUSE_INFO_URL;
    }

    get accountDependentUrl() {
        return ProcessUrls.ACCOUNT_DEPENDENTS_URL;
    }

    get accountChildInfoUrl() {
        return ProcessUrls.ACCOUNT_CHILD_INFO_URL;
    }

    get accountContactInfoUrl() {
        return ProcessUrls.ACCOUNT_CONTACT_INFO_URL;
    }

    get addChildTitle() {
        this.addChildIndex++;
        return 'Add Child #' + this.addChildIndex + ' Information';
    }

    get removeChildTitle() {
        this.removeChildIndex++;
        return 'Remove Child #' + this.removeChildIndex + ' Information';
    }

    get updateChildTitle() {
        this.updateChildIndex++;
        return 'Update Child #' + this.updateChildIndex + ' Information';
    }

    get spouseForAuthorisation(): MspPerson {
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

    applicantAuthorizeOnChange(event: boolean) {
        this.mspAccountApp.authorizedByApplicant = event;
        if (this.mspAccountApp.authorizedByApplicant) {
            this.mspAccountApp.authorizedByApplicantDate = new Date();
        }
        this.dataService.saveMspAccountApp();
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

    canContinue(): boolean {
        const valid = super.canContinue();
        return valid;
    }

    continue(): void {
        if (!this.canContinue()) {
          console.log('Please fill in all required fields on the form.');
          this.markAllInputsTouched();
          return;
        }
        this.pageStateService.setPageComplete(this.router.url, this.dataService.accountApp.pageStatus);
        this.navigate('/deam/authorize');
      }


}
