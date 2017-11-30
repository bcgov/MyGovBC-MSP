import {Injectable, Inject} from '@angular/core'
import {Http, Headers, RequestOptions} from "@angular/http"
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import { LogEntry } from '../common/logging/log-entry.model';
import { MspDataService } from './msp-data.service';
import * as moment from 'moment';


@Injectable()
export class MspLogService {
  appConstants;
  constructor(private http: Http, private dataService: MspDataService) {
    this.appConstants = environment.appConstants;
  }

  /**
   * Submit a log which automatically includes meta-data.
   *
   * @param logItem JSON to be logged (combined  with meta-data)
   * @returns {Promise<any>}
   */
  log(logItem: Object): Observable<any>{
    let baseUrl = this.appConstants['logBaseUrl']
    let headers = new Headers({'Content-Type': 'application/json'})
    let options = new RequestOptions({headers: headers})
    let body = {
      meta: this.createMetaData(),
      body: logItem,
    }

    console.info("Logging", {
      url: baseUrl,
      body: body.body,
      meta: body.meta
    });

    return this.http.post(baseUrl, body, options);
  }


  /**
   * Submits a log WITHOUT meta-data. Only logItem will be logged. Useful when
   * needing to customize meta-data, e.g. file uploader.
   *
   * @param logItem JSON to be logged
   * @param urlPath OPTIONAL - Additional URL path for logger.
   */
  logIt(logItem: Object, urlPath?: string):Observable<any> {
    let baseUrl = this.appConstants['logBaseUrl']
    let headers = new Headers({'Content-Type': 'application/json'})
    let options = new RequestOptions({headers: headers})
    return this.http.post(baseUrl + (urlPath || ''), logItem, options);
  }

  createMetaData(){
    let log:LogEntry = new LogEntry();
    log.applicationId = this.dataService. getMspApplication().uuid || this.dataService.finAssistApp.uuid;
    log.mspTimestamp = moment().toISOString();
    log.refNumberEnrollment = this.dataService.getMspApplication().referenceNumber;
    log.refNumberPremiumAssistance = this.dataService.finAssistApp.referenceNumber;
    return log;
  }


}
