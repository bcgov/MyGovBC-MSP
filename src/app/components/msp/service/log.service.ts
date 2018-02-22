import {Injectable, Inject} from '@angular/core'
import {Http, Headers, RequestOptions} from "@angular/http"
import { Observable, Subscription } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import { LogEntry } from '../common/logging/log-entry.model';
import { MspDataService } from './msp-data.service';
import * as moment from 'moment';
import { Router } from '@angular/router';



@Injectable()
export class MspLogService {
  appConstants;
  constructor(private http: Http, private dataService: MspDataService ,private router: Router) {
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
  log(logItem: Object, request_method:String , callback?: () => void, errCallback?: () => void): Subscription{
    let baseUrl = this.appConstants['logBaseUrl'];
    let headers = new Headers({
        'Content-Type': 'application/json',
        'logsource' : window.location.hostname,
        'timestamp' : moment().toISOString(),
        'program' : 'msp',
        'severity' : 'info',
        'referenceNumber' : this.dataService.getMspApplication().referenceNumber || this.dataService.finAssistApp.referenceNumber || this.dataService.getMspAccountApp().referenceNumber,
        'applicationId' : this.getApplicationId(),
        'request_method' :request_method
  });

    let options = new RequestOptions({headers: headers});
    let body = {
      meta: this.createMetaData(),
      body: logItem,
    }

    return this.http.post(baseUrl, body, options).subscribe(callback, errCallback);
  }



  /**
   * Submits a log WITHOUT meta-data. Only logItem will be logged. Useful when
   * needing to customize meta-data, e.g. file uploader.
   *
   * @param logItem JSON to be logged
   * @param urlPath OPTIONAL - Additional URL path for logger.
   */
  logIt(logItem: Object,request_method:String , urlPath?: string):Observable<any> {
    let baseUrl = this.appConstants['logBaseUrl'];
    let headers = new Headers({
        'Content-Type': 'application/json',
        'logsource' : window.location.hostname,
        'timestamp' : moment().toISOString(),
        'program' : 'msp',
        'severity' : 'info',
        'referenceNumber' : this.dataService.getMspApplication().referenceNumber || this.dataService.finAssistApp.referenceNumber || this.dataService.getMspAccountApp().referenceNumber,
        'applicationId' : this.getApplicationId()
    });
    let options = new RequestOptions({headers: headers});
    return this.http.post(baseUrl + (urlPath || ''), logItem, options);
  }

  createMetaData(){
    let log:LogEntry = new LogEntry();
    log.applicationId = this.getApplicationId();
    log.mspTimestamp = moment().toISOString();
    log.refNumberEnrollment = this.dataService.getMspApplication().referenceNumber;
    log.refNumberPremiumAssistance = this.dataService.finAssistApp.referenceNumber;
    log.refNumberAccountChange = this.dataService.getMspAccountApp().referenceNumber;

    return log;
  }

    getApplicationId():string {

        console.log(this.router.url);
        if (this.router.url.indexOf("/application/") !== -1){
            return  this.dataService.getMspApplication().uuid;
        }
        if (this.router.url.indexOf("/assistance/") !== -1){
            return  this.dataService.finAssistApp.uuid ;
        }
        if (this.router.url.indexOf("/account/") !== -1){
            return  this.dataService.getMspAccountApp().uuid;
        }
    }

}
