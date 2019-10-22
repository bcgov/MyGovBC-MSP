import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AbstractHttpService } from 'moh-common-lib';
import { throwError } from 'rxjs';
import * as moment from 'moment';
import {MspDataService} from './msp-data.service';
import { Router } from '@angular/router';
import { MspBenefitDataService } from '../modules/benefit/services/msp-benefit-data.service';
import { EnrolDataService } from '../modules/enrolment/services/enrol-data.service';
import { APP_ROUTES } from '../models/route-constants';


@Injectable({
    providedIn: 'root'
})

// TODO: Replace with logService from common-lib
export class MspLog2Service extends AbstractHttpService {
    /**
     * The headers that are consistent across all requests (i.e. they do not
     * change between log() and logError()). These values are set once at session
     * start.
     *
     * @protected
     * @type {HttpHeaders}
     * @memberof Log2Service
     */
    protected _headers: HttpHeaders = new HttpHeaders({
        applicationId: this.getApplicationId(),
        referenceNumber: this.enrolDataService.application.referenceNumber ||
                         this.benefitDataService.benefitApp.referenceNumber ||
                         this.dataService.finAssistApp.referenceNumber ||
                         this.dataService.getMspAccountApp().referenceNumber ||
                         'n/a',
        logsource: window.location.hostname,
        http_x_forwarded_host: window.location.hostname,
        timestamp: moment().toISOString(),
        program: 'msp',
        request_method: 'POST',
    });

    /**
     * Constructor with injected dataService and Router
     * @param {HttpClient} http
     * @param {MspDataService} dataService
     * @param {Router} router
     */
    constructor(protected http: HttpClient,
                private dataService: MspDataService,
                private router: Router,
                private benefitDataService: MspBenefitDataService,
                private enrolDataService: EnrolDataService) {
        super(http);
    }

    /**
     * Log a message to Splunk. This is the main way to send logs and
     * automatically includes meta-data. You do **not** need to subscribe to the
     * response, as the service already does that. The input object must have an
     * 'event' property set, everything else is optional.
     *
     * Example:
     * ```
     this.logService.log({
       event: 'submission',
       dateObj: new Date()
    });
     ```
     * @param message A JavaScript object, nesting is fine, with `event` property
     * set.
     */
    public log(message: LogMessage) {
        this.setSeverity(SeverityLevels.INFO);
        return this._sendLog(message);
    }

    public logError(errorMessage: LogMessage){
        this.setSeverity(SeverityLevels.ERROR);
        return this._sendLog(errorMessage);
    }

    /**
     * Log HTTP errors, e.g. when losing network connectivity or receiving an
     * error response code.
     */
    public logHttpError(error: HttpErrorResponse) {
        return this.logError({
            event: 'error',
            message: error.message,
            errorName: error.name,
            statusText: error.statusText
        });
    }

    /**
     * Internal method to send logs to Splunk, includes meta-data except that's
     * consistent across all requests, but not specific values like severity
     * level.
     *
     * @param message A JavaScript object or anything that can be toString()'d,
     * like Date
     */
    private _sendLog(message: LogMessage){
        // Update headers
        this.setTimestamp();
        this.setTags(message);

        // Configure request
        const url = environment.appConstants.logBaseUrl;
        const body = { message: message };

        if (environment.logHTTPRequestsToConsole){
            console.log('Log Message', message);
        }

        if (environment.appConstants.enableLogging){
            // We call .subscribe() here because we don't care about the response and
            // we want to ensure that we never forget to call subscribe.
            return this.post(url, body).subscribe();
        }
    }

    protected handleError(error: HttpErrorResponse) {
        console.log('logService handleError()', error);
        if (error.error instanceof ErrorEvent) {
            //Client-side / network error occured
            console.error('An error occured: ', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code
            console.error(`Backend returned error code: ${error.status}.  Error body: ${error.error}`);
        }

        return throwError(error);
    }

    /**
     * Overwrite the inherited httpOptions so we can set responseType to text.
     * This updates Angular's parsing, and it won't error out due to the server
     * not responding with JSON.
     */
    protected get httpOptions(): any {
        return {
            headers: this._headers,
            responseType: 'text'
        };
    }

    private setTimestamp(){
        this._headers = this._headers.set('timestamp', moment().toISOString());
    }

    private setSeverity(severity: SeverityLevels){
        this._headers = this._headers.set('severity', severity);
    }

    /**
     * The headers are easier to search in splunk, and we aren't using tags, so
     * repurpose it to event type.
     */
    private setTags(message: LogMessage){
        this._headers = this._headers.set('tags', message.event);
    }

    /**
     * get the application id from the router location
     * @returns {string}
     */
    getApplicationId(): string {
        console.log(this.router.url);
        if (this.router.url.indexOf('/' + APP_ROUTES.ENROLMENT + '/') !== -1){
            return  this.enrolDataService.application.uuid;
        }
        if (this.router.url.indexOf('/' + APP_ROUTES.ASSISTANCE + '/') !== -1){
            return  this.dataService.finAssistApp.uuid ;
        }
        if (this.router.url.indexOf('/' + APP_ROUTES.ACCOUNT + '/') !== -1){
            return  this.dataService.getMspAccountApp().uuid;
        }
        if (this.router.url.indexOf('/' + APP_ROUTES.BENEFIT + '/') !== -1){
          return  this.benefitDataService.benefitApp.uuid ;
        }
    }
}


enum SeverityLevels {
    INFO = 'info',
    ERROR = 'error',
}

interface LogMessage {
    /** The type of event being logged. `eligibilityCheck` is standalone because it is neither a submission nor error. */
    event: 'navigation' | 'error' | 'submission' | 'eligibilityCheck';
    // We allow any other properties/values in the interface
    [key: string]: any;
}
