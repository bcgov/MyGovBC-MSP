import {Component, ViewChild, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router} from '@angular/router';
import {MspDataService} from '../../../../services/msp-data.service';
import {ProcessService, ProcessUrls} from '../../../../services/process.service';
import {environment} from '../../../../../environments/environment';
import { MspAccountApp } from '../../models/account.model';
import { PageStateService } from 'app/services/page-state.service';
import { AbstractForm } from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspPerson } from '../../../../../app/components/msp/model/msp-person.model';
@Component({
  selector: 'msp-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent extends AbstractForm implements OnInit {
    

  lang = require('./i18n');

    mspAccountApp: MspAccountApp;
    captchaApiBaseUrl: string;
    @ViewChild(NgForm) form: NgForm;

    constructor(private dataService: MspAccountMaintenanceDataService,
                private _router: Router,
                private pageStateService: PageStateService) {
        super(_router);
        this.mspAccountApp = dataService.getMspAccountApp();
        this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
    }

    // unused.. logic changed
    get spousesForAuthorisation(): MspPerson[] {
        return [this.mspAccountApp.addedSpouse, this.mspAccountApp.updatedSpouse].filter(spouse => !!spouse);
    }

    get accountPIUrl() {
        return ProcessUrls.ACCOUNT_PERSONAL_INFO_URL;
    }

    get accountDependentUrl() {
        return ProcessUrls.ACCOUNT_DEPENDENTS_URL;
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


    ngOnInit() {
        this.pageStateService.setPageIncomplete(this.router.url, this.dataService.accountApp.pageStatus);
   
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

    handleFormSubmission($event) {

      /*  if (this.mspAccountApp.hasValidAuthToken) {
            console.log('Found valid auth token, transfer to sending screen.');
            this.processService.setStep(this.processService.getStepNumber(ProcessUrls.ACCOUNT_REVIEW_URL), true);
            //  this.logService.log({name: "Account - Review Page after CAPTCHA"},"Account - Captcha Success")
            this._router.navigate(['/account/sending']);
        } else {
            console.log('Auth token is not valid');
        }*/
    }

    continue(): void {
        if (!this.canContinue()) {
          console.log('Please fill in all required fields on the form.');
          this.markAllInputsTouched();
          return;
        }
        this.pageStateService.setPageComplete(this.router.url, this.dataService.accountApp.pageStatus);
        this.navigate('/account/sending');
      }


}
