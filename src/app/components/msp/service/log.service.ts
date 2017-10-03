import {Injectable, Inject} from '@angular/core'
import {Http, Headers, RequestOptions} from "@angular/http"
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';


@Injectable()
export class MspLogService {
  appConstants;
  constructor(private http: Http) {
    this.appConstants = environment.appConstants;
  }

  /**
   * Send Log
   * @param logItem - JSON to be logged
   * @param urlPath - <optional> URL Path where the log action is initiated.
   * @returns {Promise<any>}
   */
  log(logItem: Object, urlPath?: string): Promise<any> {
    return this.logIt(logItem, urlPath).toPromise()
  }

  logIt(logItem: Object, urlPath?: string):Observable<any> {
    let baseUrl = this.appConstants['logBaseUrl']
    let headers = new Headers({'Content-Type': 'application/json'})
    let options = new RequestOptions({headers: headers})
    return this.http.post(baseUrl + (urlPath || ''), logItem, options);
  }
}
