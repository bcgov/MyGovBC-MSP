import {Component, ViewChild, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router} from '@angular/router';
import {ProcessUrls} from '../../../../services/process.service';
import {environment} from '../../../../../environments/environment';
import { MspAccountApp } from '../../models/account.model';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { BaseForm } from '../../models/base-form';

@Component({
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class AccountReviewComponent extends BaseForm implements OnInit {
    lang = require('./i18n');

    mspAccountApp: MspAccountApp;
    captchaApiBaseUrl: string;
    @ViewChild(NgForm) form: NgForm;

    constructor(public dataService: MspAccountMaintenanceDataService,
                    protected router: Router,
                    protected containerService: ContainerService,
                    protected pageStateService: PageStateService) {
        super(router, containerService, pageStateService);
        this.mspAccountApp = dataService.getMspAccountApp();
        this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
    }

    ngOnInit() {
        this.pageStateService.setPageIncomplete(this.router.url);
    }


    get hasSpouse() {
        return this.mspAccountApp.spouse ? true : false;
    }

    get getSpouseTitle() {
        if (this.mspAccountApp.hasSpouseAdded){
            return this.lang('./en/index.js').addSpouseTitle;
        }
        else if (this.mspAccountApp.hasSpouseRemoved){
            return this.lang('./en/index.js').removeSpouseTitle;
        }
        else if (this.mspAccountApp.hasSpouseUpdated){
            return this.lang('./en/index.js').updateSpouseTitle;
        }
    }

    get getSpouseInfo() {
        if (this.mspAccountApp.hasSpouseAdded){
            return this.mspAccountApp.addedSpouse;
        }
        else if (this.mspAccountApp.hasSpouseRemoved){
            return this.mspAccountApp.removedSpouse;
        }
        else if (this.mspAccountApp.hasSpouseUpdated){
            return this.mspAccountApp.updatedSpouse;
        }
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
        return 'Add Child Information #';
    }

    get removeChildTitle() {
        return 'Remove Child Information #';
    }

    get updateChildTitle() {
        return 'Update Child Information #';
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

    printPage() {
        window.print();
        return false;
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
        this.navigate('/deam/authorize');
      }


}
