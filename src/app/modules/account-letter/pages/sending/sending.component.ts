import {Component, Injectable, AfterContentInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MspDataService} from '../../../../services/msp-data.service';
import {MspACLService} from '../../services/msp-acl-api.service';
import {Router} from '@angular/router';
import {MspLogService} from '../../../../services/log.service';
import {ProcessService} from '../../../../services/process.service';
import {AccountLetterApplication} from '../../../../components/msp/model/account-letter-application.model';
import {ACLApiResponse} from '../../../../components/msp/model/account-letter-response.interface';


@Component({
    templateUrl: 'sending.component.html',
    styleUrls: ['./sending.component.scss']
})

@Injectable()
export class AccountLetterSendingComponent implements AfterContentInit {
    lang = require('./i18n');

    application: AccountLetterApplication;
  //  public rawError: string;
    rawRequest: string;
    transmissionInProcess: boolean;
    hasError: boolean;
    aclApiResponse: ACLApiResponse;


    constructor(private aclService: MspACLService, private dataService: MspDataService, public router: Router, private logService: MspLogService) {
        this.application = this.dataService.accountLetterApp;
        this.transmissionInProcess = undefined;
        this.hasError = undefined;
    }

    /**
     * always regnerate uuid for application and its images
     * When user use browser back button, the uuid are guaranteed to be unique for API server.
     */
    ngAfterContentInit() {
        this.transmitApplication();
    }

    transmitApplication() {
        // After view inits, begin sending the application
        this.transmissionInProcess = true;
        this.hasError = undefined;
        this.logService.log({name: 'ACL application submitting request'}, "ACL : Submission Request");
        console.log(this.application);
        this.aclService
            .sendAccountLetterApp(this.application, this.application.uuid)
            .subscribe(response => {
                if (response instanceof HttpErrorResponse) { // probable network errors..middleware could be down
                    this.processErrorResponse(response, false);
                    this.logService.log({
                        name: 'ACL - System Error',
                        confirmationNumber: this.application.uuid
                    }, 'ACL - Submission Response Error' + response.message);

                    return;
                }
                // business errors.. Might be either a RAPID validation failure or DB error
                this.aclApiResponse = <ACLApiResponse> response;
                if (this.isFailure(this.aclApiResponse)) {
                    this.processErrorResponse(response, true);
                    this.logService.log({
                        name: 'ACL - RAPID/DB Error',
                        confirmationNumber: this.application.uuid
                    }, 'ACL - Submission Response Error' + JSON.stringify(this.aclApiResponse));

                    return;
                } else {
                    //delete the application from storage
                    this.dataService.removeMspAccountLetterApp();
                    const refNumber = this.aclApiResponse.referenceNumber;
                    this.logService.log({
                        name: 'ACL - Received refNo ',
                        confirmationNumber: refNumber
                    }, 'ACL - Submission Response Success');
                    this.router.navigate(['/msp/account-letter/confirmation'],
                        {queryParams: {confirmationNum: refNumber}});
                }
            });
    }

    retrySubmission() {
        this.router.navigate(['/msp/account-letter/personal-info']);
    }

    // if there is a RAPID_ERROD code , show the spinner till SPA_ENV server reponse is fetched
    stopProcessing() {
        this.transmissionInProcess = false;
    }

    processErrorResponse(response: HttpErrorResponse, transmissionInProcess: boolean) {
        console.log('Error Response :' + response);
       // this.rawError = (errorMessage != null && errorMessage != 'undefined') ? errorMessage : undefined;
        this.hasError = true;
        this.transmissionInProcess = transmissionInProcess;
        const oldUUID = this.application.uuid;
        this.application.regenUUID();
        console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspApplication().uuid);
        this.application.authorizationToken = null;
        this.dataService.saveAccountLetterApplication();

    }
    /*
    Handle all the failure conditions here
     */
    isFailure(aCLApiResponse: ACLApiResponse):boolean {
        // has a reference number , is DB error code Y , is RAPID response Y then its not a failure
        if (aCLApiResponse.referenceNumber && aCLApiResponse.dberrorCode ==='Y'  && aCLApiResponse.rapidResponse ==='Y' ) {
            return false;
        }

        return true;
    }
}
