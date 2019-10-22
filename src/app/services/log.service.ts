import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription} from 'rxjs/internal/Subscription';
import { LogEntry } from '../models/log-entry.model';
import { MspDataService } from './msp-data.service';
import { MspBenefitDataService } from '../modules/benefit/services/msp-benefit-data.service';
import { environment } from '../../environments/environment';
import { AclDataService } from '../modules/request-acl/services/acl-data.service';
import { APP_ROUTES } from '../models/route-constants';
import { EnrolDataService } from '../modules/enrolment/services/enrol-data.service';



@Injectable()
export class MspLogService  {
  appConstants;
  constructor(private http: HttpClient,
              private dataService: MspDataService ,
              private router: Router,
              private benefitDataService: MspBenefitDataService,
              private enrolDataService: EnrolDataService,
              private aclDataService: AclDataService) {
    this.appConstants = environment.appConstants;
  }

  /**
   *
   *
   * @param logItem JSON to be logged (combined  with meta-data)
   * @returns {Promise<any>}
   */

  /**
   * Submit a log which automatically includes meta-data.
   *
   * @param {Object} logItem Data to send to log server
   * @param {() => void} [callback]     OPTIONAL - Success callback.
   * @param {() => void} [errCallback]  OPTIONAL - Error callback.
   * @returns {Subscription}
   */
  log(logItem: Object, request_method: string , callback?: () => void, errCallback?: () => void): Subscription{
    const baseUrl = this.appConstants['logBaseUrl'];
    // With Angular 5 we can't pass in undefined to the headers without runtime
    // errors, so now we default to 'n/a'.
    const refNumber = this.enrolDataService.application.referenceNumber ||
                      this.benefitDataService.benefitApp.referenceNumber ||
                      this.dataService.finAssistApp.referenceNumber ||
                      this.dataService.getMspAccountApp().referenceNumber ||
                      'n/a';

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'logsource' : window.location.hostname,
        'timestamp' : moment().toISOString(),
        'program' : 'msp',
        'severity' : 'info',
        'referenceNumber' : refNumber,
        'applicationId' : this.getApplicationId(),
        'request_method' : request_method
    });
    const options = { headers: headers, responseType: 'text' as 'text' };

    const body = {
      meta: this.createMetaData(),
      body: logItem,
    };

    return this.http.post(baseUrl, body, options).subscribe(callback, errCallback);
  }



  /**
   * Submits a log WITHOUT meta-data. Only logItem will be logged. Useful when
   * needing to customize meta-data, e.g. file uploader.
   *
   * @param logItem JSON to be logged
   * @param urlPath OPTIONAL - Additional URL path for logger.
   */
  logIt(logItem: Object, request_method: String , urlPath?: string): Observable<any> {
    const baseUrl = this.appConstants['logBaseUrl'];
    // With Angular 5 we can't pass in undefined to the headers without runtime
    // errors, so now we default to 'n/a'.
    const refNumber = this.enrolDataService.application.referenceNumber ||
                      this.benefitDataService.benefitApp.referenceNumber ||
                      this.dataService.finAssistApp.referenceNumber ||
                      this.dataService.getMspAccountApp().referenceNumber ||
                      'n/a';

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'logsource' : window.location.hostname,
        'timestamp' : moment().toISOString(),
        'program' : 'msp',
        'severity' : 'info',
        'referenceNumber' : refNumber,
        'applicationId' : this.getApplicationId()
    });
    const options = { headers: headers, responseType: 'text' as 'text' };
    return this.http.post(baseUrl + (urlPath || ''), logItem, options);
  }

  createMetaData(){
    const log: LogEntry = new LogEntry();
    log.applicationId = this.getApplicationId();
    log.mspTimestamp = moment().toISOString();
    log.refNumberEnrollment = this.enrolDataService.application.referenceNumber;
    log.refNumberPremiumAssistance = this.dataService.finAssistApp.referenceNumber;
    log.refNumberAccountChange = this.dataService.getMspAccountApp().referenceNumber;

    return log;
  }

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
        if (this.router.url.indexOf('/' + APP_ROUTES.ACCOUNT_LETTER + '/') !== -1){
          return  this.aclDataService.application.uuid ;
        }
        if (this.router.url.indexOf('/' + APP_ROUTES.BENEFIT + '/') !== -1){
          return  this.benefitDataService.benefitApp.uuid ;
        }
    }

}
